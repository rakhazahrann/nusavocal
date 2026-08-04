---
trigger: always_on
---

# Verification & Testing Rules

1. **TypeScript Typecheck**:
   - Always run `npx tsc --noEmit` inside `nusavocal/` after any edits to `.ts` or `.tsx` files.
   
2. **No Phantom Test/Lint Scripts**:
   - Do NOT run `npm test` or `npm run lint`. The repository does not have jest/eslint scripts configured in `package.json`.

3. **Runtime Verification**:
   - For speech recognition & microphone, verify on native Android build (`npm run android`).
   - For Supabase backend changes, verify environment variables `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are configured.
