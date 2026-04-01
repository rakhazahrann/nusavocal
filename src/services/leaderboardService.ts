import { supabase } from "../api/supabase";

export type LeaderboardEntry = {
  user_id: string;
  username: string;
  nickname: string | null;
  completed_stages: number;
  total_vocab_score: number;
};

export const leaderboardService = {
  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase.rpc("get_leaderboard", {
      limit_count: limit,
    });

    if (error) throw error;
    return (data || []) as LeaderboardEntry[];
  },
};
