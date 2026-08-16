-- Run this file only in Supabase SQL Editor.
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
  SELECT
    p.id AS user_id,
    p.username,
    p.nickname,
    COALESCE(SUM(CASE WHEN up.status = 'completed' THEN 1 ELSE 0 END), 0)::INT AS completed_stages,
    ((COALESCE(SUM(up.score), 0) + COALESCE(SUM(up.vocab_score), 0)) * 10)::INT AS total_xp
  FROM public.profiles p
  LEFT JOIN public.user_progress up
    ON up.user_id = p.id
  GROUP BY p.id, p.username, p.nickname
  ORDER BY total_xp DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(INT) TO anon, authenticated;
