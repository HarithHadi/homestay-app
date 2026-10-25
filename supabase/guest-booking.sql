-- Guest QR payment: run once in the Supabase SQL editor.
-- Assumes `booking` already has room_id, in_date, out_date, "BookingStatus".
-- Rows are addressed by access_token (no assumption about the primary key).

alter table booking
  add column if not exists access_token uuid not null default gen_random_uuid(),
  add column if not exists user_id uuid references auth.users (id), -- unused until phone auth
  add column if not exists guest_name text,
  add column if not exists guest_phone text,
  add column if not exists guest_email text,
  add column if not exists total_amount numeric(10, 2),
  add column if not exists receipt_url text;

create unique index if not exists booking_access_token_key on booking (access_token);

alter table profiles add column if not exists is_admin boolean not null default false;
-- make yourself the owner:
-- update profiles set is_admin = true where id = '<your auth user id>';

-- rooms-client.tsx reads booking with the anon key for availability search.
-- Expose only the columns it needs so guest name/phone/email/receipt stay private.
-- The service role (used by server actions) bypasses all of this.
revoke all on booking from anon, authenticated;
grant select (room_id, in_date, out_date, "BookingStatus") on booking to anon, authenticated;

alter table booking enable row level security;
drop policy if exists "public availability read" on booking;
create policy "public availability read" on booking for select using (true);

-- private bucket for receipts (served to the owner via signed URLs)
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;
