import { supabase } from '../api/supabase';

export const scenarioService = {
  async getScenarios(stageId: number) {
    const { data, error } = await supabase
      .from('game_scenarios')
      .select('*')
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async createScenario(scenarioData: any) {
    const { data, error } = await supabase
      .from('game_scenarios')
      .insert(scenarioData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
