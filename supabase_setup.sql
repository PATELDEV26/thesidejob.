-- USER INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor.
-- ALSO REMEMBER: in Supabase Dashboard → Database → Replication, enable realtime for these tables: 
-- `messages`, `private_rooms`, `ideas`, and `profiles`.

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  email text,
  created_at timestamp default now()
);
alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);


-- 2. PRIVATE ROOMS TABLE
create table if not exists private_rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  passcode text not null,
  created_by text,
  created_at timestamp default now()
);
alter table private_rooms enable row level security;
create policy "Anyone can read rooms" on private_rooms for select using (true);
create policy "Logged in users can create rooms" on private_rooms for insert with check (true);


-- 3. UPDATING MESSAGES TABLE
alter table messages drop column if exists channel;
alter table messages add column if not exists channel text default 'general';
create index if not exists messages_channel_idx on messages(channel);

alter table messages add column if not exists room_id uuid references private_rooms(id);
