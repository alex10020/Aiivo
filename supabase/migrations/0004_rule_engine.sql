-- =============================================================================
-- AIIVO ENGINE — deterministic rule layer (additive; production path)
-- Replaces the fuzzy applies_to {naics,triggers} matching with a boolean
-- condition AST over a controlled fact vocabulary + an explicit dependency tree.
-- Safe to apply: adds columns/tables, backfills existing rows, touches nothing
-- the running engine reads. The shadow evaluator runs off the in-repo catalog
-- until cutover, so applying this is NOT required for the shadow diff.
-- =============================================================================

-- The controlled discovery vocabulary. The wizard is generated from this.
create type fact_type as enum ('boolean','enum','integer','text');

create table if not exists facts (
  id          uuid primary key default gen_random_uuid(),
  key         text unique not null,
  label       text not null,
  type        fact_type not null,
  enum_values text[] not null default '{}',
  stage       text not null,               -- corporate|location|operations|employment
  help        text
);

insert into facts (key, label, type, enum_values, stage) values
  ('entity_type','Entity type','enum','{sole_prop,partnership,llc,s_corp,c_corp,nonprofit,not_formed}','corporate'),
  ('is_employer','Will have W-2 employees','boolean','{}','corporate'),
  ('location_type','Location type','enum','{commercial,home_based,mobile,online_only}','location'),
  ('new_buildout','New build-out or change of use','boolean','{}','location'),
  ('installs_signage','Installs exterior signage','boolean','{}','location'),
  ('serves_food','Prepares or serves food','boolean','{}','operations'),
  ('food_service_type','Food service type','enum','{full_service,limited,prepackaged,mobile_food,none}','operations'),
  ('serves_alcohol','Sells or serves alcohol','boolean','{}','operations'),
  ('alcohol_type','Alcohol type','enum','{beer_wine,spirits,off_premise,none}','operations'),
  ('sells_taxable_goods','Sells taxable goods','boolean','{}','operations'),
  ('seating','Seat count','integer','{}','operations'),
  ('outdoor_seating','Has outdoor / sidewalk seating','boolean','{}','operations'),
  ('employee_count','Number of employees','integer','{}','employment')
on conflict (key) do nothing;

-- Turn each requirement into a deterministic rule.
alter table requirements
  add column if not exists condition jsonb not null default '{"op":"always"}'::jsonb,
  add column if not exists supersedes_requirement_id uuid references requirements(id) on delete set null;

-- Dependency tree: prerequisites first (EIN → Sales Tax → …).
create table if not exists requirement_dependencies (
  requirement_id            uuid not null references requirements(id) on delete cascade,
  depends_on_requirement_id uuid not null references requirements(id) on delete cascade,
  kind text not null default 'prerequisite',
  primary key (requirement_id, depends_on_requirement_id)
);
create index if not exists req_deps_req_idx on requirement_dependencies (requirement_id);

-- Hot path of the evaluator: candidate lookup by jurisdiction.
create index if not exists req_active_jurisdiction_idx
  on requirements (jurisdiction_id) where active;

-- ---------------------------------------------------------------------------
-- Backfill: map the existing fuzzy applies_to into deterministic conditions.
-- Idempotent — only rewrites rows still on the default 'always'.
-- ---------------------------------------------------------------------------
update requirements set condition = case
  when applies_to->'triggers' ? 'food'      then '{"op":"fact","key":"serves_food"}'::jsonb
  when applies_to->'triggers' ? 'employees' then '{"op":"gte","key":"employee_count","value":1}'::jsonb
  when applies_to->'triggers' ? 'signage'   then '{"op":"fact","key":"installs_signage"}'::jsonb
  when applies_to->'triggers' ? 'alcohol'   then '{"op":"fact","key":"serves_alcohol"}'::jsonb
  when applies_to->'triggers' ? 'retail'    then '{"op":"fact","key":"sells_taxable_goods"}'::jsonb
  when applies_to ? 'naics'
    then '{"op":"or","nodes":[{"op":"fact","key":"serves_food"},{"op":"fact","key":"sells_taxable_goods"}]}'::jsonb
  else '{"op":"always"}'::jsonb
end
where condition = '{"op":"always"}'::jsonb;

-- Dependency: every tax/employer registration depends on the federal EIN.
insert into requirement_dependencies (requirement_id, depends_on_requirement_id)
select r.id, ein.id
from requirements r
join permit_types p on p.id = r.permit_type_id
cross join lateral (
  select req.id from requirements req
  join permit_types pt on pt.id = req.permit_type_id
  where pt.slug = 'ein' limit 1
) ein
where p.slug in ('sales-use-tax','employer-withholding','unemployment-insurance')
on conflict do nothing;
