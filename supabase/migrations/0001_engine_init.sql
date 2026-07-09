-- =============================================================================
-- AIIVO ENGINE — initial schema (frozen contract)
-- Mirrors lib/engine/types.ts. Postgres / Supabase.
-- Workstreams add their own indexes, RLS policies, and seed migrations on top
-- (0002+). Do not alter these tables' columns without bumping the TS contract.
-- =============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------- enums ----------------------------------
create type jurisdiction_level as enum ('federal','state','county','city','special');
create type confidence        as enum ('confirmed','likely_required','verify');
create type record_status     as enum ('draft','scanning','in_review','ready','failed');
create type review_status     as enum ('auto_approved','pending','approved','edited','rejected');
create type filing_status     as enum ('queued','prefilled','needs_info','submitted','approved','rejected');
create type tier              as enum ('discover','report','file','monitor');
create type monitor_type      as enum ('requirement_change','renewal');
create type source_kind       as enum ('statute','agency_page','form','fee_schedule','dataset');
create type job_status        as enum ('pending','running','done','failed');

-- ------------------------------ [A] data / moat -----------------------------
create table jurisdictions (
  id           uuid primary key default gen_random_uuid(),
  level        jurisdiction_level not null,
  name         text not null,
  parent_id    uuid references jurisdictions(id) on delete set null,
  state_code   text,
  county_fips  text,
  place_fips   text,
  official_url text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on jurisdictions (level);
create index on jurisdictions (state_code);
create index on jurisdictions (parent_id);

create table permit_types (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text not null default '',
  default_level jurisdiction_level not null,
  naics         text[] not null default '{}',
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table sources (
  id              uuid primary key default gen_random_uuid(),
  jurisdiction_id uuid not null references jurisdictions(id) on delete cascade,
  url             text not null,
  title           text not null,
  kind            source_kind not null,
  hash            text not null default '',
  fetched_at      timestamptz not null default now(),
  verified_at     timestamptz,
  content_ref     text
);
create index on sources (jurisdiction_id);

create table requirements (
  id               uuid primary key default gen_random_uuid(),
  permit_type_id   uuid not null references permit_types(id) on delete cascade,
  jurisdiction_id  uuid not null references jurisdictions(id) on delete cascade,
  applies_to       jsonb not null default '{}',   -- { naics?, triggers?, notes? }
  typical_cost     text not null default '',
  typical_time     text not null default '',
  renewal          text not null default '',
  filing_url       text,
  base_confidence  confidence not null default 'likely_required',
  source_id        uuid references sources(id) on delete set null,
  last_verified_at timestamptz not null default now(),
  active           boolean not null default true
);
create index on requirements (permit_type_id);
create index on requirements (jurisdiction_id);
create index on requirements (last_verified_at);

-- ------------------------------ accounts ------------------------------------
create table profiles (
  id         uuid primary key,            -- = auth.users.id
  email      text not null,
  name       text,
  created_at timestamptz not null default now()
);

-- --------------------------- business + record ------------------------------
create table businesses (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references profiles(id) on delete cascade,  -- null = anon Discover
  name          text,
  business_type text not null,
  sells         text,
  naics         text[] not null default '{}',
  address       text not null,
  resolution    jsonb not null default '{}',
  triggers      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);
create index on businesses (owner_id);

create table records (
  id                 uuid primary key default gen_random_uuid(),
  business_id        uuid not null references businesses(id) on delete cascade,
  status             record_status not null default 'draft',
  tier               tier not null default 'discover',
  summary            text not null default '',
  jurisdiction_label text not null default '',
  estimated_cost     text not null default '',
  estimated_timeline text not null default '',
  notes              jsonb not null default '[]',
  clarifications     jsonb not null default '[]',
  created_at         timestamptz not null default now()
);
create index on records (business_id);

create table record_items (
  id               uuid primary key default gen_random_uuid(),
  record_id        uuid not null references records(id) on delete cascade,
  permit_type_id   uuid references permit_types(id) on delete set null,
  requirement_id   uuid references requirements(id) on delete set null,
  jurisdiction_id  uuid references jurisdictions(id) on delete set null,
  name             text not null,
  authority        text not null default '',
  level            jurisdiction_level not null,
  cost             text not null default '',
  time             text not null default '',
  renewal          text not null default '',
  description      text not null default '',
  requirements     jsonb not null default '[]',
  confidence       confidence not null default 'verify',
  filing_url       text,
  last_verified_at timestamptz,
  review_status    review_status not null default 'auto_approved'
);
create index on record_items (record_id);

-- ------------------------------ [D] review ----------------------------------
create table review_queue (
  id             uuid primary key default gen_random_uuid(),
  record_item_id uuid not null references record_items(id) on delete cascade,
  reason         text not null,
  status         review_status not null default 'pending',
  reviewer_id    uuid references profiles(id) on delete set null,
  notes          text,
  created_at     timestamptz not null default now(),
  resolved_at    timestamptz
);
create index on review_queue (status);

-- ------------------------------ [E] filing ----------------------------------
create table filings (
  id             uuid primary key default gen_random_uuid(),
  record_item_id uuid not null references record_items(id) on delete cascade,
  business_id    uuid not null references businesses(id) on delete cascade,
  status         filing_status not null default 'queued',
  portal         text,
  external_ref   text,
  submitted_at   timestamptz,
  last_status_at timestamptz not null default now(),
  payload        jsonb not null default '{}',
  audit          jsonb not null default '[]'
);
create index on filings (status);
create index on filings (business_id);

-- ---------------------------- [F] monitoring --------------------------------
create table monitors (
  id              uuid primary key default gen_random_uuid(),
  business_id     uuid references businesses(id) on delete cascade,
  record_id       uuid references records(id) on delete cascade,
  type            monitor_type not null,
  requirement_id  uuid references requirements(id) on delete set null,
  next_check_at   timestamptz not null default now(),
  last_checked_at timestamptz,
  active          boolean not null default true
);
create index on monitors (next_check_at) where active;

create table renewals (
  id             uuid primary key default gen_random_uuid(),
  record_item_id uuid references record_items(id) on delete cascade,
  filing_id      uuid references filings(id) on delete cascade,
  due_at         timestamptz not null,
  reminded_at    timestamptz,
  auto           boolean not null default false,
  status         text not null default 'upcoming'  -- upcoming|reminded|filed|lapsed
);
create index on renewals (due_at);

-- ------------------------ [G] billing  /  [H] api ---------------------------
create table subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references profiles(id) on delete cascade,
  stripe_customer_id  text not null,
  stripe_sub_id       text,
  tier                tier not null,
  status              text not null default 'active',
  current_period_end  timestamptz
);
create index on subscriptions (owner_id);

create table api_keys (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references profiles(id) on delete cascade,
  name              text not null,
  prefix            text not null,
  key_hash          text unique not null,
  scopes            text[] not null default '{}',
  rate_limit_per_min int not null default 60,
  created_at        timestamptz not null default now(),
  last_used_at      timestamptz,
  revoked_at        timestamptz
);
create index on api_keys (owner_id);

create table usage_events (
  id         uuid primary key default gen_random_uuid(),
  api_key_id uuid not null references api_keys(id) on delete cascade,
  endpoint   text not null,
  units      int not null default 1,
  cost_cents int not null default 0,
  created_at timestamptz not null default now()
);
create index on usage_events (api_key_id, created_at);

-- ------------------------- infra: background jobs ---------------------------
create table jobs (
  id         uuid primary key default gen_random_uuid(),
  type       text not null,
  payload    jsonb not null default '{}',
  status     job_status not null default 'pending',
  run_at     timestamptz not null default now(),
  attempts   int not null default 0,
  max_attempts int not null default 3,
  last_error text,
  created_at timestamptz not null default now()
);
create index on jobs (status, run_at);

-- =============================================================================
-- RLS: enabled by default; each workstream ships its policies in a later
-- migration. Service-role (engine) bypasses RLS. User-facing tables
-- (profiles, businesses, records, record_items, subscriptions, api_keys)
-- must be owner-scoped before launch.
-- =============================================================================
alter table profiles      enable row level security;
alter table businesses    enable row level security;
alter table records       enable row level security;
alter table record_items  enable row level security;
alter table subscriptions enable row level security;
alter table api_keys      enable row level security;
