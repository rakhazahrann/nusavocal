export type LeaderboardEntry = {
  user_id: string;
  username: string;
  nickname: string | null;
  completed_stages: number;
  total_vocab_score: number;
};
