import { supabase } from "./supabase";
import { LeaderboardEntry } from "@/types/services";



export const leaderboardService = {
  async getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase.rpc("get_leaderboard", {
      limit_count: limit,
    });

    if (error) throw error;
    return (data || []) as LeaderboardEntry[];
  },
};
