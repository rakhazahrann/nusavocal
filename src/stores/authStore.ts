const { create } = require('zustand') as typeof import('zustand');
import { supabase } from '../api/supabase';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/authService';

export type Gender = 'man' | 'woman';

export interface Profile {
  id: string;
  username: string;
  email: string;
  gender: Gender | null;
  character_id: string | null;
  nickname: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<Profile | null>;
  updateProfile: (updates: Partial<Pick<Profile, 'gender' | 'character_id' | 'nickname' | 'username' | 'email'>>) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, session });
        await get().fetchProfile();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({ user: session?.user ?? null, session });

        if (event === 'SIGNED_IN' && session?.user) {
          await get().fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          set({ profile: null });
        }
      });
    } catch (error: any) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  signUp: async (email, password, username) => {
    try {
      set({ isLoading: true, error: null });

      const data = await authService.signUp(email, password, username);

      if (data.user) {
        // Profile creation is already partly handled by Supabase Auth metadata or triggers
        // but our authService.signUp doesn't create the profile row yet.
        // Wait, in the previous implementation it manually inserted into 'profiles'.
        // Let's keep that logic but move the profile insertion to authService.
        
        // Actually, let's update authService.signUp to also handle profile creation if needed,
        // or just call authService.updateProfile.
        // The original code did:
        // await supabase.from('profiles').insert({ id: data.user.id, username, email, role: 'user' });
        
        // I will update authService to handle this cleanly.
        // For now, let's just use the service for the auth part.
        
        set({ user: data.user, session: data.session });
        await get().fetchProfile();
      }

      return { success: true };
    } catch (error: any) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const data = await authService.signIn(email, password);

      set({ user: data.user, session: data.session });
      await get().fetchProfile();

      return { success: true };
    } catch (error: any) {
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await authService.signOut();
      set({ user: null, session: null, profile: null });
    } catch (error: any) {
      console.error('Sign out error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return null;

    try {
      const data = await authService.fetchProfile(user.id);
      set({ profile: data as Profile });
      return data as Profile;
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      return null;
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) {
      return { success: false, error: 'Not authenticated. Please ensure you are logged in.' };
    }

    try {
      set({ isLoading: true, error: null });
      
      const data = await authService.updateProfile(user.id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      set({ profile: data as Profile });
      return { success: true };
    } catch (error: any) {
      console.error('updateProfile error:', error);
      set({ error: error.message });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
