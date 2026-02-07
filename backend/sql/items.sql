-- Items Table
create table public.items (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references public.profiles(id) on delete cascade not null,
    college_id uuid references public.colleges(id) not null,
    title text not null,
    description text,
    category text, 
    condition item_condition default 'good',
    is_available boolean default true,
    deposit_amount numeric default 0,
    rental_price numeric default 0,
    created_at timestamp with time zone default now(),
    search_vector tsvector 
);

-- Item Images (One item -> Many images)
create table public.item_images (
    id uuid primary key default gen_random_uuid(),
    item_id uuid references public.items(id) on delete cascade not null,
    image_url text not null,
    is_primary boolean default false
);

-- Indexes for performance
create index items_owner_idx on public.items(owner_id);
create index items_college_idx on public.items(college_id);

-- Enable Security
alter table public.items enable row level security;
alter table public.item_images enable row level security;