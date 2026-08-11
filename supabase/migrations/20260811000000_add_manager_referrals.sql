create table if not exists public.truck_etc_managers (
  id uuid primary key default gen_random_uuid(),
  manager_name text not null,
  manager_code text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  constraint truck_etc_managers_code_check check (manager_code ~ '^cm-[a-f0-9]{18}$')
);

alter table public.truck_etc_leads
  add column if not exists manager_code text,
  add column if not exists manager_name text;

create index if not exists truck_etc_leads_manager_code_idx on public.truck_etc_leads (manager_code);
alter table public.truck_etc_managers enable row level security;
revoke all on table public.truck_etc_managers from anon, authenticated;
