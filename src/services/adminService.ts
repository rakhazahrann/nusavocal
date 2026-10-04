import { supabase } from "./supabase";
import { Course, GameScenario, Stage, VocabQuestion } from "@/types/store";

export type AdminUserSummary = {
  user_id: string;
  username: string;
  nickname: string | null;
  role: "user" | "admin";
  completed_stages: number;
  total_xp: number;
  joined_at: string;
};

export type CourseInput = Pick<Course, "title" | "description" | "cover_url" | "sort_order" | "status">;
export type StageInput = Pick<Stage, "course_id" | "label" | "description" | "image_url" | "x_position" | "sort_order" | "is_active" | "publication_status">;
export type VocabInput = {
  question_text: string;
  image_url: string | null;
  sort_order: number;
  options: Array<{ option_text: string; is_correct: boolean; sort_order: number }>;
};
export type ScenarioInput = Pick<GameScenario, "background_image_url" | "npc_name" | "npc_text" | "expected_voice_text" | "voice_audio_url" | "sort_order">;

const single = async <T>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>) => {
  const { data, error } = await query;
  if (error) throw error;
  return data as T;
};

export const adminService = {
  async getCourses() {
    const { data, error } = await supabase.from("courses").select("*").is("archived_at", null).order("sort_order");
    if (error) throw error;
    return (data || []) as Course[];
  },

  createCourse(input: CourseInput) {
    return single<Course>(supabase.from("courses").insert(input).select().single());
  },

  updateCourse(id: number, input: CourseInput) {
    return single<Course>(supabase.from("courses").update({ ...input, updated_at: new Date().toISOString() }).eq("id", id).select().single());
  },

  async archiveCourse(id: number) {
    const { error } = await supabase.from("courses").update({ archived_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async getStages() {
    const { data, error } = await supabase.from("stages").select("*").is("archived_at", null).order("sort_order");
    if (error) throw error;
    return (data || []) as Stage[];
  },

  createStage(input: StageInput) {
    return single<Stage>(supabase.from("stages").insert(input).select().single());
  },

  updateStage(id: number, input: StageInput) {
    return single<Stage>(supabase.from("stages").update(input).eq("id", id).select().single());
  },

  async archiveStage(id: number) {
    const { error } = await supabase.from("stages").update({ archived_at: new Date().toISOString(), is_active: false }).eq("id", id);
    if (error) throw error;
  },

  async getVocab(stageId: number) {
    const { data, error } = await supabase
      .from("vocab_questions")
      .select("*, options:vocab_options(*)")
      .eq("stage_id", stageId)
      .is("archived_at", null)
      .order("sort_order");
    if (error) throw error;
    return (data || []).map((question) => ({
      ...question,
      options: (question.options || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order),
    })) as VocabQuestion[];
  },

  async saveVocab(stageId: number, input: VocabInput, questionId?: number) {
    if (input.options.length < 2 || input.options.length > 4 || input.options.filter((option) => option.is_correct).length !== 1) {
      throw new Error("Pertanyaan wajib punya 2-4 pilihan dan tepat satu jawaban benar.");
    }

    const question = questionId
      ? await single<VocabQuestion>(supabase.from("vocab_questions").update({
          question_text: input.question_text,
          image_url: input.image_url,
          sort_order: input.sort_order,
        }).eq("id", questionId).select().single())
      : await single<VocabQuestion>(supabase.from("vocab_questions").insert({
          stage_id: stageId,
          question_text: input.question_text,
          image_url: input.image_url,
          sort_order: input.sort_order,
        }).select().single());

    if (questionId) {
      const { error } = await supabase.from("vocab_options").delete().eq("question_id", questionId);
      if (error) throw error;
    }

    const { error } = await supabase.from("vocab_options").insert(
      input.options.map((option) => ({ ...option, question_id: question.id })),
    );
    if (error) throw error;
    return question;
  },

  async archiveVocab(id: number) {
    const { error } = await supabase.from("vocab_questions").update({ archived_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async getScenarios(stageId: number) {
    const { data, error } = await supabase.from("game_scenarios").select("*").eq("stage_id", stageId).is("archived_at", null).order("sort_order");
    if (error) throw error;
    return (data || []) as GameScenario[];
  },

  saveScenario(stageId: number, input: ScenarioInput, id?: number) {
    return id
      ? single<GameScenario>(supabase.from("game_scenarios").update(input).eq("id", id).select().single())
      : single<GameScenario>(supabase.from("game_scenarios").insert({ ...input, stage_id: stageId }).select().single());
  },

  async archiveScenario(id: number) {
    const { error } = await supabase.from("game_scenarios").update({ archived_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },

  async getUsers() {
    const { data, error } = await supabase.rpc("admin_get_users");
    if (error) throw error;
    return (data || []) as AdminUserSummary[];
  },
};
