## Quick orientation

This is a small Next.js (App Router) client-heavy app for tracking habits. Key entry points:

- `app/layout.tsx` — root layout (includes Vercel Analytics). Most pages/components live under `app/` and `components/`.
- `app/page.tsx` — main UI that composes `useHabits`, `AddHabitForm`, `HabitCard`, and `Footer`.
- `hooks/useHabits.ts` — central client-side state and persistence (localStorage). See `STORAGE_KEY = 'habits'`.
- `utils/dateUtils.ts` — canonical date helpers; `formatDate` returns YYYY-MM-DD strings used across the app.
- `types/habit.ts` — Habit shape (id, name, description?, color, createdAt, completedDates[]).

The codebase uses the `@/` import alias (configured in `tsconfig.json` -> `"paths": {"@/*": ["./*"]}`) so prefer `@/...` imports when adding files.

## Architecture & patterns an AI should follow

- App Router + React client components: many components are `use client` (see `app/page.tsx`, `components/*`). Avoid turning server-only code into client unexpectedly.
- Local persistence only: `useHabits` stores data in `localStorage` under key `habits`. There is no backend API; prefer local changes and do not invent network calls.
- Date canonicalization: use `formatDate(date)` from `utils/dateUtils.ts` to store/compare dates. Habit completion arrays are strings in `YYYY-MM-DD` format.
- IDs use `Date.now().toString()` in `useHabits`. Keep new habit creation consistent with `Habit` interface from `types/habit.ts`.

## Dev workflows (commands found in `package.json`)

- Start development server: `npm run dev` (also works with `yarn dev`/`pnpm dev`)
- Build: `npm run build`
- Start production server: `npm run start`
- Tests: `npm test`, watch: `npm run test:watch`, coverage: `npm run test:coverage` (Jest + Testing Library are configured)
- Lint: `npm run lint` (project uses `eslint` + `eslint-config-next`)

When adding changes, run the relevant tests under `__tests__` or `*.test.(ts|tsx)` files (there are tests adjacent to components and hooks). Keep tests small and focused.

## Project-specific conventions (actionable)

- Keep UI state and persistence in `hooks/useHabits.ts`. If you need to change storage, update both the load (useEffect hydration) and the save effect.
- Dates: always call `formatDate(date)` before pushing/reading `completedDates`.
- Client components must include `'use client'` at the top (see `AddHabitForm.tsx`, `app/page.tsx`). Adding hooks or browser APIs requires `use client`.
- CSS: Tailwind is used via `globals.css`. Prefer utility classes for new UI.
- Colors: `AddHabitForm` uses a `PRESET_COLORS` array — follow this pattern when adding color choices.

## Tests & examples from the repo

- Hook behavior: `useHabits` hydration pattern — load from `localStorage` inside a `useEffect`, set `isHydrated` flag, then save on subsequent changes. Example: do not attempt to read `localStorage` during SSR.
- Date helper example: `formatDate(new Date())` -> `YYYY-MM-DD`. Use `getLastNDays` if showing ranges.

## What not to change / common pitfalls

- Don't assume a backend exists. There are no API routes or server persistence in this repo.
- Avoid reading `localStorage` on the server. The repo uses hydration guards (`isHydrated`) — preserve or follow that pattern.
- Keep the `@/` import alias style. If adding files, place them under existing folders and import via `@/path`.

## Where to look for modifications

- UI: `components/` (AddHabitForm, HabitCard, Footer)
- Hooks & logic: `hooks/` (useHabits)
- Types: `types/` (habit.ts)
- Utilities: `utils/` (date utilities)
- Tests: files named `*.test.ts`, `*.test.tsx`

## Example quick edits an AI might be asked to make

- Add an optional `notes` string to `Habit` in `types/habit.ts`, include field in `AddHabitForm`, and maintain persistence in `useHabits.ts` (follow ID/createdAt format and `localStorage` pattern).
- Add a unit test verifying `toggleHabitCompletion` toggles the date string in `completedDates` using `formatDate`.

If anything in this file feels incomplete or you need examples expanded (e.g., test file locations or common UI snippets), tell me which area to expand and I'll update this document.
