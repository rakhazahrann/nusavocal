-- Run once in Supabase SQL Editor. Safe to run again.

-- Course groups stages by learning topic.
CREATE TABLE IF NOT EXISTS public.courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stages ADD COLUMN IF NOT EXISTS course_id BIGINT REFERENCES public.courses(id);
ALTER TABLE public.stages ADD COLUMN IF NOT EXISTS publication_status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE public.stages ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE public.stages DROP CONSTRAINT IF EXISTS stages_publication_status_check;
ALTER TABLE public.stages ADD CONSTRAINT stages_publication_status_check CHECK (publication_status IN ('draft', 'published'));
ALTER TABLE public.vocab_questions ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE public.game_scenarios ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_stages_course ON public.stages(course_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status, archived_at);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published courses are public" ON public.courses;
CREATE POLICY "Published courses are public"
  ON public.courses FOR SELECT
  USING ((status = 'published' AND archived_at IS NULL) OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Replace permissive content reads. Admins retain access to drafts.
DROP POLICY IF EXISTS "Anyone can view active stages" ON public.stages;
CREATE POLICY "Published stages are public"
  ON public.stages FOR SELECT
  USING (
    public.is_admin()
    OR (
      is_active = true
      AND publication_status = 'published'
      AND archived_at IS NULL
      AND (
        course_id IS NULL
        OR EXISTS (
          SELECT 1 FROM public.courses c
          WHERE c.id = course_id AND c.status = 'published' AND c.archived_at IS NULL
        )
      )
    )
  );

DROP POLICY IF EXISTS "Anyone can view vocab questions" ON public.vocab_questions;
CREATE POLICY "Published vocab questions are public"
  ON public.vocab_questions FOR SELECT
  USING (
    archived_at IS NULL
    AND EXISTS (SELECT 1 FROM public.stages s WHERE s.id = stage_id)
  );

DROP POLICY IF EXISTS "Anyone can view vocab options" ON public.vocab_options;
CREATE POLICY "Published vocab options are public"
  ON public.vocab_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vocab_questions q
      WHERE q.id = question_id AND q.archived_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Anyone can view game scenarios" ON public.game_scenarios;
CREATE POLICY "Published scenarios are public"
  ON public.game_scenarios FOR SELECT
  USING (
    archived_at IS NULL
    AND EXISTS (SELECT 1 FROM public.stages s WHERE s.id = stage_id)
  );

-- Prevent authenticated clients from writing role. Role changes stay in SQL Editor.
REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;
GRANT INSERT (id, username, email, nickname, avatar_url) ON public.profiles TO authenticated;
GRANT UPDATE (username, email, nickname, avatar_url, updated_at) ON public.profiles TO authenticated;

-- Admin user/progress viewer. No email returned.
CREATE OR REPLACE FUNCTION public.admin_get_users()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  nickname TEXT,
  role TEXT,
  completed_stages BIGINT,
  total_xp BIGINT,
  joined_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.nickname,
    p.role,
    COUNT(up.id) FILTER (WHERE up.status = 'completed'),
    (COALESCE(SUM(up.score), 0) + COALESCE(SUM(up.vocab_score), 0)) * 10,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_progress up ON up.user_id = p.id
  GROUP BY p.id, p.username, p.nickname, p.role, p.created_at
  ORDER BY p.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_get_users() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_get_users() TO authenticated;

-- Public reads, admin-only writes for media.
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Admins upload assets" ON storage.objects;
CREATE POLICY "Admins upload assets" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins update assets" ON storage.objects;
CREATE POLICY "Admins update assets" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'assets' AND public.is_admin())
WITH CHECK (bucket_id = 'assets' AND public.is_admin());

DROP POLICY IF EXISTS "Admins delete assets" ON storage.objects;
CREATE POLICY "Admins delete assets" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'assets' AND public.is_admin());

DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::TEXT
);

DROP POLICY IF EXISTS "Users update own avatar" ON storage.objects;
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::TEXT
)
WITH CHECK (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::TEXT
);

DROP POLICY IF EXISTS "Users delete own avatar" ON storage.objects;
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'avatars'
  AND (storage.foldername(name))[2] = auth.uid()::TEXT
);

GRANT USAGE, SELECT ON SEQUENCE public.courses_id_seq TO authenticated;
