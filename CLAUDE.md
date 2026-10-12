# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build; also the only type check (no lint/test scripts or test framework exist)
- `npm start` — serve the production build

## Environment (`.env.local`)

`.env.example` only lists the Supabase vars; the code also needs:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` — Google OAuth redirect base
- `SUPABASE_SERVICE_ROLE_KEY` — server only; used by `utils/supabase/admin.ts` for guest booking/receipt access

## Architecture

Homestay booking app built on the Next.js 15 (App Router, React 19) + Supabase starter kit, with guest QR bank-transfer payments. Path alias `@/*` → repo root.

**Supabase clients** — always use the right one:
- `utils/supabase/server.ts` `createClient()` (async) — Server Components, Server Actions, route handlers
- `utils/supabase/client.ts` `createClient()` — `"use client"` components
- `utils/supabase/middleware.ts` `updateSession()` — run by root `middleware.ts` on every request; refreshes the session cookie and redirects unauthenticated `/protected/*` requests to `/sign-in`

**Auth** — all flows are Server Actions in `app/actions.ts` (email/password, phone OTP, Google OAuth, password reset, profile completion). Pages live in the `app/(auth-pages)/` route group. Errors/success messages are passed back via query string using `encodedRedirect()` (`utils/utils.ts`) and rendered by `components/form-message.tsx`. `app/auth/callback/route.ts` exchanges the auth code and sends users without a profile row to `/complete-profile`.

**Rooms & availability**
- `app/rooms/rooms-client.tsx` (client) loads `rooms` and filters by date range by querying overlapping bookings (`in_date < checkOut AND out_date > checkIn`, excluding `BookingStatus = 'CANCELLED'`).
- `app/rooms/[id]/page.tsx` (server) renders one room; `room.facilities` is a JSON object (`wifi`, `parking`, `bbq_area`).
- Room photos are not in the DB: `lib/roomImage.ts` maps `room_id` → paths under `public/HomestayPic/`. Adding a room means adding an entry there.

**Payments (guest QR transfer, no account)** — `app/Payment/page.tsx` is the whole customer flow. `createBooking` (in `app/actions.ts`) inserts a `PENDING` booking with a random `access_token`, prepended to the httpOnly `booking_token` cookie (a comma-separated list, newest first; helpers in `lib/bookingCookie.ts`); the page reads that cookie (or `?booking=<token>`) to show the QR (`public/payment-qr.png`, supplied by the owner) and the receipt upload. `saveReceipt` validates via `lib/validateReceipt.ts` and stores the file in the private `receipts` bucket. Guests see their history at `/bookings` and, once `CONFIRMED`, a printable receipt at `/bookings/[token]` (token must also be in their cookie; reference format in `lib/receiptRef.ts`). Owners verify at `/admin/bookings` (needs `profiles.is_admin`); Confirm → `CONFIRMED`, Reject → `CANCELLED`. Guest access goes through the service-role client (`createAdminClient`) because anon can't pass RLS; `booking` is column-restricted for anon (see `supabase/guest-booking.sql`). `booking.user_id` is reserved for linking bookings to accounts once phone auth lands. Bookings are addressed by `access_token` (no assumption about the primary key).

**Supabase tables** used: `rooms`, `booking`, `profiles`. Table-name casing is inconsistent in code (`Profiles` in the auth callback) — Postgres identifiers are case-sensitive when quoted, so check which name actually exists before relying on either.

## UI conventions

- shadcn/ui components in `components/ui/` (`components.json`; `cn()` in `lib/utils.ts`).
- Brand colors in `tailwind.config.ts`: `brand-orange`, `brand-orange-hover`, `brand-navy`, `brand-yellow`, `brand-black`. Theme tokens are CSS variables in `app/globals.css`.
- Display font: `fraunces` from `lib/font.ts` (apply via `fraunces.className`); body font Geist set in `app/layout.tsx`.
- `components/tutorial/`, `deploy-button`, `env-var-warning`, `next-logo`, `supabase-logo` are leftover starter-kit files.
