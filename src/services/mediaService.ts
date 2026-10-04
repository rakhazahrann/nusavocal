import { supabase } from './supabase';

export const mediaService = {
  async uploadImage(uri: string, folder: string): Promise<string> {
    if (!uri || uri.startsWith('http')) return uri; // Already a web URL or empty
    
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `${folder}/${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('assets')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Upload image error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  async deleteAsset(publicUrl?: string | null) {
    if (!publicUrl) return;
    const marker = "/storage/v1/object/public/assets/";
    const path = publicUrl.split(marker)[1];
    if (!path) return;
    const { error } = await supabase.storage.from("assets").remove([decodeURIComponent(path)]);
    if (error) throw error;
  },
};
