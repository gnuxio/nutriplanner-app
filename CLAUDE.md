# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NutriPlanner.ai (also referenced as FMPlanner.ai) is a Next.js 16 application for intelligent meal planning. The app uses Supabase for authentication and backend services, with a multi-step onboarding flow to collect user nutrition preferences and goals.

## Development Commands

**Development server:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Build:**
```bash
npm run build
# Creates production build with standalone output
```

**Production server:**
```bash
npm run start
# Runs production build
```

**Linting:**
```bash
npm run lint
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript with strict mode enabled
- **UI Components:** shadcn/ui (New York style variant)
- **Styling:** Tailwind CSS v4 with custom theme
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth/Backend:** Supabase
- **Deployment:** Docker (standalone mode)

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `(auth)/` - Route group for authentication pages (login, register)
  - `api/` - API routes
    - `profile/onboarding/` - Onboarding data submission endpoint
  - `dashboard/` - Main dashboard after login
  - `onboarding/` - Multi-step onboarding flow
  - `page.tsx` - Root page with auth check using useAuth hook
  - `layout.tsx` - Root layout with Geist fonts
  - `globals.css` - Tailwind v4 configuration with custom theme variables

- `components/` - React components
  - `ui/` - shadcn/ui components (button, card, input, label)
  - `onboarding/` - 8-step onboarding flow components (Step1Objetivo through Step8Confirmacion)

- `hooks/` - Custom React hooks
  - `useAuth.ts` - Authentication hook (user state, loading, signOut)

- `lib/` - Utilities and services
  - `supabase/` - Supabase SSR clients
    - `client.ts` - Browser client for Client Components
    - `server.ts` - Server client for Server Components/Actions
    - `middleware.ts` - Middleware helper for session management and route protection
  - `types/` - TypeScript type definitions
    - `onboarding.ts` - Shared types for onboarding flow
  - `utils.ts` - Utility functions (cn for class merging)

- `middleware.ts` - Route protection and session management (edge runtime)

### Authentication Flow

1. Root page (`app/page.tsx`) uses `useAuth()` hook for authentication state
2. Unauthenticated users redirect to `/login`
3. After login, authenticated users see dashboard
4. Auth state changes are monitored via the `useAuth` hook
5. Use `createClient()` from `@/lib/supabase/client` in Client Components
6. Use `createClient()` from `@/lib/supabase/server` in Server Components/Actions

### Onboarding Flow

The onboarding process (`app/onboarding/page.tsx`) consists of 8 steps that collect user data:

1. **Step1Objetivo** - Weight goals (lose, maintain, gain muscle)
2. **Step2Basicos** - Age (number), weight (number), height (number)
3. **Step3Sexo** - Gender selection
4. **Step4Actividad** - Activity level
5. **Step5Preferencias** - Dietary preferences
6. **Step6Restricciones** - Dietary restrictions (string array)
7. **Step7Habitos** - Cooking habits (skill level, time, equipment array)
8. **Step8Confirmacion** - Review and submit with error handling

All user data is stored in a single state object (`UserOnboardingData` type from `lib/types/onboarding.ts`) and validated per-step. On completion, data is POSTed to `/api/profile/onboarding` endpoint which saves to the `user_profiles` table in Supabase.

**Type Safety**: All components use shared types from `lib/types/onboarding.ts`:
- `UserOnboardingData` - Main data structure
- `OnboardingStepProps` - Props for Steps 1-7
- `Step8Props` - Props for confirmation step with error handling

### Styling System

The app uses Tailwind CSS v4 with a custom theme defined in `app/globals.css`:
- CSS variables for theming (`--color-*`, `--radius-*`)
- OKLCH color space for modern color management
- Custom variants for dark mode
- Geist Sans and Geist Mono fonts

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to project root
- Specific aliases from `components.json`:
  - `@/components` - components directory
  - `@/lib` - lib directory
  - `@/hooks` - hooks directory
  - `@/components/ui` - UI components

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Docker Deployment

The project includes a multi-stage Dockerfile optimized for Next.js standalone output:
- Uses Node 25.1.0 Alpine base image
- Supports npm, yarn, or pnpm
- Production image runs on port 3000
- Configured with `output: 'standalone'` in `next.config.ts`

## Component Patterns

**UI Components** follow shadcn/ui patterns:
- Use `class-variance-authority` for variant management
- Use `tailwind-merge` via `cn()` utility for class merging
- Radix UI primitives for accessible components

**Page Components** use these conventions:
- `'use client'` directive for client-side interactivity
- TypeScript types for props and state
- Framer Motion for page transitions and animations
- Lucide React icons throughout

**Form Validation** in onboarding:
- Per-step validation via `canProceed()` function
- Navigation disabled until required fields are complete
- No form library used - vanilla React state management
- Error handling with user feedback on Step 8
- Numeric fields (edad, peso, estatura) are stored as numbers, not strings

## Key Considerations

- **Authentication**: Use `useAuth()` hook in Client Components for consistent auth state management
- **Supabase Clients**:
  - Client Components: `import { createClient } from '@/lib/supabase/client'`
  - Server Components/Actions: `import { createClient } from '@/lib/supabase/server'`
  - **Do NOT use** `lib/supabaseClient.ts` (deprecated)
- **Types**: Always import types from `lib/types/` instead of creating inline interfaces
- **Redirects**: Use `redirect()` from `next/navigation` for server-side, `router.push()` for client-side
- **Onboarding**: Data is saved to `user_profiles` table via `/api/profile/onboarding` endpoint
- **Language**: Spanish is used throughout the UI
- **Branding**: Varies between "NutriPlanner.ai" and "FMPlanner.ai" (package.json uses "fmplanning-frontend")

## Documentation

- `SUPABASE_SETUP.md` - Database setup instructions and SQL schema
- `REFACTORING_SUMMARY.md` - Detailed refactoring changelog and improvements
