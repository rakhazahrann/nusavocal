---
trigger: always_on
---

# Code Style & Architecture Rules

1. **NativeWind & Styling**:
   - Use Tailwind CSS utility classes via NativeWind v4 for styling components.
   - Combine dynamic or conditional styles using `cn()` from `@/utils/cn` or `@/lib/utils`.
   - Keep `src/global.css` imported in `App.tsx`.

2. **State Management**:
   - Global state lives in Zustand stores under `src/store/` (`authStore`, `gameStore`, `settingsStore`).
   - Components should use store hooks rather than creating unmanaged global states.

3. **Services & Database Layer**:
   - Encapsulate Supabase database queries and auth inside `src/services/`.
   - Components should import services instead of writing inline Supabase calls.

4. **Navigation**:
   - Navigation screens and stacks live in `src/navigation/`.
   - Update navigation parameter types in `src/types/navigation.ts` when adding new screens or route parameters.
