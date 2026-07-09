-- =============================================================================
-- AIIVO ENGINE — RLS policies + profile bootstrap (Phase 1, workstream I)
-- Additive on top of 0001_engine_init.sql. Service-role bypasses RLS; these
-- policies scope the ANON/user key to the signed-in owner's rows.
-- =============================================================================

-- Auto-create a profile row whenever a Supabase auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------- profiles -----------------------------------
create policy "profiles: own read"   on profiles for select using (auth.uid() = id);
create policy "profiles: own update" on profiles for update using (auth.uid() = id);

-- ------------------------------ businesses ----------------------------------
create policy "businesses: own read"   on businesses for select using (auth.uid() = owner_id);
create policy "businesses: own insert" on businesses for insert with check (auth.uid() = owner_id);
create policy "businesses: own update" on businesses for update using (auth.uid() = owner_id);
create policy "businesses: own delete" on businesses for delete using (auth.uid() = owner_id);

-- -------------------------------- records -----------------------------------
create policy "records: own read" on records for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "records: own insert" on records for insert
  with check (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

-- ------------------------------ record_items --------------------------------
create policy "record_items: own read" on record_items for select
  using (exists (
    select 1 from records r join businesses b on b.id = r.business_id
    where r.id = record_id and b.owner_id = auth.uid()));

-- ----------------------------- subscriptions --------------------------------
create policy "subscriptions: own read" on subscriptions for select using (auth.uid() = owner_id);

-- -------------------------------- api_keys ----------------------------------
create policy "api_keys: own read"   on api_keys for select using (auth.uid() = owner_id);
create policy "api_keys: own insert" on api_keys for insert with check (auth.uid() = owner_id);
create policy "api_keys: own update" on api_keys for update using (auth.uid() = owner_id);

-- filings: user-visible through the app API (service role); enable + scope read.
alter table filings enable row level security;
create policy "filings: own read" on filings for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));
