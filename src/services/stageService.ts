import { supabase } from '../api/supabase';

export const stageService = {
  async getStages() {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async upsertProgress(progress: any) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progress, { onConflict: 'user_id,stage_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createStage(stageData: any) {
    const { data, error } = await supabase
      .from('stages')
      .insert(stageData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteStage(stageId: number) {
    const { data, error } = await supabase
      .from('stages')
      .delete()
      .eq('id', stageId)
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("Penyimpanan ditolak atau Stage tidak ditemukan. Pastikan Anda memiliki hak akses Admin.");
    }
  },

  async getLastStagePosition() {
    const { data, error } = await supabase
      .from('stages')
      .select('x_position')
      .order('id', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0].x_position : null;
  }
};
