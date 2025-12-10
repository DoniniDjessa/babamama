-- Table ali-favorites pour stocker les favoris des utilisateurs
-- Cette table est utilisée par l'application store (babamama)

create table if not exists public."ali-favorites" (
  id uuid default uuid_generate_v4() primary key,
  auth_user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public."ali-products"(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(auth_user_id, product_id) -- Prevent duplicate favorites
);

-- Index pour les recherches rapides
create index if not exists idx_ali_favorites_auth_user_id on public."ali-favorites"(auth_user_id);
create index if not exists idx_ali_favorites_product_id on public."ali-favorites"(product_id);
create index if not exists idx_ali_favorites_created_at on public."ali-favorites"(created_at desc);

-- Enable RLS
alter table public."ali-favorites" enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can manage own favorites" on public."ali-favorites";

-- Policy: Users can manage their own favorites
create policy "Users can manage own favorites" on public."ali-favorites"
  for all using (auth.uid() = auth_user_id);

