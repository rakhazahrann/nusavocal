import AsyncStorage from "@react-native-async-storage/async-storage";
const { create } = require("zustand") as typeof import("zustand");
const { createJSONStorage, persist } = require("zustand/middleware") as typeof import("zustand/middleware");

interface SettingsState {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  reduceMotion: boolean;

  setSfxEnabled: (value: boolean) => void;
  setMusicEnabled: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sfxEnabled: true,
      musicEnabled: true,
      reduceMotion: false,

      setSfxEnabled: (value) => set({ sfxEnabled: value }),
      setMusicEnabled: (value) => set({ musicEnabled: value }),
      setReduceMotion: (value) => set({ reduceMotion: value }),
    }),
    {
      name: "nusavocal-settings",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
