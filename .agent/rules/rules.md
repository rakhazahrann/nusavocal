---
trigger: always_on
---

# NusaVocal Agent Rules & Guidelines

Standard operating rules and guidelines for AI agents working on the **NusaVocal** codebase (Expo, React Native, Supabase, NativeWind, Zustand).

---

## 1. Project Commands & Verification

- **Working Directory**: Always execute commands inside the `nusavocal/` project root directory.
- **Package Manager**: Use `npm` only. Preserve `package-lock.json`. Do NOT use `yarn` or `pnpm`.
- **Static Verification**: Always run `npx tsc --noEmit` after making any TypeScript changes to ensure zero type errors.
- **Non-Existent Scripts**: Do NOT attempt to run `npm test` or `npm run lint` as they are not configured in `package.json`.
- **Build Commands**:
  - `npm start` -> Expo Metro bundler
  - `npm run android` -> Android native development build (`expo run:android`)
  - `npm run web` -> Web browser dev server
  - `npm run build` -> Export all configured platforms (`expo export`)

---

## 2. Codebase Architecture & Structure

- **Path Aliases**: `@/*` resolves to `src/*`. Be cautious with `@/lib/*` vs root `lib/`.
- **Navigation**:
  - All navigation stacks & tab navigators live in `src/navigation/`.
  - Type-safe navigation parameters must be declared/updated in `src/types/navigation.ts`.
- **State Management (Zustand)**:
  - Global app state is managed via Zustand stores in `src/store/` (`authStore.ts`, `gameStore.ts`, `settingsStore.ts`).
  - Do not create unmanaged global React context or redundant state when Zustand stores exist.
- **Service Layer (Supabase)**:
  - Database calls and authentication must be encapsulated in `src/services/` (e.g. `stageService.ts`, `authService.ts`, `vocabService.ts`).
  - Do NOT write raw inline Supabase queries inside React components.

---

## 3. UI, Styling & Aesthetics

- **NativeWind (Tailwind CSS v3)**:
  - Use NativeWind utility classes for component styling.
  - `App.tsx` must maintain the import of `src/global.css`.
  - Combine dynamic/conditional classes using the `cn()` helper (`clsx` + `tailwind-merge`) from `src/utils/cn.ts` or `src/lib/utils.ts`.
- **Typography & Fonts**:
  - Custom font Poppins is loaded via `@expo-google-fonts/poppins`. Use configured Poppins class names for text components.
- **Mobile UX & Safe Area**:
  - Handle notch and screen edges using `react-native-safe-area-context` (`useSafeAreaInsets` or `SafeAreaView`).
  - Ensure interactive elements (`TouchableOpacity`, `Pressable`) have adequate hit slopes and visual feedback on press.
- **Design Quality**: Maintain modern aesthetics (vibrant dark/light palettes, glassmorphism accents, smooth reanimated transitions).

---

## 4. Backend & Native Plugin Rules

- **Environment Variables**:
  - Expo environment variables must start with `EXPO_PUBLIC_` (e.g. `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
- **Database & Schemas**:
  - Review `supabase-schema.sql` and `src/types/` before changing data models or writing backend queries.
- **Native vs Web Speech Recognition**:
  - Speech recognition uses `expo-speech-recognition` and microphone access.
  - Speech recognition **requires an Android development build** (`npm run android`). It does NOT run on browser web builds.
  - When modifying native plugins or `app.json`, a native rebuild (`npm run android`) is required.

---

## 5. Agent Safety & Quality Principles

- **Never Guess Schemas or Types**: Always inspect target interfaces in `src/types/` or source files before implementing new props or API calls.
- **Preserve Documentation**: Maintain existing comments, docstrings, and type definitions unless explicitly instructed to update them.
- **No Masking Errors**: Fix root causes instead of adding silent `try/catch` fallbacks or suppressing TypeScript errors with `any` / `@ts-ignore`.
- **Verification Mandatory**: Always run `npx tsc --noEmit` to verify type checking before reporting task completion.
