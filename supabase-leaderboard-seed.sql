-- Run this file in Supabase SQL Editor after supabase-leaderboard-xp.sql.
-- Demo players live outside profiles because profiles.id must reference auth.users.id.
CREATE TABLE IF NOT EXISTS public.leaderboard_seed (
  user_id UUID PRIMARY KEY,
  username TEXT NOT NULL,
  nickname TEXT NOT NULL,
  completed_stages INT NOT NULL DEFAULT 0,
  total_xp INT NOT NULL DEFAULT 0
);

ALTER TABLE public.leaderboard_seed ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.leaderboard_seed FROM anon, authenticated;

INSERT INTO public.leaderboard_seed (
  user_id,
  username,
  nickname,
  completed_stages,
  total_xp
) VALUES
  ('10000000-0000-0000-0000-000000000001', 'ayulestari', 'Ayu Lestari', 38, 12840),
  ('10000000-0000-0000-0000-000000000002', 'bimap', 'Bima Pratama', 36, 11920),
  ('10000000-0000-0000-0000-000000000003', 'citram', 'Citra Maharani', 34, 10750),
  ('10000000-0000-0000-0000-000000000004', 'dimass', 'Dimas Saputra', 31, 9840),
  ('10000000-0000-0000-0000-000000000005', 'sekararum', 'Sekar Arum', 29, 8960),
  ('10000000-0000-0000-0000-000000000006', 'rakaw', 'Raka Wijaya', 27, 8420),
  ('10000000-0000-0000-0000-000000000007', 'nadiap', 'Nadia Putri', 25, 7760),
  ('10000000-0000-0000-0000-000000000008', 'fajarn', 'Fajar Nugraha', 24, 7310),
  ('10000000-0000-0000-0000-000000000009', 'gitap', 'Gita Permata', 22, 6840)
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  nickname = EXCLUDED.nickname,
  completed_stages = EXCLUDED.completed_stages,
  total_xp = EXCLUDED.total_xp;

DROP FUNCTION IF EXISTS public.get_leaderboard(INT);

CREATE FUNCTION public.get_leaderboard(limit_count INT DEFAULT 50)
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  nickname TEXT,
  completed_stages INT,
  total_xp INT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ranking.user_id,
         ranking.username,
         ranking.nickname,
         ranking.completed_stages,
         ranking.total_xp
  FROM (
    SELECT
      p.id AS user_id,
      p.username,
      p.nickname,
      COALESCE(SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END), 0)::INT AS completed_stages,
      ((COALESCE(SUM(up.score), 0) + COALESCE(SUM(up.vocab_score), 0)) * 10)::INT AS total_xp
    FROM public.profiles p
    LEFT JOIN public.user_progress up ON up.user_id = p.id
    GROUP BY p.id, p.username, p.nickname

    UNION ALL

    SELECT
      seed.user_id,
      seed.username,
      seed.nickname,
      seed.completed_stages,
      seed.total_xp
    FROM public.leaderboard_seed seed
  ) ranking
  ORDER BY ranking.total_xp DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(INT) TO anon, authenticated;

SELECT * FROM public.get_leaderboard(50);
