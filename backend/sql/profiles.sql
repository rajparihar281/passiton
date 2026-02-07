-- Core Profile Table
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    college_id uuid references public.colleges(id),
    full_name text,
    avatar_url text,
    phone text,
    bio text,
    trust_score integer default 100,
    total_lends integer default 0,
    total_borrows integer default 0,
    verification_status verification_status default 'unverified',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ID Verification Documents
create table public.verifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade,
    document_url text not null,
    status verification_status default 'pending',
    submitted_at timestamp with time zone default now(),
    reviewed_at timestamp with time zone
);

-- Enable Security
alter table public.profiles enable row level security;
alter table public.verifications enable row level security;

-- AUTOMATION: Create profile when User Signs Up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();



create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );



create policy "Users can view own verifications"
  on public.verifications for select
  using ( auth.uid() = user_id );

create policy "Users can upload own verification docs"
  on public.verifications for insert
  with check ( auth.uid() = user_id );