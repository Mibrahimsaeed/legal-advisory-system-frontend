# Legal Advisor AI — Frontend

A premium mobile client for an AI legal assistant, built with [Expo](https://expo.dev) SDK 56, expo-router, and React Native Reanimated 4.

Navy-and-gold "law library" design language: warm ivory light mode, deep navy dark mode, serif display type, and purposeful motion throughout (spring press feedback, staggered list entrances, scroll-driven onboarding, typing indicators).

## App flow

Splash → Onboarding (3-slide swipeable pager) → Login / Signup → Tabs

- **Home** — greeting, global search, "ask a question" CTA, legal topic grid, recent conversations
- **Chat** (`/chat/[id]`) — message bubbles, typing indicator, growing composer, starter suggestions; mock assistant replies until a backend is wired up
- **History** — searchable conversation list with layout animations
- **Search** (`/search`) — live filtering across topics and conversations, "ask the AI instead" fallback
- **Profile** — appearance (system/light/dark), preference toggles, clear history, sign out

## Getting started

```bash
npm install
npx expo start
```

Open in a development build, Android emulator, iOS simulator, or Expo Go.

## Architecture

```
src/
  app/           expo-router routes (splash, onboarding, auth, (tabs), chat, search)
  components/    ui/ primitives (Button, TextField, Card, Icon, …) + feature components
  constants/     theme.ts (colors, type, spacing, radius, shadows) + motion.ts tokens
  providers/     theme preference + in-memory conversations store
  hooks/         useTheme, useColorScheme, useMockSubmit
  data/          legal topics, seeded conversations, mock user
  utils/         haptics, time formatting
```

Design tokens live in `src/constants/theme.ts` and `src/constants/motion.ts`; every screen and component draws from them. Icons use `expo-symbols` (SF Symbols on iOS, Material Symbols on Android/web) through the semantic `Icon` component.

## Status

- Frontend only: auth, conversations, and profile are mocked in-memory — no data leaves the device.
- Every answer surface carries a "general information, not legal advice" disclaimer by design.
