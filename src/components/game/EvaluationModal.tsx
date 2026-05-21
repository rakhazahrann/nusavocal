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
import { colors } from "@/constants/colors";

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
  const accent = good ? colors.success : mid ? colors.gold : colors.danger;

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

          <View style={[fb.feedbackBanner, { backgroundColor: good ? colors.black : colors.lightGray }]}>
            <MaterialIcons name={good ? "check-circle" : "error"} size={24} color={good ? colors.white : colors.black} />
            <View style={{ flex: 1 }}>
               <Text style={[fb.feedbackText, { color: good ? colors.white : colors.black }]}>
                 <Text style={{ fontFamily: "Poppins-Bold" }}>{label}!</Text> {good ? "Pelafalan kamu sudah jelas dan natural. Terus pertahaman ya!" : "Coba ulangi sekali lagi dengan lebih jelas."}
               </Text>
            </View>
          </View>

          <View style={fb.audioBox}>
             <TouchableOpacity style={fb.audioCircleBtn}>
                <MaterialIcons name="play-arrow" size={24} color={colors.slate} />
             </TouchableOpacity>
             <Text style={fb.audioMainTxt}>Dengar pengucapan yang benar</Text>
             <View style={fb.fakeWaves}>
               {[3, 6, 4, 8, 5, 7, 4].map((h, i) => (
                 <View key={i} style={{ width: 2, height: h*1.5, backgroundColor: colors.success, borderRadius: 1 }} />
               ))}
             </View>
          </View>

          <View style={fb.actionGroup}>
             <TouchableOpacity style={fb.secBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={fb.secBtnTxt}>{good ? "Ulangi" : "Tutup"}</Text>
             </TouchableOpacity>
              <TouchableOpacity 
                 style={[fb.priBtn, { backgroundColor: good ? colors.black : colors.gray }]} 
                 onPress={() => {
                   if (good && onAction) {
                      onAction();
                   }
                   onClose();
                 }} 
                 activeOpacity={0.8}
              >
                 <Text style={[fb.priBtnTxt, { color: good ? colors.white : colors.black }]}>{good ? "Lanjut" : "Latihan lagi"}</Text>
                 <MaterialIcons name={good ? "arrow-forward" : "mic"} size={18} color={good ? colors.white : colors.black} />
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
    backgroundColor: colors.blackOverlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: colors.gray,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gray,
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
    backgroundColor: colors.lightGray,
  },
  smLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: colors.darkGray,
  },
  mainQuote: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: colors.black,
  },
  syllableTxt: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: colors.mediumGray,
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
    fontFamily: "Poppins-Bold",
    fontSize: 26,
  },
  ringLabel: {
    fontFamily: "Poppins-Medium",
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
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 24,
  },
  audioCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: colors.black, shadowOpacity: 0.05, shadowRadius: 3, shadowOffset: { width: 0, height: 2 },
  },
  audioMainTxt: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: colors.black,
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
    backgroundColor: colors.lightGray,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  secBtnTxt: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.black,
  },
  priBtn: {
    flex: 2,
    backgroundColor: colors.black,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  priBtnTxt: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: colors.white,
  },
});
