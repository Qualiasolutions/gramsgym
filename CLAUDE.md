# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Grams Gym is a bilingual (Arabic/English) gym management web application for a family-owned fitness center in Amman, Jordan. It provides:
- **Coach Dashboard**: Member management, bookings, subscriptions, schedule management
- **Member Portal**: PT booking, subscription viewing, AI fitness chatbot
- **Public Website**: Marketing pages with AI chatbot widget

**Supabase Project ID**: `xptjisbsopvgbakjiqcp`

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run Vitest in watch mode
npm run test:run     # Run tests once (CI mode)
npm run test:ui      # Open Vitest UI
npm run test:coverage  # Run with coverage report
```

### Running a Single Test
```bash
npm test -- src/lib/auth/__tests__/actions.test.ts   # Specific file
npm test -- -t "test name"                            # By test name
```

## Tech Stack

- **Framework**: Next.js 16.1 (App Router, React 19, TypeScript)
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS 4 + shadcn/ui (new-york style)
- **AI Chat**: OpenRouter API (currently using free Mistral model)
- **Animations**: Framer Motion
- **Monitoring**: Sentry, Vercel Analytics, Speed Insights
- **Notifications**: Resend (email), WhatsApp Business API (planned)

## Architecture

### Route Structure

```
src/app/
├── (auth)/           # Login pages with route group
│   ├── coach/login/
│   └── member/login/
├── coach/            # Protected coach dashboard (layout checks auth)
│   ├── dashboard/
│   ├── members/[id]/ # Dynamic member detail
│   ├── bookings/
│   ├── schedule/
│   ├── subscriptions/
│   ├── notifications/
│   ├── settings/
│   └── reports/
├── member/           # Protected member portal (layout checks auth)
│   ├── dashboard/
│   ├── profile/
│   ├── bookings/
│   ├── book/
│   └── subscriptions/
├── api/
│   ├── chat/         # AI chatbot endpoint (OpenRouter)
│   ├── health/       # Health check
│   ├── members/      # Import & expiry reminders
│   └── notifications/
└── auth/callback/    # OAuth callback handler
```

### Authentication Flow

- Supabase Auth with `@supabase/ssr` for server-side session handling
- Two user types: `coaches` and `members` tables (both link to `auth.users.id`)
- Auth callback at `/auth/callback` determines user type and redirects
- Demo mode available via `demo_mode` cookie (`'coach'` | `'member'`)

### Key Patterns

**Supabase Clients** (`src/lib/supabase/`):
- `client.ts`: Browser client (singleton pattern)
- `server.ts`: Server client + admin client (service role key)
- `middleware.ts`: Session refresh + route protection logic

**Server Actions** (`src/lib/actions/`):
- `members.ts`: CRUD for members (uses admin client for auth user creation)
- `subscriptions.ts`: Gym memberships and PT packages
- `schedule.ts`: Coach availability management
- `member-booking.ts`: PT session booking
- `member-profile.ts`: Member self-service profile updates

**Rate Limiting** (`src/lib/rate-limit.ts`):
- Uses Upstash Redis in production, in-memory fallback for dev
- Applied to `/api/chat` (20 req/min) to prevent AI API abuse

**Demo Mode**: Set `demo_mode` cookie (`'coach'` | `'member'`) to bypass auth. Only works in development (disabled in production for security). Demo data lives in `src/lib/demo-data.ts`.

**Database Types**: `src/types/database.ts` contains full Supabase-generated types with helper types (`MemberWithCoach`, `BookingWithDetails`, etc.).

## Database Schema

Core tables: `coaches`, `members`, `gym_memberships`, `pt_packages`, `coach_availability`, `bookings`, `notifications_log`, `gym_settings`, `gym_working_hours`, `pricing`

Key relationships:
- `members.assigned_coach_id` → `coaches.id`
- `pt_packages.coach_id` → `coaches.id`
- `bookings` links member, coach, and pt_package

## Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Chat (OpenRouter)
OPENROUTER_API_KEY=           # Currently using free Mistral model

# Rate Limiting (optional - falls back to in-memory)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Notifications
RESEND_API_KEY=               # Email notifications

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_APP_URL=
```

## Component Organization

```
src/components/
├── ui/               # shadcn/ui primitives + custom UI (stat-card, animated-*, circular-progress)
├── coach/            # Coach dashboard components (sidebar, header, forms, lists)
├── member/           # Member portal components (sidebar, header, booking-form)
├── chat/             # Chat widget
├── contact/          # Contact form
├── layout/           # Public header/footer
└── providers/        # Client providers wrapper
```

## AI Chatbot

The `/api/chat` endpoint uses OpenRouter with a comprehensive fitness expert system prompt. It:
- Supports image analysis (InBody test results)
- Injects gym-specific context (hours, pricing, coaches) from database
- Handles multipart form data for image uploads
- Falls back to demo data when `demo_mode` cookie is set

## Bilingual Support

- Content stored in both `_en` and `_ar` columns
- Member preference stored in `preferred_language` field
- UI currently defaults to English with dark theme

## Testing

Tests use Vitest with happy-dom. Located in `__tests__/` subdirectories next to source files.
- `src/lib/auth/__tests__/actions.test.ts` - Auth action tests
- `src/lib/__tests__/rate-limit.test.ts` - Rate limiting tests

Coverage excludes shadcn components (`src/components/ui/`).

## Security Notes

- Middleware protects `/coach/*` and `/member/*` routes (verifies user type via DB lookup)
- Demo mode is **disabled in production** (`NODE_ENV === 'production'`)
- Rate limiting on AI endpoints prevents abuse
- CSP headers configured in `next.config.ts`
- Member deletion uses admin client and deletes auth user first (safer order)
