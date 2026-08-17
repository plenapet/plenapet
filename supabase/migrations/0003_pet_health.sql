-- Vitalidad y Longevidad — perfil de mascota, encuesta de bienestar y
-- resultados de laboratorio (hemograma, química sanguínea, uroanálisis,
-- coprológico, etc.), cargados manualmente por el equipo interno.
-- Ver vault obsiadian/PLENAPET/Iniciativas/Vitalidad-y-Longevidad.md.

-- =========================================================================
-- Perfil de mascota (dueño de la fila = auth.uid() vía profiles)
-- =========================================================================

create table pets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  species text not null check (species in ('perro', 'gato')),
  breed text,
  sex text check (sex in ('macho', 'hembra')),
  sterilized boolean,
  birth_date date,
  estimated_age_years numeric,
  weight_kg numeric,
  photo_url text,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Encuestas de bienestar (índice de fragilidad/vitalidad por dominio)
-- =========================================================================

create table wellness_surveys (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  answers jsonb not null,
  domain_scores jsonb not null,
  overall_score numeric not null
);

-- =========================================================================
-- Laboratorio — el equipo interno carga esto manualmente a partir del
-- reporte que entrega el laboratorio aliado (fuera de esta plataforma).
-- =========================================================================

create table lab_panels (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  lab_name text,
  sample_taken_at date,
  status text not null default 'draft' check (status in ('draft', 'published')),
  notes text,
  created_by uuid references admin_users(id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table lab_results (
  id uuid primary key default gen_random_uuid(),
  lab_panel_id uuid not null references lab_panels(id) on delete cascade,
  exam_type text not null,
  analyte_name text not null,
  value numeric,
  value_text text,
  unit text,
  reference_min numeric,
  reference_max numeric,
  organ_system text not null default 'general',
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Recomendaciones (de encuesta o de laboratorio), enlazables a un producto
-- =========================================================================

create table health_recommendations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  source text not null check (source in ('survey', 'lab', 'manual')),
  title text not null,
  description text,
  severity text not null default 'info' check (severity in ('info', 'atencion', 'urgente')),
  related_product_id uuid references products(id),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- Aprovisionar profiles automáticamente al registrarse un cliente nuevo
-- (hasta ahora profiles existía en el esquema pero nada lo llenaba, porque
-- no había señup de cliente).
-- =========================================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- RLS
-- =========================================================================

alter table pets enable row level security;
alter table wellness_surveys enable row level security;
alter table lab_panels enable row level security;
alter table lab_results enable row level security;
alter table health_recommendations enable row level security;

create policy "own pets" on pets for all
  using (auth.uid() = customer_id);

create policy "own wellness surveys" on wellness_surveys for select
  using (exists (select 1 from pets p where p.id = wellness_surveys.pet_id and p.customer_id = auth.uid()));

create policy "insert own wellness surveys" on wellness_surveys for insert
  with check (exists (select 1 from pets p where p.id = wellness_surveys.pet_id and p.customer_id = auth.uid()));

-- El dueño solo ve paneles/resultados ya publicados por el equipo interno
-- (mientras está en 'draft', solo service_role -es decir, el admin- lo ve).
create policy "own published lab panels" on lab_panels for select
  using (
    status = 'published'
    and exists (select 1 from pets p where p.id = lab_panels.pet_id and p.customer_id = auth.uid())
  );

create policy "own published lab results" on lab_results for select
  using (
    exists (
      select 1 from lab_panels lp
      join pets p on p.id = lp.pet_id
      where lp.id = lab_results.lab_panel_id
        and lp.status = 'published'
        and p.customer_id = auth.uid()
    )
  );

create policy "own health recommendations" on health_recommendations for select
  using (exists (select 1 from pets p where p.id = health_recommendations.pet_id and p.customer_id = auth.uid()));
