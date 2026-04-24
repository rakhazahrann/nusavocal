const { create } = require('zustand') as typeof import('zustand');
import { stageService } from '@/services/stageService';
import { vocabService } from '@/services/vocabService';
import { scenarioService } from '@/services/scenarioService';
import { Stage, VocabQuestion, VocabOption, GameScenario } from "@/types/store";

// ── Types ────────────────────────────────────────────────────────









interface GameState {
  stages: Stage[];
  currentVocabQuestions: VocabQuestion[];
  currentScenarios: GameScenario[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStages: (userId: string) => Promise<void>;
  fetchVocabQuestions: (stageId: number) => Promise<void>;
  fetchGameScenarios: (stageId: number) => Promise<void>;
  saveProgress: (userId: string, stageId: number, score: number, vocabScore: number) => Promise<{ success: boolean; error?: string }>;
  deleteStage: (stageId: number, userId: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  stages: [],
  currentVocabQuestions: [],
  currentScenarios: [],
  isLoading: false,
  error: null,

  fetchStages: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch stages first (mandatory)
      let stagesData: any[] = [];
      try {
        stagesData = await stageService.getStages();
      } catch (e: any) {
        console.error('Fetch stages error:', e);
        set({ error: `Failed to load stages: ${e.message}` });
        return;
      }

      // Fetch progress (optional, don't let it block stages)
      let progressData: any[] = [];
      if (userId) {
        try {
          progressData = await stageService.getUserProgress(userId);
        } catch (e) {
          console.error('Fetch progress error (non-fatal):', e);
        }
      }

      // Merge stages with progress
      const progressMap = new Map(
        (progressData || []).map((p: any) => [p.stage_id, p])
      );

      const stages: Stage[] = (stagesData || []).map((stage: any) => {
        const progress = progressMap.get(stage.id);
        return {
          ...stage,
          status: progress?.status || 'locked',
        };
      });

      // If no progress at all, set first stage as current to allow start
      if ((!progressData || progressData.length === 0) && stages.length > 0) {
        stages[0].status = 'current';
      }

      set({ stages });
    } catch (error: any) {
      console.error('FetchStages crashed:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVocabQuestions: async (stageId: number) => {
    try {
      set({ isLoading: true, error: null });
      const questions = await vocabService.getVocabQuestions(stageId);
      set({ currentVocabQuestions: questions });
    } catch (error: any) {
      console.error('Fetch vocab questions error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchGameScenarios: async (stageId: number) => {
    try {
      set({ isLoading: true, error: null });
      const data = await scenarioService.getScenarios(stageId);
      set({ currentScenarios: data });
    } catch (error: any) {
      console.error('Fetch game scenarios error:', error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  saveProgress: async (userId, stageId, score, vocabScore) => {
    try {
      set({ isLoading: true, error: null });

      // Upsert progress for current stage
      await stageService.upsertProgress({
        user_id: userId,
        stage_id: stageId,
        status: 'completed',
        score,
        vocab_score: vocabScore,
        completed_at: new Date().toISOString(),
      });

      // Unlock next stage 
      const { stages } = get();
      const currentIndex = stages.findIndex(s => s.id === stageId);
      if (currentIndex >= 0 && currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1];

        // Check if next stage already has progress
        const existingProgress = await stageService.getUserProgress(userId);
        const hasNextProgress = existingProgress.some(p => p.stage_id === nextStage.id);

        if (!hasNextProgress) {
          await stageService.upsertProgress({
            user_id: userId,
            stage_id: nextStage.id,
            status: 'current',
          });
        }
      }

      // Refresh stages
      await get().fetchStages(userId);
      return { success: true };
    } catch (error: any) {
      console.error('Save progress error:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStage: async (stageId: number, userId: string) => {
    try {
      console.log(`[gameStore] deleteStage called for stageId: ${stageId}, userId: ${userId}`);
      set({ isLoading: true, error: null });
      
      await stageService.deleteStage(stageId);
      console.log(`[gameStore] stageService.deleteStage success, re-fetching stages...`);
      
      await get().fetchStages(userId);
      console.log(`[gameStore] fetchStages completed after deletion.`);
      
      return { success: true };
    } catch (error: any) {
      console.error('[gameStore] Delete stage error:', error);
      const errorMsg = error.message || "Failed to delete stage";
      set({ error: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
