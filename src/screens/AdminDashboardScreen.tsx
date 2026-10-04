import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/Text";
import { colors } from "@/constants/colors";
import { adminService, AdminUserSummary } from "@/services/adminService";
import { mediaService } from "@/services/mediaService";
import { Course, GameScenario, Stage, VocabQuestion } from "@/types/store";

type Section = "courses" | "stages" | "lessons" | "users";
type Editor =
  | { kind: "course"; item?: Course }
  | { kind: "stage"; item?: Stage }
  | { kind: "vocab"; item?: VocabQuestion }
  | { kind: "scenario"; item?: GameScenario }
  | null;

const emptyForm = {
  title: "",
  description: "",
  image: "",
  sortOrder: "0",
  status: "draft" as "draft" | "published",
  courseId: "",
  xPosition: "0.35",
  isActive: true,
  question: "",
  options: ["", ""],
  correctIndex: 0,
  npcName: "",
  npcText: "",
  expectedVoice: "",
  audioUrl: "",
};

export const AdminDashboardScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  const [section, setSection] = useState<Section>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [vocab, setVocab] = useState<VocabQuestion[]>([]);
  const [scenarios, setScenarios] = useState<GameScenario[]>([]);
  const [editor, setEditor] = useState<Editor>(null);
  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBase = useCallback(async () => {
    setIsLoading(true);
    try {
      const [nextCourses, nextStages] = await Promise.all([adminService.getCourses(), adminService.getStages()]);
      setCourses(nextCourses);
      setStages(nextStages);
      setSelectedStageId((current) => current ?? nextStages[0]?.id ?? null);
      setError(null);
    } catch (requestError: any) {
      setError(requestError.message || "Gagal memuat data admin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadBase(); }, [loadBase]);

  useEffect(() => {
    if (section !== "users") return;
    adminService.getUsers().then(setUsers).catch((requestError) => setError(requestError.message));
  }, [section]);

  useEffect(() => {
    if (!selectedStageId) {
      setVocab([]);
      setScenarios([]);
      return;
    }
    Promise.all([adminService.getVocab(selectedStageId), adminService.getScenarios(selectedStageId)])
      .then(([nextVocab, nextScenarios]) => {
        setVocab(nextVocab);
        setScenarios(nextScenarios);
      })
      .catch((requestError) => setError(requestError.message));
  }, [selectedStageId]);

  const openEditor = (nextEditor: Exclude<Editor, null>) => {
    setEditor(nextEditor);
    if (nextEditor.kind === "course") {
      const item = nextEditor.item;
      setForm({ ...emptyForm, title: item?.title || "", description: item?.description || "", image: item?.cover_url || "", sortOrder: String(item?.sort_order ?? courses.length), status: item?.status || "draft" });
    } else if (nextEditor.kind === "stage") {
      const item = nextEditor.item;
      setForm({ ...emptyForm, title: item?.label || "", description: item?.description || "", image: item?.image_url || "", sortOrder: String(item?.sort_order ?? stages.length), status: item?.publication_status || "draft", courseId: String(item?.course_id ?? courses[0]?.id ?? ""), xPosition: String(item?.x_position ?? 0.35), isActive: item?.is_active ?? true });
    } else if (nextEditor.kind === "vocab") {
      const item = nextEditor.item;
      const options = item?.options?.map((option) => option.option_text) || ["", ""];
      setForm({ ...emptyForm, question: item?.question_text || "", image: item?.image_url || "", sortOrder: String(item?.sort_order ?? vocab.length), options, correctIndex: Math.max(0, item?.options?.findIndex((option) => option.is_correct) ?? 0) });
    } else {
      const item = nextEditor.item;
      setForm({ ...emptyForm, image: item?.background_image_url || "", sortOrder: String(item?.sort_order ?? scenarios.length), npcName: item?.npc_name || "", npcText: item?.npc_text || "", expectedVoice: item?.expected_voice_text || "", audioUrl: item?.voice_audio_url || "" });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.8 });
    if (!result.canceled) setForm((current) => ({ ...current, image: result.assets[0].uri }));
  };

  const save = async () => {
    if (!editor) return;
    if ((editor.kind === "course" || editor.kind === "stage") && !form.title.trim()) return Alert.alert("Data belum lengkap", "Judul wajib diisi.");
    if (editor.kind === "vocab" && (!form.question.trim() || form.options.some((option) => !option.trim()))) return Alert.alert("Data belum lengkap", "Pertanyaan dan semua pilihan wajib diisi.");
    if (editor.kind === "scenario" && (!form.npcName.trim() || !form.npcText.trim() || !form.expectedVoice.trim())) return Alert.alert("Data belum lengkap", "Nama NPC, teks, dan jawaban suara wajib diisi.");

    setIsSaving(true);
    try {
      const folder = editor.kind === "course" ? "courses" : editor.kind === "stage" ? "stages" : editor.kind === "vocab" ? "vocabs" : "scenarios";
      const image = await mediaService.uploadImage(form.image, folder);
      if (editor.kind === "course") {
        const payload = { title: form.title.trim(), description: form.description.trim() || null, cover_url: image || null, sort_order: Number(form.sortOrder) || 0, status: form.status };
        editor.item ? await adminService.updateCourse(editor.item.id, payload) : await adminService.createCourse(payload);
      } else if (editor.kind === "stage") {
        const payload = { course_id: form.courseId ? Number(form.courseId) : null, label: form.title.trim(), description: form.description.trim() || null, image_url: image || null, x_position: Number(form.xPosition) || 0.35, sort_order: Number(form.sortOrder) || 0, is_active: form.isActive, publication_status: form.status };
        editor.item ? await adminService.updateStage(editor.item.id, payload) : await adminService.createStage(payload);
      } else if (editor.kind === "vocab" && selectedStageId) {
        await adminService.saveVocab(selectedStageId, { question_text: form.question.trim(), image_url: image || null, sort_order: Number(form.sortOrder) || 0, options: form.options.map((option, index) => ({ option_text: option.trim(), is_correct: index === form.correctIndex, sort_order: index })) }, editor.item?.id);
      } else if (editor.kind === "scenario" && selectedStageId) {
        await adminService.saveScenario(selectedStageId, { background_image_url: image || null, npc_name: form.npcName.trim(), npc_text: form.npcText.trim(), expected_voice_text: form.expectedVoice.trim(), voice_audio_url: form.audioUrl.trim() || null, sort_order: Number(form.sortOrder) || 0 }, editor.item?.id);
      }
      setEditor(null);
      await loadBase();
      if (selectedStageId) {
        const [nextVocab, nextScenarios] = await Promise.all([adminService.getVocab(selectedStageId), adminService.getScenarios(selectedStageId)]);
        setVocab(nextVocab);
        setScenarios(nextScenarios);
      }
    } catch (saveError: any) {
      Alert.alert("Gagal menyimpan", saveError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const archive = (label: string, action: () => Promise<void>) => Alert.alert(
    "Arsipkan konten?",
    `${label} tidak akan tampil ke user. Progress tetap tersimpan.`,
    [{ text: "Batal", style: "cancel" }, { text: "Arsipkan", style: "destructive", onPress: async () => { await action(); await loadBase(); } }],
  );

  const sections: Array<{ key: Section; label: string; icon: keyof typeof MaterialIcons.glyphMap }> = [
    { key: "courses", label: "Course", icon: "library-books" },
    { key: "stages", label: "Stage", icon: "route" },
    { key: "lessons", label: "Lesson", icon: "quiz" },
    { key: "users", label: "User", icon: "people" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.shell, wide && styles.shellWide]}>
        <View style={[styles.sidebar, !wide && styles.sidebarMobile]}>
          <View style={styles.brandRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}><MaterialIcons name="arrow-back" size={21} color={colors.text} /></TouchableOpacity>
            <View><Text style={styles.brand}>Studio Admin</Text><Text style={styles.brandMeta}>NusaVocal CMS</Text></View>
          </View>
          <ScrollView horizontal={!wide} showsHorizontalScrollIndicator={false} contentContainerStyle={!wide && styles.mobileNav}>
            {sections.map((item) => (
              <Pressable key={item.key} onPress={() => setSection(item.key)} style={[styles.navItem, section === item.key && styles.navItemActive]}>
                <MaterialIcons name={item.icon} size={20} color={section === item.key ? colors.white : colors.darkGray} />
                <Text style={[styles.navText, section === item.key && styles.navTextActive]}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
          <View style={styles.pageHeader}>
            <View><Text style={styles.eyebrow}>CONTENT MANAGEMENT</Text><Text style={styles.pageTitle}>{sections.find((item) => item.key === section)?.label}</Text></View>
            {section !== "users" && <TouchableOpacity style={styles.primaryButton} onPress={() => openEditor({ kind: section === "courses" ? "course" : section === "stages" ? "stage" : "vocab" })}><MaterialIcons name="add" size={20} color={colors.white} /><Text style={styles.primaryButtonText}>Tambah</Text></TouchableOpacity>}
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
          {isLoading ? <ActivityIndicator style={styles.loader} size="large" color={colors.accent} /> : (
            <>
              {section === "courses" && <View style={styles.grid}>{courses.map((course) => <ContentCard key={course.id} title={course.title} subtitle={`${course.status === "published" ? "Published" : "Draft"} · ${stages.filter((stage) => stage.course_id === course.id).length} stage`} image={course.cover_url} onEdit={() => openEditor({ kind: "course", item: course })} onArchive={() => archive(course.title, () => adminService.archiveCourse(course.id))} />)}</View>}
              {section === "stages" && <View style={styles.grid}>{stages.map((stage) => <ContentCard key={stage.id} title={stage.label} subtitle={`${stage.publication_status === "published" ? "Published" : "Draft"} · ${courses.find((course) => course.id === stage.course_id)?.title || "Tanpa course"}`} image={stage.image_url} onEdit={() => openEditor({ kind: "stage", item: stage })} onArchive={() => archive(stage.label, () => adminService.archiveStage(stage.id))} />)}</View>}
              {section === "lessons" && (
                <View>
                  <Text style={styles.fieldLabel}>Pilih stage</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{stages.map((stage) => <Pressable key={stage.id} onPress={() => setSelectedStageId(stage.id)} style={[styles.chip, selectedStageId === stage.id && styles.chipActive]}><Text style={[styles.chipText, selectedStageId === stage.id && styles.chipTextActive]}>{stage.label}</Text></Pressable>)}</ScrollView>
                  <View style={styles.lessonColumns}>
                    <LessonSection title="Vocabulary" onAdd={() => openEditor({ kind: "vocab" })}>{vocab.map((question) => <LessonRow key={question.id} title={question.question_text} meta={`${question.options.length} pilihan`} onEdit={() => openEditor({ kind: "vocab", item: question })} onArchive={() => archive(question.question_text, () => adminService.archiveVocab(question.id))} />)}</LessonSection>
                    <LessonSection title="Scenario" onAdd={() => openEditor({ kind: "scenario" })}>{scenarios.map((scenario) => <LessonRow key={scenario.id} title={scenario.npc_name} meta={scenario.npc_text} onEdit={() => openEditor({ kind: "scenario", item: scenario })} onArchive={() => archive(scenario.npc_name, () => adminService.archiveScenario(scenario.id))} />)}</LessonSection>
                  </View>
                </View>
              )}
              {section === "users" && <View style={styles.userTable}>{users.map((user) => <View key={user.user_id} style={styles.userRow}><View style={styles.userAvatar}><Text style={styles.userAvatarText}>{(user.nickname || user.username).slice(0, 2).toUpperCase()}</Text></View><View style={styles.userCopy}><Text style={styles.userName}>{user.nickname || user.username}</Text><Text style={styles.userMeta}>@{user.username} · {user.role}</Text></View><View style={styles.userStat}><Text style={styles.userStatValue}>{Number(user.total_xp).toLocaleString("id-ID")}</Text><Text style={styles.userMeta}>XP</Text></View><View style={styles.userStat}><Text style={styles.userStatValue}>{user.completed_stages}</Text><Text style={styles.userMeta}>stage</Text></View></View>)}</View>}
            </>
          )}
        </ScrollView>
      </View>

      <EditorModal editor={editor} form={form} setForm={setForm} courses={courses} isSaving={isSaving} onPickImage={pickImage} onClose={() => setEditor(null)} onSave={save} />
    </SafeAreaView>
  );
};

const ContentCard = ({ title, subtitle, image, onEdit, onArchive }: any) => <View style={styles.card}>{image ? <Image source={{ uri: image }} style={styles.cardImage} /> : <View style={styles.cardImageEmpty}><MaterialIcons name="image" size={28} color={colors.mutedText} /></View>}<View style={styles.cardBody}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.cardMeta}>{subtitle}</Text><View style={styles.cardActions}><TouchableOpacity onPress={onEdit} style={styles.secondaryButton}><MaterialIcons name="edit" size={17} color={colors.text} /><Text style={styles.secondaryButtonText}>Edit</Text></TouchableOpacity><TouchableOpacity onPress={onArchive} style={styles.archiveButton}><MaterialIcons name="archive" size={18} color={colors.danger} /></TouchableOpacity></View></View></View>;
const LessonSection = ({ title, onAdd, children }: any) => <View style={styles.lessonSection}><View style={styles.lessonHeader}><Text style={styles.lessonTitle}>{title}</Text><TouchableOpacity onPress={onAdd} style={styles.smallAdd}><MaterialIcons name="add" size={18} color={colors.accentDark} /><Text style={styles.smallAddText}>Tambah</Text></TouchableOpacity></View>{children?.length ? children : <Text style={styles.empty}>Belum ada konten.</Text>}</View>;
const LessonRow = ({ title, meta, onEdit, onArchive }: any) => <View style={styles.lessonRow}><View style={styles.userCopy}><Text style={styles.userName}>{title}</Text><Text style={styles.userMeta} numberOfLines={1}>{meta}</Text></View><TouchableOpacity onPress={onEdit} style={styles.iconButton}><MaterialIcons name="edit" size={18} color={colors.text} /></TouchableOpacity><TouchableOpacity onPress={onArchive} style={styles.iconButton}><MaterialIcons name="archive" size={18} color={colors.danger} /></TouchableOpacity></View>;

const EditorModal = ({ editor, form, setForm, courses, isSaving, onPickImage, onClose, onSave }: any) => (
  <Modal visible={!!editor} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.modalBackdrop}><View style={styles.modalCard}><View style={styles.modalHeader}><View><Text style={styles.eyebrow}>EDITOR</Text><Text style={styles.modalTitle}>{editor?.item ? "Edit" : "Tambah"} {editor?.kind}</Text></View><TouchableOpacity onPress={onClose} style={styles.iconButton}><MaterialIcons name="close" size={22} color={colors.text} /></TouchableOpacity></View>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        {(editor?.kind === "course" || editor?.kind === "stage") && <><Field label={editor.kind === "course" ? "Judul course" : "Nama stage"} value={form.title} onChangeText={(title: string) => setForm((current: any) => ({ ...current, title }))} /><Field label="Deskripsi" value={form.description} multiline onChangeText={(description: string) => setForm((current: any) => ({ ...current, description }))} /></>}
        {editor?.kind === "stage" && <><Text style={styles.fieldLabel}>Course</Text><ScrollView horizontal contentContainerStyle={styles.chips}>{courses.map((course: Course) => <Pressable key={course.id} onPress={() => setForm((current: any) => ({ ...current, courseId: String(course.id) }))} style={[styles.chip, form.courseId === String(course.id) && styles.chipActive]}><Text style={[styles.chipText, form.courseId === String(course.id) && styles.chipTextActive]}>{course.title}</Text></Pressable>)}</ScrollView><Field label="Posisi horizontal (0-1)" value={form.xPosition} keyboardType="decimal-pad" onChangeText={(xPosition: string) => setForm((current: any) => ({ ...current, xPosition }))} /><View style={styles.switchRow}><Text style={styles.fieldLabel}>Stage aktif</Text><Switch value={form.isActive} onValueChange={(isActive) => setForm((current: any) => ({ ...current, isActive }))} /></View></>}
        {editor?.kind === "vocab" && <><Field label="Pertanyaan" value={form.question} onChangeText={(question: string) => setForm((current: any) => ({ ...current, question }))} />{form.options.map((option: string, index: number) => <View key={index} style={styles.optionRow}><Pressable style={[styles.radio, form.correctIndex === index && styles.radioActive]} onPress={() => setForm((current: any) => ({ ...current, correctIndex: index }))}>{form.correctIndex === index && <View style={styles.radioDot} />}</Pressable><TextInput style={[styles.input, styles.optionInput]} value={option} placeholder={`Pilihan ${index + 1}`} onChangeText={(value) => setForm((current: any) => ({ ...current, options: current.options.map((item: string, optionIndex: number) => optionIndex === index ? value : item) }))} />{form.options.length > 2 && <TouchableOpacity onPress={() => setForm((current: any) => ({ ...current, options: current.options.filter((_: string, optionIndex: number) => optionIndex !== index), correctIndex: 0 }))}><MaterialIcons name="remove-circle" size={22} color={colors.danger} /></TouchableOpacity>}</View>)}{form.options.length < 4 && <TouchableOpacity style={styles.smallAdd} onPress={() => setForm((current: any) => ({ ...current, options: [...current.options, ""] }))}><MaterialIcons name="add" size={18} color={colors.accentDark} /><Text style={styles.smallAddText}>Tambah pilihan</Text></TouchableOpacity>}</>}
        {editor?.kind === "scenario" && <><Field label="Nama NPC" value={form.npcName} onChangeText={(npcName: string) => setForm((current: any) => ({ ...current, npcName }))} /><Field label="Teks NPC" value={form.npcText} multiline onChangeText={(npcText: string) => setForm((current: any) => ({ ...current, npcText }))} /><Field label="Jawaban suara" value={form.expectedVoice} multiline onChangeText={(expectedVoice: string) => setForm((current: any) => ({ ...current, expectedVoice }))} /><Field label="URL audio NPC (opsional)" value={form.audioUrl} onChangeText={(audioUrl: string) => setForm((current: any) => ({ ...current, audioUrl }))} /></>}
        <Text style={styles.fieldLabel}>{editor?.kind === "scenario" ? "Background" : "Gambar"}</Text><TouchableOpacity style={styles.imagePicker} onPress={onPickImage}>{form.image ? <Image source={{ uri: form.image }} style={styles.imagePreview} /> : <><MaterialIcons name="add-photo-alternate" size={30} color={colors.accentDark} /><Text style={styles.imagePickerText}>Pilih gambar</Text></>}</TouchableOpacity>
        <Field label="Urutan" value={form.sortOrder} keyboardType="number-pad" onChangeText={(sortOrder: string) => setForm((current: any) => ({ ...current, sortOrder }))} />
        {(editor?.kind === "course" || editor?.kind === "stage") && <View style={styles.statusRow}>{(["draft", "published"] as const).map((status) => <Pressable key={status} onPress={() => setForm((current: any) => ({ ...current, status }))} style={[styles.statusChoice, form.status === status && styles.statusChoiceActive]}><Text style={[styles.chipText, form.status === status && styles.chipTextActive]}>{status === "draft" ? "Draft" : "Published"}</Text></Pressable>)}</View>}
      </ScrollView><View style={styles.modalFooter}><TouchableOpacity style={styles.secondaryFooter} onPress={onClose}><Text style={styles.secondaryButtonText}>Batal</Text></TouchableOpacity><TouchableOpacity style={styles.saveButton} onPress={onSave} disabled={isSaving}>{isSaving ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Simpan</Text>}</TouchableOpacity></View>
    </View></View>
  </Modal>
);

const Field = ({ label, multiline, ...props }: any) => <View><Text style={styles.fieldLabel}>{label}</Text><TextInput {...props} multiline={multiline} placeholderTextColor={colors.mutedText} style={[styles.input, multiline && styles.textarea]} /></View>;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, shell: { flex: 1 }, shellWide: { flexDirection: "row" }, sidebar: { width: 220, padding: 18, backgroundColor: colors.navy }, sidebarMobile: { width: "100%", paddingBottom: 10 }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 }, brand: { fontFamily: "Poppins-Bold", fontSize: 18, color: colors.white }, brandMeta: { fontFamily: "Poppins-Regular", fontSize: 10, color: colors.whiteTranslucent }, mobileNav: { gap: 8 }, navItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 12, marginBottom: 7 }, navItemActive: { backgroundColor: colors.accent }, navText: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.whiteTranslucent }, navTextActive: { color: colors.white }, main: { flex: 1 }, mainContent: { width: "100%", maxWidth: 1100, alignSelf: "center", padding: 20, paddingBottom: 60 }, pageHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }, eyebrow: { fontFamily: "Poppins-Bold", fontSize: 10, letterSpacing: 1.4, color: colors.accentDark }, pageTitle: { fontFamily: "Poppins-Bold", fontSize: 28, color: colors.text }, primaryButton: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 15, height: 44, borderRadius: 13, backgroundColor: colors.accent }, primaryButtonText: { fontFamily: "Poppins-Bold", fontSize: 13, color: colors.white }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 }, card: { width: 260, flexGrow: 1, maxWidth: 360, borderRadius: 18, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, cardImage: { width: "100%", height: 120 }, cardImageEmpty: { height: 120, alignItems: "center", justifyContent: "center", backgroundColor: colors.parchment }, cardBody: { padding: 14 }, cardTitle: { fontFamily: "Poppins-Bold", fontSize: 16, color: colors.text }, cardMeta: { fontFamily: "Poppins-Regular", fontSize: 11, color: colors.darkGray, marginTop: 2 }, cardActions: { flexDirection: "row", gap: 8, marginTop: 14 }, secondaryButton: { flex: 1, height: 38, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 11, backgroundColor: colors.lightGray }, secondaryButtonText: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: colors.text }, archiveButton: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.dangerLight }, iconButton: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: colors.whiteSemiTranslucent }, chips: { gap: 8, paddingBottom: 12 }, chip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, chipActive: { backgroundColor: colors.accent, borderColor: colors.accent }, chipText: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.darkGray }, chipTextActive: { color: colors.white }, lessonColumns: { gap: 16 }, lessonSection: { backgroundColor: colors.surface, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: colors.border }, lessonHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }, lessonTitle: { fontFamily: "Poppins-Bold", fontSize: 17, color: colors.text }, smallAdd: { flexDirection: "row", alignItems: "center", gap: 4, padding: 7 }, smallAddText: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.accentDark }, lessonRow: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 7, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingVertical: 8 }, empty: { fontFamily: "Poppins-Regular", fontSize: 12, color: colors.mutedText, paddingVertical: 18, textAlign: "center" }, userTable: { borderRadius: 18, overflow: "hidden", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, userRow: { flexDirection: "row", alignItems: "center", gap: 11, padding: 13, borderBottomWidth: 1, borderBottomColor: colors.borderLight }, userAvatar: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }, userAvatarText: { fontFamily: "Poppins-Bold", fontSize: 12, color: colors.white }, userCopy: { flex: 1, minWidth: 0 }, userName: { fontFamily: "Poppins-SemiBold", fontSize: 13, color: colors.text }, userMeta: { fontFamily: "Poppins-Regular", fontSize: 10, color: colors.darkGray }, userStat: { minWidth: 58, alignItems: "flex-end" }, userStatValue: { fontFamily: "Poppins-Bold", fontSize: 13, color: colors.text }, error: { padding: 12, borderRadius: 10, backgroundColor: colors.dangerLight, color: colors.danger, marginBottom: 14 }, loader: { marginTop: 80 }, fieldLabel: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.darkGray, marginBottom: 5 }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: colors.blackOverlayDark }, modalCard: { width: "100%", maxWidth: 680, maxHeight: "92%", alignSelf: "center", backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 }, modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border }, modalTitle: { fontFamily: "Poppins-Bold", fontSize: 21, color: colors.text, textTransform: "capitalize" }, form: { padding: 18, gap: 14 }, input: { minHeight: 45, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceElevated, paddingHorizontal: 12, fontFamily: "Poppins-Regular", fontSize: 13, color: colors.text }, textarea: { minHeight: 86, paddingTop: 11, textAlignVertical: "top" }, switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, optionRow: { flexDirection: "row", alignItems: "center", gap: 9 }, optionInput: { flex: 1 }, radio: { width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" }, radioActive: { borderColor: colors.accent }, radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.accent }, imagePicker: { height: 130, borderRadius: 14, borderWidth: 1, borderStyle: "dashed", borderColor: colors.accent, alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: colors.accentMuted }, imagePickerText: { fontFamily: "Poppins-SemiBold", fontSize: 11, color: colors.accentDark }, imagePreview: { width: "100%", height: "100%" }, statusRow: { flexDirection: "row", gap: 9 }, statusChoice: { flex: 1, alignItems: "center", padding: 11, borderRadius: 12, borderWidth: 1, borderColor: colors.border }, statusChoiceActive: { backgroundColor: colors.accent, borderColor: colors.accent }, modalFooter: { flexDirection: "row", gap: 10, padding: 18, borderTopWidth: 1, borderTopColor: colors.border }, secondaryFooter: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.lightGray }, saveButton: { flex: 1, height: 46, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.accent },
});
