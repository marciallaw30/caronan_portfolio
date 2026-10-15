-- ===================================================================
-- ORACLE AI - CHAT HISTORY (Supabase / PostgreSQL)
-- Run this once in: Supabase Dashboard -> SQL Editor
-- ===================================================================

create table if not exists public.oracle_conversations (
  id          uuid primary key default gen_random_uuid(),
  user_email  text not null,
  title       text not null default 'New conversation',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.oracle_messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.oracle_conversations(id) on delete cascade,
  user_email       text not null,
  role             text not null check (role in ('user', 'model')),
  content          text not null,
  created_at       timestamptz not null default now()
);

create index if not exists idx_oracle_conv_user
  on public.oracle_conversations (user_email, updated_at desc);
create index if not exists idx_oracle_msg_conv
  on public.oracle_messages (conversation_id, created_at);

-- Row Level Security
-- NOTE: Oracle AI uses its own browser-based Gmail login (not Supabase Auth),
-- so the policies below allow the public (anon) key to read/write. The client
-- always filters by the signed-in user's email. For production, move login to
-- Supabase Auth and restrict policies with auth.jwt() ->> 'email'.
alter table public.oracle_conversations enable row level security;
alter table public.oracle_messages enable row level security;

drop policy if exists "oracle_conv_all" on public.oracle_conversations;
create policy "oracle_conv_all" on public.oracle_conversations
  for all to anon, authenticated using (true) with check (true);

drop policy if exists "oracle_msg_all" on public.oracle_messages;
create policy "oracle_msg_all" on public.oracle_messages
  for all to anon, authenticated using (true) with check (true);
