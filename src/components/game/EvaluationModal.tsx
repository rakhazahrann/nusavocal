import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface EvaluationModalProps {
  visible: boolean;
  score: number;
  onClose: () => void;
  spoken: string;
  target: string;
  onAction?: () => void;
}

export const EvaluationModal = ({
  visible,
  score,
  onClose,
  spoken,
  target,
  onAction,
}: EvaluationModalProps) => {
  const pct = Math.round(score * 100);
  const good = pct >= 74;
  const mid = pct >= 50 && pct < 74;

  const label = good ? "Bagus!" : mid ? "Lumayan!" : "Coba Lagi";
  const accent = good ? "#22C55E" : mid ? "#F59E0B" : "#EF4444";

  // Simple phonetic-split for visuals
  const syllableBreakdown = target.split(' ').map(w => {
    if(w.length > 4) return w.slice(0, Math.floor(w.length/2)) + "-" + w.slice(Math.floor(w.length/2));
    return w;
  }).join(' ');

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={fb.overlay}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        
        <View style={fb.sheet}>
          <View style={fb.dragHandle} />

          <View style={fb.sheetHeader}>
            <View style={{ flex: 1 }}>
              <View style={fb.userRowInline}>
                <Image 
                   source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4" }} 
                   style={fb.miniAvatar}
                />
                <Text style={fb.smLabel}>Kamu mengatakan</Text>
              </View>
              <Text style={fb.mainQuote}>
                “<Text style={{ color: accent }}>{spoken || target}</Text>”
              </Text>
              <Text style={fb.syllableTxt}>{syllableBreakdown.toLowerCase()}</Text>
            </View>

            <View style={[fb.ringWrapper, { borderColor: accent }]}>
               <Text style={[fb.ringValue, { color: accent }]}>{pct}</Text>
               <Text style={[fb.ringLabel, { color: accent }]}>{label}</Text>
            </View>
          </View>

          <View style={[fb.feedbackBanner, { backgroundColor: good ? "#000000" : "#F2F2F7" }]}>
            <MaterialIcons name={good ? "check-circle" : "error"} size={24} color={good ? "#FFFFFF" : "#000000"} />
            <View style={{ flex: 1 }}>
               <Text style={[fb.feedbackText, { color: good ? "#FFFFFF" : "#000000" }]}>
                 <Text style={{ fontFamily: "SpaceGrotesk-Bold" }}>{label}!</Text> {good ? "Pelafalan kamu sudah jelas dan natural. Terus pertahankan ya!" : "Coba ulangi sekali lagi dengan lebih jelas."}
               </Text>
            </View>
          </View>

          <View style={fb.audioBox}>
             <TouchableOpacity style={fb.audioCircleBtn}>
                <MaterialIcons name="play-arrow" size={24} color="#0F172A" />
             </TouchableOpacity>
             <Text style={fb.audioMainTxt}>Dengar pengucapan yang benar</Text>
             <View style={fb.fakeWaves}>
               {[3, 6, 4, 8, 5, 7, 4].map((h, i) => (
                 <View key={i} style={{ width: 2, height: h*1.5, backgroundColor: "#22C55E", borderRadius: 1 }} />
               ))}
             </View>
          </View>

          <View style={fb.actionGroup}>
             <TouchableOpacity style={fb.secBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={fb.secBtnTxt}>{good ? "Ulangi" : "Tutup"}</Text>
             </TouchableOpacity>
              <TouchableOpacity 
                 style={[fb.priBtn, { backgroundColor: good ? "#000000" : "#E5E5EA" }]} 
                 onPress={() => {
                   if (good && onAction) {
                      onAction();
                   }
                   onClose();
                 }} 
                 activeOpacity={0.8}
              >
                 <Text style={[fb.priBtnTxt, { color: good ? "#FFFFFF" : "#000000" }]}>{good ? "Lanjut" : "Latihan lagi"}</Text>
                 <MaterialIcons name={good ? "arrow-forward" : "mic"} size={18} color={good ? "#FFFFFF" : "#000000"} />
              </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const fb = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#E5E5EA",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E5EA",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  userRowInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
  },
  smLabel: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    color: "#666666",
  },
  mainQuote: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 28,
    color: "#000000",
  },
  syllableTxt: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 18,
    color: "#888888",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  ringWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  ringValue: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 26,
  },
  ringLabel: {
    fontFamily: "SpaceGrotesk-Medium",
    fontSize: 10,
    marginTop: -2,
  },
  feedbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
  },
  feedbackText: {
    fontFamily: "SpaceGrotesk-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginBottom: 24,
  },
  audioCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  audioMainTxt: {
    flex: 1,
    fontFamily: "SpaceGrotesk-SemiBold",
    fontSize: 13,
    color: "#000000",
  },
  fakeWaves: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 12,
  },
  secBtn: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secBtnTxt: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    color: "#000000",
  },
  priBtn: {
    flex: 2,
    backgroundColor: "#000000",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  priBtnTxt: {
    fontFamily: "SpaceGrotesk-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
