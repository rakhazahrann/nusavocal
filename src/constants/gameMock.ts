import { GameScenario } from "@/types/store";

export const FALLBACK_BG = "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?auto=format&fit=crop&q=80&w=1200";

export const DUMMY_SCENARIOS: GameScenario[] = [
  {
    id: 9901,
    stage_id: 1,
    sort_order: 0,
    npc_name: "Petugas Bandara",
    npc_text: "Selamat datang di Bandara Soekarno-Hatta! Boleh saya lihat paspornya?",
    expected_voice_text: "Tentu, ini paspor saya.",
    voice_audio_url: null,
    background_image_url: FALLBACK_BG
  },
  {
    id: 9902,
    stage_id: 1,
    sort_order: 1,
    npc_name: "Petugas Bandara",
    npc_text: "Terima kasih. Berapa koper yang ingin dimasukkan ke bagasi?",
    expected_voice_text: "Hanya ada satu koper saja.",
    voice_audio_url: null,
    background_image_url: FALLBACK_BG
  },
  {
    id: 9903,
    stage_id: 1,
    sort_order: 2,
    npc_name: "Petugas Bandara",
    npc_text: "Baik, ini boarding pass Anda. Semoga perjalanannya menyenangkan!",
    expected_voice_text: "Terima kasih banyak, Ibu.",
    voice_audio_url: null,
    background_image_url: FALLBACK_BG
  },
  {
    id: 9904,
    stage_id: 1,
    sort_order: 3,
    npc_name: "Petugas Bandara",
    npc_text: "Sama-sama. Jangan lupa, pesawat berangkat tepat pukul sepuluh.",
    expected_voice_text: "Baik, saya mengerti.",
    voice_audio_url: null,
    background_image_url: FALLBACK_BG
  }
];
