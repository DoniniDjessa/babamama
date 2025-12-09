-- Table ali-customers pour stocker les clients de l'application store
-- Cette table est séparée de ali-users qui sera utilisée par l'admin app

create table if not exists public."ali-customers" (
  id uuid default uuid_generate_v4() primary key,
  auth_user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  phone text not null,
  name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index pour les recherches rapides
create index if not exists idx_ali_customers_auth_user_id on public."ali-customers"(auth_user_id);
create index if not exists idx_ali_customers_email on public."ali-customers"(email);
create index if not exists idx_ali_customers_phone on public."ali-customers"(phone);

-- Enable RLS
alter table public."ali-customers" enable row level security;

-- Policy: Les utilisateurs peuvent lire leurs propres données
create policy "Customers can read own data" on public."ali-customers"
  for select using (auth.uid() = auth_user_id);

-- Policy: Les utilisateurs peuvent mettre à jour leurs propres données
create policy "Customers can update own data" on public."ali-customers"
  for update using (auth.uid() = auth_user_id);

-- Policy: Permettre l'insertion (sera géré par trigger ou API)
create policy "Allow insert for authenticated users" on public."ali-customers"
  for insert with check (auth.uid() = auth_user_id);

-- Trigger pour mettre à jour updated_at automatiquement
create or replace function update_ali_customers_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_ali_customers_updated_at
  before update on public."ali-customers"
  for each row
  execute function update_ali_customers_updated_at();

