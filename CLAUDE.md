# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Menuum is a Next.js 16 application for intelligent meal planning. The app uses Supabase for authentication and backend services, with a multi-step onboarding flow to collect user nutrition preferences and goals.

**Live at:** https://app.menuum.com/

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

## Critical Architecture Decisions

### Server vs Client Components

**Server Components (default):**
- Use for pages that need auth verification before rendering
- Example: `app/dashboard/page.tsx` - checks session server-side before rendering
- Can use `redirect()` directly in async component body
- Use `createClient()` from `@/lib/supabase/server`

**Client Components (use 'use client'):**
- Required for interactivity (onClick, useState, useEffect)
- All onboarding steps are Client Components (need form interactions)
- Auth pages (login/register) are Client Components (forms + navigation)
- Use `useAuth()` hook for auth state in Client Components
- Use `createClient()` from `@/lib/supabase/client`
- Use `router.push()` or `router.replace()` for navigation (NOT `redirect()`)

### Supabase SSR Architecture

**Three Client Types (IMPORTANT - use correct one):**

1. **Browser Client** (`lib/supabase/client.ts`):
   ```typescript
   import { createClient } from '@/lib/supabase/client'
   ```
   - For Client Components only
   - Handles cookies automatically in browser
   - Used in: login, register, useAuth hook

2. **Server Client** (`lib/supabase/server.ts`):
   ```typescript
   import { createClient } from '@/lib/supabase/server'
   ```
   - For Server Components, Server Actions, Route Handlers
   - Async function that returns client
   - Manages cookies via Next.js `cookies()` API
   - Used in: dashboard, API routes

3. **Middleware Client** (`lib/supabase/middleware.ts`):
   ```typescript
   import { updateSession } from '@/lib/supabase/middleware'
   ```
   - **Do NOT import directly** - used only by `middleware.ts`
   - Handles session refresh and route protection
   - Returns modified NextResponse with updated cookies

### Route Protection Pattern

**Edge Middleware** (`middleware.ts`):
- Runs on ALL requests (see config matcher)
- Calls `updateSession()` which:
  1. Refreshes Supabase session automatically
  2. Redirects unauthenticated users from protected pages to `/login`
  3. Redirects authenticated users from auth pages to `/dashboard`
- Protected routes: `/dashboard`, `/onboarding`
- Public routes: `/login`, `/register`

**Important**: Do NOT add auth checks in `useEffect` with `redirect()` - this creates infinite loops. Let middleware handle route protection.

### Type Safety Pattern

**Shared Types** (`lib/types/onboarding.ts`):
- Single source of truth for onboarding data structure
- Eliminates duplicate interface definitions
- Numeric fields (edad, peso, estatura) are `number` type, not `string`
- Arrays must be typed: `string[]` not `any[]`

**Example - DO NOT create inline interfaces:**
```typescript
// ❌ Bad - duplicate interface
interface StepProps {
  data: { objetivo: string; edad: number; ... }
}

// ✅ Good - import shared type
import { OnboardingStepProps } from '@/lib/types/onboarding'
```

### API Route Pattern

**Onboarding Submission** (`app/api/profile/onboarding/route.ts`):
- POST endpoint receives `UserOnboardingData`
- Validates required fields (objetivo, edad, peso, estatura)
- Uses server Supabase client to get authenticated user
- Upserts to `user_profiles` table
- Sets `onboarding_completed: true`
- Returns JSON response with error handling

## Styling Conventions

**Color Palette:**
- Primary: Green (#22C55E) and Emerald (#10B981)
- Accent: Orange (#F97316) - used sparingly
- Neutrals: Gray (NOT slate)
- Gradients: `from-green-600 to-emerald-600` for headings

**Glassmorphism Pattern:**
```typescript
className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50"
```

**Selection States:**
- Selected: `border-green-500 bg-green-50 shadow-lg shadow-green-500/20`
- Unselected: `border-gray-200 bg-white hover:border-gray-300 hover:shadow-md`

**Animations:**
- Use Framer Motion for all animations
- Stagger delays: `delay: index * 0.05` for list items
- Entry animations: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`

## Common Pitfalls to Avoid

1. **Using `redirect()` in Client Components** - Causes "not a function" errors
2. **Using old `lib/supabaseClient.ts`** - File has been removed, use SSR clients
3. **Mixing up Supabase client types** - Always match component type (client/server)
4. **Creating duplicate type definitions** - Always import from `lib/types/`
5. **Using slate colors** - Should be gray (palette consistency)
6. **Storing numbers as strings** - Age, weight, height are `number` type
7. **Missing type assertions on arrays** - Use `[] as string[]` not just `[]`
8. **Auth checks in useEffect** - Let middleware handle route protection

## Key Considerations

- **Language**: Spanish is used throughout the UI
- **Branding**: Package name is "menuum-frontend" and app displays "Menuum"
- **Domain**: Live at https://app.menuum.com/
- **Database**: Onboarding saves to `user_profiles` table (not `profiles`)
- **Form Library**: None - vanilla React state management with validation functions
- **Next.js Version**: 16 with Turbopack (deprecation warning for "middleware" → "proxy" can be ignored)
