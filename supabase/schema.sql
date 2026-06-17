-- ============================================================================
-- Portfolio App — full Postgres schema
-- Run this entire file in the Supabase SQL editor.
-- ============================================================================

-- ENUMS
create type user_status  as enum ('pending', 'active', 'suspended');
create type user_role    as enum ('user', 'admin', 'super_admin');
create type admin_action as enum ('approved','suspended','reinstated','deleted','created','updated');
create type skill_level  as enum ('beginner','intermediate','advanced','expert');

-- THEMES
create table themes (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text unique not null,
  description       text,
  preview_image_url text,
  is_active         boolean default true,
  created_at        timestamp with time zone default now()
);

insert into themes (name, slug, description, is_active) values
  ('Classic', 'classic', 'Clean two-column layout with sidebar', true),
  ('Minimal', 'minimal', 'Single-column, typography-first',      true),
  ('Bold',    'bold',    'Full-width hero, card-based sections',  true);

-- USER ROLES
create table user_roles (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role    user_role not null default 'user',
  unique (user_id)
);

-- PROFILES
create table profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  username         text unique not null,
  full_name        text,
  job_title        text,
  bio              text,
  location         text,
  avatar_url       text,
  github_url       text,
  linkedin_url     text,
  website_url      text,
  twitter_url      text,
  resume_url       text,
  resume_filename  text,
  show_github      boolean default true,
  show_linkedin    boolean default true,
  show_website     boolean default true,
  show_twitter     boolean default true,
  show_resume      boolean default true,
  show_email       boolean default false,
  show_location    boolean default true,
  selected_theme   text references themes(slug) default 'classic',
  status           user_status default 'pending',
  approved_at      timestamp with time zone,
  approved_by      uuid references auth.users(id),
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- PROJECTS
create table projects (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  title         text not null,
  description   text,
  project_url   text,
  github_url    text,
  image_url     text,
  tech_stack    text[],
  is_featured   boolean default false,
  display_order integer default 0,
  created_at    timestamp with time zone default now()
);

-- SKILLS
create table skills (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  name          text not null,
  category      text,
  level         skill_level,
  display_order integer default 0
);

-- AUDIT LOG
create table audit_log (
  id             uuid primary key default gen_random_uuid(),
  admin_id       uuid not null references auth.users(id),
  action         admin_action not null,
  target_user_id uuid references auth.users(id) on delete set null,
  metadata       jsonb,
  created_at     timestamp with time zone default now()
);

-- RLS: enable on all tables
alter table profiles   enable row level security;
alter table projects   enable row level security;
alter table skills     enable row level security;
alter table themes     enable row level security;
alter table user_roles enable row level security;
alter table audit_log  enable row level security;

-- Helper function: check if current user is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from user_roles
    where user_id = auth.uid()
    and role in ('admin', 'super_admin')
  );
$$ language sql security definer;

-- PROFILES policies
create policy "profiles are publicly viewable"
  on profiles for select using (true);
create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "admins can update any profile"
  on profiles for update using (is_admin());
create policy "admins can delete any profile"
  on profiles for delete using (is_admin());

-- PROJECTS policies
create policy "projects are publicly viewable"
  on projects for select using (true);
create policy "users can manage own projects"
  on projects for all using (auth.uid() = user_id);
create policy "admins can manage any project"
  on projects for all using (is_admin());

-- SKILLS policies
create policy "skills are publicly viewable"
  on skills for select using (true);
create policy "users can manage own skills"
  on skills for all using (auth.uid() = user_id);
create policy "admins can manage any skill"
  on skills for all using (is_admin());

-- THEMES policies
create policy "themes are publicly viewable"
  on themes for select using (true);
create policy "only admins can manage themes"
  on themes for all using (is_admin());

-- USER ROLES policies
create policy "admins can manage roles"
  on user_roles for all using (is_admin());
create policy "users can read own role"
  on user_roles for select using (auth.uid() = user_id);

-- AUDIT LOG policies
create policy "only admins can access audit log"
  on audit_log for all using (is_admin());

-- TRIGGER: auto-create profile + role on signup
create or replace function handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  suffix int := 0;
begin
  base_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '', 'g'));
  if base_username = '' then base_username := 'user'; end if;
  final_username := base_username;

  -- Ensure username uniqueness
  while exists (select 1 from public.profiles where username = final_username) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, full_name, status)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'pending'
  );
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- TRIGGER: auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- ============================================================================
-- STORAGE POLICIES
-- First create the buckets in the Storage dashboard:
--   avatars  -> public
--   resumes  -> private
-- Then run the policies below.
-- ============================================================================

create policy "avatars are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "users can upload own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can update own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can upload own resume"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can update own resume"
  on storage.objects for update
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users can read own resume"
  on storage.objects for select
  using (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "admins can read any resume"
  on storage.objects for select
  using (bucket_id = 'resumes' and is_admin());

-- ============================================================================
-- FIRST-TIME ADMIN SETUP
-- After signing up with your admin email, run this to promote yourself.
-- Replace the email below.
-- ============================================================================
--
-- update user_roles set role = 'super_admin'
-- where user_id = (select id from auth.users where email = 'your-admin-email@domain.com');
--
-- update profiles set status = 'active'
-- where id = (select id from auth.users where email = 'your-admin-email@domain.com');
