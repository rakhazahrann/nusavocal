import React, { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { UserAvatar } from "@/components/common/UserAvatar";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { colors } from "@/constants/colors";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { mediaService } from "@/services/mediaService";

const UI = {
  borderLight: "rgba(0,0,0,0.06)",
  surfaceElevated: "#FFFCF5",
  warning: "#E8A838",
  warningLight: "#FFF3D6",
  streak: "#E8652B",
  xp: "#7C5CFC",
  hero: ["#3B9B6A", "#2B7A4E", "#1D5E3A"] as const,
  xpGradient: ["#9070FF", "#7C5CFC"] as const,
};

const DUMMY_PROFILE = {
  name: "Nara Penjelajah",
  username: "@penjelajah",
  joinedAt: "Bergabung sejak Januari 2026",
  level: 8,
  currentXp: 420,
  nextLevelXp: 900,
  totalXp: 6420,
  streak: 7,
  rank: 10,
  completedStages: 20,
};

const DUMMY_ACHIEVEMENTS = [
  { id: "first", icon: "flag" as const, label: "Langkah Pertama", detail: "Stage pertama selesai", color: colors.accent },
  { id: "streak", icon: "local-fire-department" as const, label: "Api Seminggu", detail: "Runtun belajar 7 hari", color: UI.streak },
  { id: "speaker", icon: "record-voice-over" as const, label: "Berani Bicara", detail: "10 latihan suara", color: colors.adventure },
];

const DUMMY_ACTIVITY = [
  { id: "market", icon: "storefront" as const, title: "Percakapan di Pasar", detail: "Stage selesai · Skor 92", time: "Hari ini", color: colors.accent },
  { id: "vocab", icon: "translate" as const, title: "Kosakata Perjalanan", detail: "12 kata baru dipelajari", time: "Kemarin", color: UI.xp },
  { id: "streak", icon: "local-fire-department" as const, title: "Runtun belajar bertambah", detail: "Belajar 7 hari tanpa jeda", time: "2 hari lalu", color: UI.streak },
];

const StatCard = ({ icon, label, value, color }: { icon: keyof typeof MaterialIcons.glyphMap; label: string; value: string; color: string }) => (
  <View style={styles.statCard} accessible accessibilityLabel={`${label}: ${value}`}>
    <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
      <MaterialIcons name={icon} size={21} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ProfileScreen = ({ navigation }: any) => {
  const progress = DUMMY_PROFILE.currentXp / DUMMY_PROFILE.nextLevelXp;
  const { profile, updateProfile, signOut, isLoading } = useAuthStore();
  const isAdmin = profile?.role === "admin";
  const displayName = profile?.nickname || profile?.username || "Penjelajah";
  const joinedAt = profile?.created_at
    ? `Bergabung sejak ${new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(profile.created_at))}`
    : "";
  const [editVisible, setEditVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const openEdit = () => {
    setNickname(profile?.nickname || "");
    setUsername(profile?.username || "");
    setAvatar(profile?.avatar_url || "");
    setEditVisible(true);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const saveProfile = async () => {
    if (!nickname.trim() || !username.trim()) {
      Alert.alert("Data belum lengkap", "Nama dan username wajib diisi.");
      return;
    }

    try {
      const avatarUrl = await mediaService.uploadImage(avatar, `avatars/${profile?.id}`);
      const result = await updateProfile({
        nickname: nickname.trim(),
        username: username.trim(),
        avatar_url: avatarUrl || null,
      });
      if (!result.success) throw new Error(result.error);
      setEditVisible(false);
    } catch (error: any) {
      Alert.alert("Gagal memperbarui profil", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigation.getParent()?.reset({ index: 0, routes: [{ name: ROUTES.AUTH }] });
  };

  const confirmLogout = () => Alert.alert(
    "Keluar dari akun?",
    "Kamu perlu login kembali untuk melanjutkan.",
    [
      { text: "Batal", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogout },
    ],
  );

  return (
    <Screen padded={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <EnterAnimatedView style={styles.content}>
          {isAdmin && (
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.getParent()?.navigate(ROUTES.ADMIN)}
              activeOpacity={0.8}
            >
              <View style={styles.adminIcon}>
                <MaterialIcons name="admin-panel-settings" size={24} color={colors.white} />
              </View>
              <View style={styles.adminCopy}>
                <Text style={styles.adminLabel}>ADMIN MODE</Text>
                <Text style={styles.adminTitle}>Buka Studio Konten</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={22} color={colors.white} />
            </TouchableOpacity>
          )}

          <LinearGradient colors={UI.hero} style={styles.heroCard}>
            <View style={styles.heroPatternOne} />
            <View style={styles.heroPatternTwo} />
            <View style={styles.avatarFrame}>
              <UserAvatar name={displayName} avatarUrl={profile?.avatar_url} size={78} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.username}>@{profile?.username || "penjelajah"}</Text>
              <Text style={styles.joinedAt}>{joinedAt}</Text>
            </View>
            <TouchableOpacity style={styles.editHeroButton} onPress={openEdit} accessibilityLabel="Edit profil">
              <MaterialIcons name="edit" size={18} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.leagueBadge}>
              <MaterialIcons name="workspace-premium" size={20} color={colors.gold} />
              <Text style={styles.leagueText}>Liga Rimba</Text>
            </View>
          </LinearGradient>

          <View style={styles.levelCard} accessible accessibilityLabel={`Level ${DUMMY_PROFILE.level}, ${DUMMY_PROFILE.currentXp} dari ${DUMMY_PROFILE.nextLevelXp} EXP`}>
            <View style={styles.levelHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>PERJALANANMU</Text>
                <Text style={styles.levelTitle}>Level {DUMMY_PROFILE.level}</Text>
              </View>
              <Text style={styles.levelXp}>{DUMMY_PROFILE.currentXp} / {DUMMY_PROFILE.nextLevelXp} XP</Text>
            </View>
            <View style={styles.progressTrack}>
              <LinearGradient
                colors={UI.xpGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.progressHint}>{DUMMY_PROFILE.nextLevelXp - DUMMY_PROFILE.currentXp} XP lagi menuju Level {DUMMY_PROFILE.level + 1}</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard icon="auto-awesome" label="Total XP" value={DUMMY_PROFILE.totalXp.toLocaleString("id-ID")} color={UI.xp} />
            <StatCard icon="local-fire-department" label="Runtun" value={`${DUMMY_PROFILE.streak} hari`} color={UI.streak} />
            <StatCard icon="emoji-events" label="Peringkat" value={`#${DUMMY_PROFILE.rank}`} color={colors.gold} />
            <StatCard icon="check-circle" label="Stage selesai" value={`${DUMMY_PROFILE.completedStages}`} color={colors.accent} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pencapaian</Text>
            <Text style={styles.sectionMeta}>3 dari 12 terbuka</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsRow}>
            {DUMMY_ACHIEVEMENTS.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}18` }]}>
                  <MaterialIcons name={achievement.icon} size={28} color={achievement.color} />
                </View>
                <Text style={styles.achievementLabel}>{achievement.label}</Text>
                <Text style={styles.achievementDetail}>{achievement.detail}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktivitas terbaru</Text>
            <Text style={styles.sectionMeta}>7 hari terakhir</Text>
          </View>
          <View style={styles.activityCard}>
            {DUMMY_ACTIVITY.map((activity, index) => (
              <View key={activity.id} style={[styles.activityRow, index < DUMMY_ACTIVITY.length - 1 && styles.activityDivider]}>
                <View style={[styles.activityIcon, { backgroundColor: `${activity.color}18` }]}>
                  <MaterialIcons name={activity.icon} size={22} color={activity.color} />
                </View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDetail}>{activity.detail}</Text>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </View>

          <LinearGradient colors={[UI.warningLight, UI.surfaceElevated]} style={styles.focusCard}>
            <View style={styles.focusIcon}>
              <MaterialIcons name="explore" size={26} color={UI.warning} />
            </View>
            <View style={styles.focusCopy}>
              <Text style={styles.focusLabel}>Target berikutnya</Text>
              <Text style={styles.focusTitle}>Percakapan di Stasiun</Text>
              <Text style={styles.focusDetail}>Selesaikan 8 kosakata untuk membuka latihan suara.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={25} color={colors.darkGray} />
          </LinearGradient>

          <View style={styles.accountActions}>
            <TouchableOpacity style={styles.editProfileButton} onPress={openEdit}>
              <MaterialIcons name="manage-accounts" size={21} color={colors.text} />
              <Text style={styles.editProfileText}>Edit profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
              <MaterialIcons name="logout" size={21} color={colors.danger} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </EnterAnimatedView>
      </ScrollView>

      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.editModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>AKUN</Text>
                <Text style={styles.modalTitle}>Edit profil</Text>
              </View>
              <TouchableOpacity style={styles.modalClose} onPress={() => setEditVisible(false)}>
                <MaterialIcons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.avatarEditor} onPress={pickAvatar}>
              <UserAvatar name={nickname || username} avatarUrl={avatar} size={88} />
              <View style={styles.cameraBadge}>
                <MaterialIcons name="photo-camera" size={18} color={colors.white} />
              </View>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Nama tampilan</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Nama tampilan"
              placeholderTextColor={colors.mutedText}
              maxLength={40}
            />
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor={colors.mutedText}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            <Text style={styles.emailHint}>{profile?.email}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditVisible(false)} disabled={isLoading}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveProfile} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.saveText}>Simpan</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 124, alignItems: "center" },
  content: { width: "100%", maxWidth: 760 },
  adminButton: { minHeight: 76, borderRadius: 20, padding: 14, marginBottom: 14, flexDirection: "row", alignItems: "center", backgroundColor: colors.navy },
  adminIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, marginRight: 12 },
  adminCopy: { flex: 1 },
  adminLabel: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 1.2, color: colors.accentLight },
  adminTitle: { fontFamily: "Poppins-Bold", fontSize: 16, color: colors.white },
  heroCard: { minHeight: 144, borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  heroPatternOne: { position: "absolute", width: 150, height: 150, borderRadius: 75, borderWidth: 28, borderColor: "rgba(255,255,255,0.06)", right: -35, top: -65 },
  heroPatternTwo: { position: "absolute", width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(255,255,255,0.05)", left: -30, bottom: -45 },
  avatarFrame: { padding: 4, borderRadius: 46, backgroundColor: colors.white, marginRight: 14 },
  heroCopy: { flex: 1, minWidth: 0 },
  editHeroButton: { position: "absolute", right: 14, bottom: 14, width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.25)" },
  profileName: { fontFamily: "Poppins-Bold", fontSize: 20, lineHeight: 27, color: colors.white },
  username: { fontFamily: "Poppins-Medium", fontSize: 13, color: "rgba(255,255,255,0.78)" },
  joinedAt: { fontFamily: "Poppins-Regular", fontSize: 10, color: "rgba(255,255,255,0.64)", marginTop: 5 },
  leagueBadge: { position: "absolute", right: 14, top: 14, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: "rgba(0,0,0,0.20)" },
  leagueText: { fontFamily: "Poppins-SemiBold", fontSize: 10, color: colors.white },
  levelCard: { marginTop: 14, padding: 17, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  levelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sectionEyebrow: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 1.2, color: UI.xp },
  levelTitle: { fontFamily: "Poppins-Bold", fontSize: 19, color: colors.text },
  levelXp: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: colors.darkGray },
  progressTrack: { height: 9, borderRadius: 5, backgroundColor: colors.parchment, overflow: "hidden", marginTop: 12 },
  progressFill: { height: "100%", borderRadius: 5 },
  progressHint: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray, marginTop: 7 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  statCard: { width: "48%", flexGrow: 1, minHeight: 116, borderRadius: 19, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  statIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  statValue: { fontFamily: "Poppins-Bold", fontSize: 20, lineHeight: 25, color: colors.text },
  statLabel: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray },
  sectionHeader: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", marginTop: 24, marginBottom: 11 },
  sectionTitle: { fontFamily: "Poppins-Bold", fontSize: 18, color: colors.text },
  sectionMeta: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray },
  achievementsRow: { gap: 10, paddingRight: 4 },
  achievementCard: { width: 156, minHeight: 148, borderRadius: 19, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  achievementIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  achievementLabel: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  achievementDetail: { fontFamily: "Poppins-Regular", fontSize: 10, lineHeight: 15, color: colors.darkGray, marginTop: 3 },
  activityCard: { borderRadius: 20, paddingHorizontal: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: UI.borderLight },
  activityRow: { minHeight: 78, flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: UI.borderLight },
  activityIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 11 },
  activityCopy: { flex: 1, minWidth: 0 },
  activityTitle: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  activityDetail: { fontFamily: "Poppins-Regular", fontSize: 10, color: colors.darkGray, marginTop: 2 },
  activityTime: { maxWidth: 58, textAlign: "right", fontFamily: "Poppins-Regular", fontSize: 9, color: colors.mutedText, marginLeft: 6 },
  focusCard: { marginTop: 16, minHeight: 96, borderRadius: 20, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border },
  focusIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginRight: 12 },
  focusCopy: { flex: 1, minWidth: 0 },
  focusLabel: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 0.8, color: UI.warning },
  focusTitle: { fontFamily: "Poppins-SemiBold", fontSize: 14, color: colors.text },
  focusDetail: { fontFamily: "Poppins-Regular", fontSize: 10, lineHeight: 15, color: colors.darkGray, marginTop: 2 },
  accountActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  editProfileButton: { flex: 1, height: 52, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  editProfileText: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  logoutButton: { flex: 1, height: 52, borderRadius: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.dangerLight, borderWidth: 1, borderColor: `${colors.danger}35` },
  logoutText: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.danger },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.blackOverlayDark },
  editModal: { width: "100%", maxWidth: 520, alignSelf: "center", padding: 20, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.surface },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  modalEyebrow: { fontFamily: "Poppins-Bold", fontSize: 9, letterSpacing: 1.3, color: colors.accentDark },
  modalTitle: { fontFamily: "Poppins-Bold", fontSize: 23, color: colors.text },
  modalClose: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.lightGray },
  avatarEditor: { width: 96, alignSelf: "center", marginBottom: 20 },
  cameraBadge: { position: "absolute", right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, borderWidth: 2, borderColor: colors.surface },
  inputLabel: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.darkGray, marginBottom: 5 },
  input: { height: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceElevated, paddingHorizontal: 13, fontFamily: "Poppins-Regular", fontSize: 13, color: colors.text, marginBottom: 13 },
  emailHint: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.mutedText },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  cancelButton: { flex: 1, height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.lightGray },
  cancelText: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text },
  saveButton: { flex: 1, height: 48, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  saveText: { fontFamily: "Poppins-Bold", fontSize: 13, color: colors.white },
});
