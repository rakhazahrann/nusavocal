export interface Profile {
  id: string;
  username: string;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Stage {
  id: number;
  label: string;
  description: string | null;
  image_url: string | null;
  x_position: number;
  sort_order: number;
  is_active: boolean;
  // merged from user_progress
  status: 'locked' | 'current' | 'completed';
}

export interface VocabQuestion {
  id: number;
  stage_id: number;
  question_text: string;
  image_url: string | null;
  sort_order: number;
  options: VocabOption[];
}

export interface VocabOption {
  id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface GameScenario {
  id: number;
  stage_id: number;
  background_image_url: string | null;
  npc_name: string;
  npc_text: string;
  expected_voice_text: string | null;
  voice_audio_url: string | null;
  sort_order: number;
}
