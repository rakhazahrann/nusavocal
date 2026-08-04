# NusaVocal Agent Notes & Rules

This project contains explicit agent rules and instructions located in [.agent/rules/](file:///c:/Users/ASUS/OneDrive/Dokumen/TA/nusavocal/.agent/rules/).

## Working Directory & Tooling

- Run all project commands from `nusavocal/`; parent `TA/` only contains this repository.
- Use `npm` only and preserve `package-lock.json`. Avoid `yarn` or `pnpm`.
- Native directories (`android/`) are generated; avoid modifying native code directly unless handling native plugin config (e.g. `app.json`).

## Commands & Verification

- Install dependencies: `npm ci`
- Metro bundler: `npm start`
- Web development: `npm run web`
- Native Android build: `npm run android` (`expo run:android`)
- Platform export: `npm run build` (`expo export`)
- **Static verification**: `npx tsc --noEmit` (run after every TypeScript change).
- **Note**: No `npm test` or `npm run lint` scripts exist. Do NOT attempt to run them.

## Codebase Architecture & Conventions

- **Path Aliases**: `@/*` resolves to `src/*`. Check `@/lib/*` vs root `lib/`.
- **Navigation**: Lives in `src/navigation/AppNavigator.tsx`. Screen parameters must be typed in `src/types/navigation.ts`.
- **State Management**: Global app state is managed via Zustand stores in `src/store/` (`authStore`, `gameStore`, `settingsStore`).
- **Services**: Database and backend logic live in `src/services/` (e.g. `stageService`, `authService`, `vocabService`). Do not write inline Supabase calls in UI components.
- **Styling**: NativeWind (Tailwind CSS v3) + `@/global.css` (imported in `App.tsx`). Combine dynamic styles using `cn()` from `@/utils/cn`.
- **Fonts**: Custom Poppins fonts are loaded in `App.tsx`.

## External Services & Native Capabilities

- **Environment**: Requires `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env`.
- **Database**: Database schema reference is in `supabase-schema.sql`.
- **Speech Recognition**: Uses `expo-speech-recognition`. Microphone & speech recognition work on Native builds (`npm run android`), NOT on web.

## Rules Directory

Detailed agent rule sub-files are maintained in:
- [rules.md](file:///c:/Users/ASUS/OneDrive/Dokumen/TA/nusavocal/.agent/rules/rules.md) — Core operational rules
- [code-style.md](file:///c:/Users/ASUS/OneDrive/Dokumen/TA/nusavocal/.agent/rules/code-style.md) — Code style & architecture
- [verification.md](file:///c:/Users/ASUS/OneDrive/Dokumen/TA/nusavocal/.agent/rules/verification.md) — Verification & testing guidance
