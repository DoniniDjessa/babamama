-- Table ali-products pour stocker les produits
-- Cette table est utilisée par l'application store (babamama)

create table if not exists public."ali-products" (
  id uuid default uuid_generate_v4() primary key,
  
  -- Infos Publiques (Store)
  title text not null,
  description text, -- Peut contenir du HTML basique ou Markdown
  category text not null, -- Ex: 'HIGH-TECH', 'MAISON', 'BEAUTE', 'MODE', 'AUTO', 'MYSTERY'
  subcategory text, -- Sous-catégorie
  subsubcategory text, -- Sous-sous-catégorie
  images text[] not null default '{}', -- URLs Supabase Storage
  final_price_xof int not null, -- Le prix affiché au client (calculé)
  old_price_xof int, -- Ancien prix (pour afficher la réduction)
  new_price_xof int, -- Nouveau prix (après réduction)
  reduction_percentage int, -- Pourcentage de réduction (calculé automatiquement)
  rating float default 0, -- Note sur 5 étoiles (0-5)
  specs text[], -- Tableau de spécifications
  is_active boolean default true, -- Si false, invisible sur le Store
  is_new boolean default true, -- Badge 'Nouveau'
  stock_quantity int default 0, -- Quantité en stock
  min_quantity_to_sell int default 1, -- Quantité minimale à commander
  
  -- Infos Privées (Admin seulement)
  sourcing_price_yuan float, -- Prix d'achat fournisseur
  weight_kg float, -- Poids estimé pour le transport
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Index pour les recherches rapides
create index if not exists idx_ali_products_category on public."ali-products"(category);
create index if not exists idx_ali_products_is_active on public."ali-products"(is_active);
create index if not exists idx_ali_products_created_at on public."ali-products"(created_at desc);

-- Enable RLS
alter table public."ali-products" enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public Read Active Products" on public."ali-products";
drop policy if exists "Admin Full Access Products" on public."ali-products";

-- Policy: Tout le monde peut LIRE les produits actifs
create policy "Public Read Active Products" on public."ali-products"
  for select using (is_active = true);

-- Policy: Seul l'Admin (Authentifié) peut TOUT faire
create policy "Admin Full Access Products" on public."ali-products"
  for all using (auth.role() = 'authenticated');

-- Trigger pour mettre à jour updated_at automatiquement
create or replace function update_ali_products_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing trigger if it exists
drop trigger if exists update_ali_products_updated_at on public."ali-products";

create trigger update_ali_products_updated_at
  before update on public."ali-products"
  for each row
  execute function update_ali_products_updated_at();

