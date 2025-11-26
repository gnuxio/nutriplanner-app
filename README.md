# Menuum

Intelligent meal planning application built with Next.js and Supabase.

**Live at:** https://app.menuum.com/

## Features

- User authentication and profile management
- Multi-step onboarding flow to collect nutrition preferences and goals
- Personalized dashboard
- Modern UI with glassmorphism design and animations

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Backend:** Supabase (Auth + Database)
- **Deployment:** Docker

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open the application in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Docker Deployment

Build and run with Docker:
```bash
docker build -t menuum .
docker run -p 3000:3000 menuum
```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components (including shadcn/ui)
- `hooks/` - Custom React hooks
- `lib/` - Utilities, Supabase clients, and type definitions

## Development Notes

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation and development guidelines.
