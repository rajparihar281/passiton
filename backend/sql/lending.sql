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







create policy "Users can view own requests"
  on public.borrow_requests for select
  using (
    auth.uid() = borrower_id or 
    auth.uid() = owner_id
  );

create policy "Users can create borrow requests"
  on public.borrow_requests for insert
  with check ( auth.uid() = borrower_id );

create policy "Participants can update request status"
  on public.borrow_requests for update
  using (
    auth.uid() = borrower_id or 
    auth.uid() = owner_id
  );

create policy "Users can view own transactions"
  on public.transactions for select
  using (
    auth.uid() = borrower_id or 
    auth.uid() = owner_id
  );