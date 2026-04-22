-- ================================================================
-- NusaVocal Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================

-- ── 1. PROFILES ──────────────────────────────────────────────────
-- Extends auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS character_id;

-- ── 2. STAGES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stages (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  x_position FLOAT NOT NULL DEFAULT 0.5,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. VOCAB QUESTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vocab_questions (
  id SERIAL PRIMARY KEY,
  stage_id INT NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. VOCAB OPTIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.vocab_options (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL REFERENCES public.vocab_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0
);

-- ── 5. GAME SCENARIOS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.game_scenarios (
  id SERIAL PRIMARY KEY,
  stage_id INT NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  background_image_url TEXT,
  npc_name TEXT NOT NULL DEFAULT 'NPC',
  npc_text TEXT NOT NULL DEFAULT '',
  expected_voice_text TEXT,
  voice_audio_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. USER PROGRESS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage_id INT NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'current', 'completed')),
  score INT DEFAULT 0,
  vocab_score INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, stage_id)
);

-- ── INDEXES ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_stage ON public.user_progress(stage_id);
CREATE INDEX IF NOT EXISTS idx_vocab_questions_stage ON public.vocab_questions(stage_id);
CREATE INDEX IF NOT EXISTS idx_vocab_options_question ON public.vocab_options(question_id);
CREATE INDEX IF NOT EXISTS idx_game_scenarios_stage ON public.game_scenarios(stage_id);

-- ── ROW LEVEL SECURITY (RLS) ────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to check if current user is admin (bypasses RLS to prevent infinite recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ( public.is_admin() );

-- Stages: everyone can read, admins can write
CREATE POLICY "Anyone can view active stages"
  ON public.stages FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage stages"
  ON public.stages FOR ALL
  USING ( public.is_admin() );

-- Vocab Questions: everyone can read, admins can write
CREATE POLICY "Anyone can view vocab questions"
  ON public.vocab_questions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage vocab questions"
  ON public.vocab_questions FOR ALL
  USING ( public.is_admin() );

-- Vocab Options: everyone can read, admins can write  
CREATE POLICY "Anyone can view vocab options"
  ON public.vocab_options FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage vocab options"
  ON public.vocab_options FOR ALL
  USING ( public.is_admin() );

-- Game Scenarios: everyone can read, admins can write
CREATE POLICY "Anyone can view game scenarios"
  ON public.game_scenarios FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage game scenarios"
  ON public.game_scenarios FOR ALL
  USING ( public.is_admin() );

-- User Progress: users can read/write their own
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── SEED DATA (initial stages matching current hardcoded data) ──
INSERT INTO public.stages (label, description, image_url, x_position, sort_order) VALUES
  ('Bandara', 'Pelajari kosakata dasar di bandara untuk perjalananmu.', NULL, 0.35, 1),
  ('Salam & Sapaan', 'Kuasai sapaan tradisional dalam bahasa daerah.', NULL, 0.65, 2),
  ('Perkenalan', 'Perkenalkan dirimu dalam bahasa daerah.', NULL, 0.35, 3),
  ('Keluarga', 'Pelajari istilah keluarga dalam bahasa daerah.', NULL, 0.65, 4),
  ('Di Pasar', 'Berlatih tawar-menawar di pasar tradisional.', NULL, 0.35, 5),
  ('Transportasi', 'Kosakata transportasi untuk menjelajahi nusantara.', NULL, 0.65, 6),
  ('Makanan', 'Pelajari nama-nama makanan tradisional.', NULL, 0.35, 7),
  ('Arah & Lokasi', 'Kuasai arah dan lokasi dalam bahasa daerah.', NULL, 0.65, 8);

-- ── LEADERBOARD (RPC) ───────────────────────────────────────────
-- Global leaderboard requires a SECURITY DEFINER function to avoid client-side RLS limitations.
-- This returns only non-sensitive public fields + aggregates.

CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INT DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  nickname TEXT,
  completed_stages INT,
  total_vocab_score INT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS user_id,
    p.username,
    p.nickname,
    COALESCE(SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END), 0)::INT AS completed_stages,
    COALESCE(SUM(up.vocab_score), 0)::INT AS total_vocab_score
  FROM public.profiles p
  LEFT JOIN public.user_progress up
    ON up.user_id = p.id
  GROUP BY p.id, p.username, p.nickname
  ORDER BY total_vocab_score DESC, completed_stages DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(INT) TO anon, authenticated;
