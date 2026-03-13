import { supabase } from '../api/supabase';

export const vocabService = {
  async getVocabQuestions(stageId: number) {
    const { data, error } = await supabase
      .from('vocab_questions')
      .select(`
        *,
        options:vocab_options(*)
      `)
      .eq('stage_id', stageId)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    // Sort options by sort_order
    return (data || []).map((q: any) => ({
      ...q,
      options: (q.options || []).sort((a: any, b: any) => a.sort_order - b.sort_order)
    }));
  },

  async createVocabQuestion(questionData: any) {
    const { data, error } = await supabase
      .from('vocab_questions')
      .insert(questionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async createVocabOptions(options: any[]) {
    const { data, error } = await supabase
      .from('vocab_options')
      .insert(options)
      .select();
    if (error) throw error;
    return data;
  }
};
