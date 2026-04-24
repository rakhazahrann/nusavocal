import { useState, useEffect, useCallback } from "react";
import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from "@dev-amirzubair/react-native-voice";

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
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(true);

  useEffect(() => {
    const setupVoice = async () => {
      try {
        await Voice.isAvailable();
        setIsVoiceAvailable(true);
      } catch (error) {
        setIsVoiceAvailable(true); // Still allow trying
      }
    };

    Voice.onSpeechStart = (_event: SpeechStartEvent) => {
      setIsRecording(true);
      setIsProcessing(false);
      setSpeechError(null);
      setFinalResults(null);
      setTranscription("Mendengarkan...");
    };

    Voice.onSpeechPartialResults = (event: SpeechResultsEvent) => {
      const partialText = event.value?.[0]?.trim();
      if (partialText) {
        setTranscription(`Mendengarkan: ${partialText}`);
      }
    };

    Voice.onSpeechResults = (event: SpeechResultsEvent) => {
      const finalText = event.value?.[0]?.trim();
      setIsRecording(false);
      setIsProcessing(false);
      if (finalText) {
        setTranscription(finalText);
        setFinalResults(finalText);
      }
    };

    Voice.onSpeechEnd = (_event: SpeechEndEvent) => {
      setIsRecording(false);
    };

    Voice.onSpeechError = (event: SpeechErrorEvent) => {
      setIsRecording(false);
      setIsProcessing(false);
      const message =
        event.error?.message ||
        "Terjadi kendala saat mengenali suara. Coba lagi.";
      setSpeechError(message);
    };

    setupVoice();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {
        Voice.removeAllListeners();
      });
    };
  }, []);

  const startRecording = useCallback(async (locale: string = "id-ID") => {
    setSpeechError(null);
    setTranscription("");
    try {
      await Voice.start(locale);
    } catch (error: any) {
      setIsRecording(false);
      setIsProcessing(false);
      setSpeechError(error?.message || "Gagal memulai speech recognition.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    setIsProcessing(true);
    try {
      await Voice.stop();
    } catch (error) {
      setIsProcessing(false);
    }
  }, []);

  const resetTranscription = useCallback(() => {
    setTranscription("");
    setSpeechError(null);
  }, []);

  return {
    isRecording,
    isProcessing,
    transcription,
    finalResults,
    speechError,
    isVoiceAvailable,
    startRecording,
    stopRecording,
    resetTranscription,
  };
};
