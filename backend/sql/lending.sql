-- Borrow Requests
create table public.borrow_requests (
    id uuid primary key default gen_random_uuid(),
    item_id uuid references public.items(id) not null,
    borrower_id uuid references public.profiles(id) not null,
    owner_id uuid references public.profiles(id) not null,
    start_date date not null,
    end_date date not null,
    status request_status default 'pending',
    message text,
    created_at timestamp with time zone default now()
);

-- Active Transactions (Created only after request approval)
create table public.transactions (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references public.borrow_requests(id) not null,
    item_id uuid references public.items(id) not null,
    borrower_id uuid references public.profiles(id) not null,
    owner_id uuid references public.profiles(id) not null,
    status transaction_status default 'active',
    handover_time timestamp with time zone,
    return_time timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Indexes
create index requests_borrower_idx on public.borrow_requests(borrower_id);
create index requests_owner_idx on public.borrow_requests(owner_id);

-- Enable Security
alter table public.borrow_requests enable row level security;
alter table public.transactions enable row level security;