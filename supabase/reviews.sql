-- Hand-picked reviews copied from Agoda, shown on /rooms/[id].
-- Check rooms.room_id's type first and match it below.
create table reviews (
  id          bigint generated always as identity primary key,
  room_id     bigint references rooms(room_id),   -- null = shown on every unit
  author      text not null,
  rating      numeric(3,1) check (rating between 0 and 10),  -- Agoda scores out of 10
  comment     text not null,
  review_date date,
  source      text not null default 'agoda'       -- leaves room for on-site reviews later
);
alter table reviews enable row level security;
create policy "public read" on reviews for select using (true);

alter table rooms add column agoda_url text;
