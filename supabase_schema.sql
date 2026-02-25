-- Run these commands in your Supabase SQL Editor to set up the database for the new community features

-- 1. Create Private Rooms Table
create table if not exists private_rooms (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  passcode text not null,
  created_by text not null
);

-- 2. Create Online Users Table (for presence/mentions)
create table if not exists online_users (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  last_seen timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Update Messages Table to support channels (if not already)
-- If your messages table doesn't have a 'channel' column, add it:
alter table messages add column if not exists channel uuid references private_rooms(id);
alter table messages add column if not exists sender_name text;

-- 4. Enable Row Level Security (RLS) - Optional for now but recommended
alter table private_rooms enable row level security;
alter table online_users enable row level security;

-- Policies (Open for everyone for now to match the unauthenticated flow)
create policy "Public rooms access" on private_rooms for all using (true);
create policy "Public presence access" on online_users for all using (true);
