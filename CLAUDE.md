# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Menuum is a Next.js 16 application for intelligent meal planning. The app uses Supabase for authentication and a Go backend API for profile and data management, with a multi-step onboarding flow to collect user nutrition preferences and goals.

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
- **Auth:** Supabase
- **Backend API:** Go microservice (https://api.menuum.com)
- **Deployment:** Docker (standalone mode)

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `(auth)/` - Route group for authentication pages (login, register)
  - `onboarding/` - Multi-step onboarding flow
  - `page.tsx` - Root page (dashboard) with server-side auth check
  - `layout.tsx` - Root layout with Geist fonts and LayoutWrapper
  - `globals.css` - Tailwind v4 configuration with custom theme variables

- `components/` - React components
  - `ui/` - shadcn/ui components (button, card, input, label)
  - `onboarding/` - 9-step onboarding flow components (Step1Objetivo through Step8Confirmacion, plus Step3Personales)
  - `LayoutWrapper.tsx` - Layout wrapper with sidebar state management
  - `Sidebar.tsx` - Collapsible sidebar with navigation
  - `MobileHeader.tsx` - Mobile header with menu toggle

- `hooks/` - Custom React hooks
  - `useAuth.ts` - Authentication hook (user state, loading, signOut)

- `lib/` - Utilities and services
  - `supabase/` - Supabase SSR clients
    - `client.ts` - Browser client for Client Components
    - `server.ts` - Server client for Server Components/Actions
    - `proxy.ts` - Session management helper for proxy.ts
  - `api/` - Backend API client services
    - `profile.ts` - Profile operations with Go backend
  - `types/` - TypeScript type definitions
    - `onboarding.ts` - Shared types for onboarding flow
  - `utils.ts` - Utility functions (cn for class merging)

- `proxy.ts` - Route protection and session management (root level, Node.js runtime)

### Backend Architecture

**Two-tier backend:**

1. **Supabase** - Authentication only
   - User registration and login
   - Session management via JWT tokens
   - JWT tokens are passed to Go backend for authorization

2. **Go Backend API** (`https://api.menuum.com`)
   - Profile management (`/api/v1/profile`)
   - All business logic and data storage
   - Validates Supabase JWT tokens
   - Accessed via `lib/api/profile.ts` client

**Environment variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
NEXT_PUBLIC_API_URL=                # Go backend URL (defaults to https://api.menuum.com)
```

### Authentication Flow

1. User authenticates with Supabase (login/register pages)
2. Supabase returns JWT token stored in cookies
3. `proxy.ts` validates session on every request
4. Frontend calls Go backend with JWT token in Authorization header
5. Go backend validates JWT and processes requests

**Client-side auth:**
- Use `useAuth()` hook in Client Components for auth state
- Use `createClient()` from `@/lib/supabase/client`

**Server-side auth:**
- Use `createClient()` from `@/lib/supabase/server` in Server Components
- Use `redirect()` for navigation in Server Components

### Onboarding Flow

The onboarding process (`app/onboarding/page.tsx`) consists of 9 steps that collect user data:

1. **Step1Objetivo** - Weight goals (lose, maintain, gain muscle)
2. **Step2Basicos** - Age (number), weight (number), height (number)
3. **Step3Personales** - Personal info (name, last name, country)
4. **Step4Sexo** - Gender selection
5. **Step5Actividad** - Activity level
6. **Step6Preferencias** - Dietary preferences
7. **Step7Restricciones** - Dietary restrictions (string array)
8. **Step8Habitos** - Cooking habits (skill level, time, equipment array)
9. **Step9Confirmacion** - Review and submit with error handling

**Data flow:**
- All user data is stored in a single state object (`UserOnboardingData` type from `lib/types/onboarding.ts`)
- Validated per-step via `canProceed()` function
- On completion, data is mapped to `CreateProfilePayload` and POSTed to Go backend via `createProfile()` from `lib/api/profile.ts`
- Go backend stores in its database (not Supabase)

**Type Safety**: All components use shared types from `lib/types/onboarding.ts`:
- `UserOnboardingData` - Main data structure (frontend state)
- `OnboardingStepProps` - Props for Steps 1-8
- `Step8Props` - Props for confirmation step with error handling

### Layout System

**LayoutWrapper Pattern:**
- `app/layout.tsx` wraps all pages with `LayoutWrapper`
- `LayoutWrapper` conditionally renders `Sidebar` based on route
- Sidebar hidden on: `/login`, `/register`, `/onboarding`
- Sidebar shown on: `/`, `/plans`, `/profile` (dashboard routes)
- Uses React Context for sidebar collapse state
- Responsive: mobile drawer overlay, desktop persistent sidebar

### Styling System

The app uses Tailwind CSS v4 with a custom theme defined in `app/globals.css`:
- CSS variables for theming (`--color-*`, `--radius-*`)
- OKLCH color space for modern color management
- Custom variants for dark mode
- Geist Sans and Geist Mono fonts

### Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to project root (`./*`)

## Critical Architecture Decisions

### Server vs Client Components

**Server Components (default):**
- Use for pages that need auth verification before rendering
- Example: `app/page.tsx` - checks session server-side before rendering dashboard
- Can use `redirect()` directly in async component body
- Use `createClient()` from `@/lib/supabase/server`

**Client Components (use 'use client'):**
- Required for interactivity (onClick, useState, useEffect)
- All onboarding steps are Client Components (need form interactions)
- Auth pages (login/register) are Client Components (forms + navigation)
- LayoutWrapper, Sidebar, MobileHeader are Client Components
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
   - Used in: login, register, useAuth hook, Sidebar

2. **Server Client** (`lib/supabase/server.ts`):
   ```typescript
   import { createClient } from '@/lib/supabase/server'
   ```
   - For Server Components, Server Actions, Route Handlers
   - Async function that returns client
   - Manages cookies via Next.js `cookies()` API
   - Used in: app/page.tsx (dashboard)

3. **Proxy Helper** (`lib/supabase/proxy.ts`):
   ```typescript
   import { updateSession } from '@/lib/supabase/proxy'
   ```
   - **Do NOT import directly** - used only by root `proxy.ts`
   - Handles session refresh and route protection
   - Returns modified NextResponse with updated cookies

### Route Protection Pattern

**Proxy** (`proxy.ts` in project root):
- Exported `proxy()` function runs on ALL requests (see config matcher)
- Calls `updateSession()` from `lib/supabase/proxy.ts` which:
  1. Refreshes Supabase session automatically
  2. Redirects unauthenticated users from protected pages to `/login`
  3. Redirects authenticated users from auth pages to `/`
- Protected routes: `/`, `/onboarding`
- Public routes: `/login`, `/register`

**Important**:
- Do NOT add auth checks in `useEffect` with `redirect()` - this creates infinite loops
- Let proxy handle route protection
- Next.js 16 uses `proxy.ts` pattern (not traditional `middleware.ts`)

### Backend API Client Pattern

**Profile API** (`lib/api/profile.ts`):
- Client-side service for Go backend communication
- Automatically retrieves Supabase JWT token from session
- Adds token to `Authorization: Bearer` header
- Three main operations:
  - `createProfile(payload)` - POST `/api/v1/profile`
  - `getProfile()` - GET `/api/v1/profile`
  - `updateProfile(payload)` - PUT `/api/v1/profile`
- Error handling with user-friendly Spanish messages
- Type-safe with `CreateProfilePayload` and `ProfileResponse` interfaces

**Usage pattern:**
```typescript
import { createProfile } from '@/lib/api/profile'

await createProfile({
  name: "Juan",
  last_name: "Pérez",
  country: "México",
  goal: "perder_peso",
  activity_level: "moderado",
  dislikes: ["pescado"]
})
```

### Type Safety Pattern

**Shared Types** (`lib/types/onboarding.ts`):
- Single source of truth for onboarding data structure
- Eliminates duplicate interface definitions
- Numeric fields (edad, peso, estatura, comidas_al_dia) are `number` type, not `string`
- Arrays must be typed: `string[]` not `any[]`
- Constants exported for common values (OBJETIVOS, SEXO, NIVEL_ACTIVIDAD, etc.)

**Example - DO NOT create inline interfaces:**
```typescript
// ❌ Bad - duplicate interface
interface StepProps {
  data: { objetivo: string; edad: number; ... }
}

// ✅ Good - import shared type
import { OnboardingStepProps } from '@/lib/types/onboarding'
```

## Styling Conventions

**Color Palette:**
- Primary: Green (#22C55E) and Emerald (#10B981)
- Accent: Orange (#F97316) - used sparingly
- Neutrals: Gray (NOT slate)
- Gradients: `from-green-600 to-emerald-600` for headings and buttons

**Glassmorphism Pattern:**
```typescript
className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50"
```

**Selection States:**
- Selected: `border-green-500 bg-green-50 shadow-lg shadow-green-500/20`
- Unselected: `border-gray-200 bg-white hover:border-gray-300 hover:shadow-md`

**Button Styles:**
- Primary CTA: `bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700`
- Shadow: `shadow-lg shadow-green-500/20 hover:shadow-green-500/40`
- Hover effect: `hover:scale-[1.02]`

**Animations:**
- Use Framer Motion for all animations
- Stagger delays: `delay: index * 0.05` for list items
- Entry animations: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Page transitions: `initial={{ opacity: 0, x: 30 }}` → `exit={{ opacity: 0, x: -30 }}`

## Common Pitfalls to Avoid

1. **Using `redirect()` in Client Components** - Causes "not a function" errors; use `router.push()`
2. **Mixing up Supabase client types** - Always match component type (client/server)
3. **Creating duplicate type definitions** - Always import from `lib/types/`
4. **Using slate colors** - Should be gray (palette consistency)
5. **Storing numbers as strings** - Age, weight, height are `number` type
6. **Missing type assertions on arrays** - Use `[] as string[]` not just `[]`
7. **Auth checks in useEffect** - Let proxy handle route protection
8. **Direct backend calls without JWT** - Always use `lib/api/*` clients which handle auth
9. **Saving to Supabase database** - User profiles are stored in Go backend, not Supabase

## Key Considerations

- **Language**: Spanish is used throughout the UI
- **Branding**: Package name is "menuum-frontend" and app displays "Menuum"
- **Domain**: Live at https://app.menuum.com/
- **Backend**: Go API at https://api.menuum.com
- **Database**: Profiles stored in Go backend database (not Supabase)
- **Form Library**: None - vanilla React state management with validation functions
- **Next.js Version**: 16 with Turbopack
- **Routing Layer**: Uses `proxy.ts` (Next.js 16 pattern) running on Node.js runtime
- **Onboarding**: 9 steps total (not 8) - added Step3Personales for personal information
