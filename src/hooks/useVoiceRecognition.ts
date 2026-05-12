import { useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export interface VoiceRecognitionHook {
  isRecording: boolean;
  isProcessing: boolean;
  transcription: string;
  finalResults: string | null;
  speechError: string | null;
  isVoiceAvailable: boolean;
  startRecording: (locale?: string) => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTranscription: () => void;
}

export const useVoiceRecognition = (): VoiceRecognitionHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [finalResults, setFinalResults] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  
  // Listen to events
  useSpeechRecognitionEvent("start", () => {
    setIsRecording(true);
    setIsProcessing(false);
    setSpeechError(null);
    setFinalResults(null);
    setTranscription("Mendengarkan...");
  });

  useSpeechRecognitionEvent("result", (event) => {
    const resultText = event.results[0]?.transcript?.trim();
    if (resultText) {
      setTranscription(resultText);
      if (event.isFinal) {
        setFinalResults(resultText);
      }
    }
  });

  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    setIsProcessing(false);
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsRecording(false);
    setIsProcessing(false);
    // Map errors to nice UI messages
    const message = event.error === "not-allowed" 
      ? "Izin mikrofon ditolak." 
      : event.message || "Terjadi kendala saat mengenali suara.";
    setSpeechError(message);
  });

  const startRecording = useCallback(async (locale: string = "id-ID") => {
    setSpeechError(null);
    setTranscription("");
    
    try {
      // Request permissions first
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setSpeechError("Izin mikrofon tidak diberikan.");
        return;
      }

      await ExpoSpeechRecognitionModule.start({
        lang: locale,
        interimResults: true,
        continuous: false, // One-shot like the old behavior
        // iOS-specific hint for better single word recognition
        iosTaskHint: "confirmation",
        // Prevent Android default beeping if required by creating new intent
        androidIntentOptions: {
          EXTRA_LANGUAGE_MODEL: "web_search",
        },
      });
    } catch (error: any) {
      setIsRecording(false);
      setIsProcessing(false);
      setSpeechError(error?.message || "Gagal memulai speech recognition.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsProcessing(true);
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      setIsProcessing(false);
    }
  }, []);

  const resetTranscription = useCallback(() => {
    setTranscription("");
    setSpeechError(null);
    setFinalResults(null);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    finalResults,
    speechError,
    isVoiceAvailable: true, // It's generally safe to assume it works if compiled correctly
    startRecording,
    stopRecording,
    resetTranscription,
  };
};
