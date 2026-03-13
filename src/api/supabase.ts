import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://mdosjsfkcazctmjucyxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kb3Nqc2ZrY2F6Y3RtanVjeXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NTM2ODcsImV4cCI6MjA4ODEyOTY4N30.TJtotqCDY3s9MzjnpFt_VoVKC-qKA0Omdr7ttSsENPc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
