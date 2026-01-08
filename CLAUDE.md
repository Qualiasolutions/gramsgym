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
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
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

**Demo Mode**: Set `demo_mode` cookie to bypass auth for testing. Demo data lives in `src/lib/demo-data.ts`.

**Database Types**: `src/types/database.ts` contains full Supabase-generated types with helper types for common operations.

## Database Schema

Core tables: `coaches`, `members`, `gym_memberships`, `pt_packages`, `coach_availability`, `bookings`, `notifications_log`, `gym_settings`, `gym_working_hours`, `pricing`

Key relationships:
- `members.assigned_coach_id` → `coaches.id`
- `pt_packages.coach_id` → `coaches.id`
- `bookings` links member, coach, and pt_package

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=           # For AI chat
RESEND_API_KEY=               # For email notifications
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
