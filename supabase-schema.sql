-- Supabase Schema for ASCEND Leaderboard

-- Profiles Table
CREATE TABLE public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  username text unique,
  display_name text,
  headline text,
  bio text,
  location text,
  website text,
  avatar_url text,
  cover_url text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Activity Table
CREATE TABLE public.activity (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  action_type text,
  title text,
  detail text,
  xp_earned integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activity is viewable by everyone." ON activity FOR SELECT USING (true);
CREATE POLICY "Users can insert own activity." ON activity FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tasks (Roadmap) Table
CREATE TABLE public.tasks (
  id uuid default gen_random_uuid() primary key,
  section_title text not null,
  title text not null,
  description text,
  xp_reward integer default 0,
  deadline timestamp with time zone,
  status text default 'upcoming',
  order_index integer default 0
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks are viewable by everyone." ON tasks FOR SELECT USING (true);
-- Only admins can insert/update tasks (simplified: anyone authenticated can read)

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('profile_media', 'profile_media', true);

create policy "Media is publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'profile_media' );

create policy "Anyone can upload media"
  on storage.objects for insert
  with check ( bucket_id = 'profile_media' );

create policy "Anyone can update media"
  on storage.objects for update
  using ( bucket_id = 'profile_media' );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, username)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();