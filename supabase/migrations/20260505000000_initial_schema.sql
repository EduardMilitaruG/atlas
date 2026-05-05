-- Extensions
create extension if not exists "uuid-ossp";

-- ─── daily_logs ───────────────────────────────────────────────────────────────
create table daily_logs (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users on delete cascade,
  log_date            date not null,
  sleep_hours         numeric(4,1),
  sleep_quality       int check (sleep_quality between 1 and 5),
  mood                int check (mood between 1 and 5),
  stress              int check (stress between 1 and 10),
  cigarettes_count    int default 0,
  water_glasses       int default 0,
  protein_grams       int,
  steps_count         int,
  last_caffeine_time  time,
  hard_thing_text     text,
  hard_thing_done     bool default false,
  notes               text,
  submitted_at        timestamptz,
  created_at          timestamptz not null default now(),
  unique (user_id, log_date)
);
create index on daily_logs (user_id, log_date);

-- ─── workouts ─────────────────────────────────────────────────────────────────
create table workouts (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  workout_date  date not null,
  type          text not null check (type in ('push','pull','legs','cardio','rest')),
  duration_min  int,
  notes         text,
  created_at    timestamptz not null default now()
);
create index on workouts (user_id, workout_date);

-- ─── workout_sets ─────────────────────────────────────────────────────────────
create table workout_sets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  workout_id  uuid not null references workouts on delete cascade,
  exercise    text not null,
  set_number  int not null,
  reps        int,
  weight_kg   numeric(5,2),
  rpe         int check (rpe between 1 and 10),
  created_at  timestamptz not null default now()
);
create index on workout_sets (workout_id);

-- ─── weight_logs ──────────────────────────────────────────────────────────────
create table weight_logs (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users on delete cascade,
  log_date   date not null,
  weight_kg  numeric(5,2) not null,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);
create index on weight_logs (user_id, log_date);

-- ─── progress_photos ──────────────────────────────────────────────────────────
create table progress_photos (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users on delete cascade,
  taken_at       timestamptz not null,
  front_url      text,
  side_url       text,
  back_url       text,
  bodyweight_kg  numeric(5,2),
  notes          text,
  created_at     timestamptz not null default now()
);
create index on progress_photos (user_id, taken_at);

-- ─── habits ───────────────────────────────────────────────────────────────────
create table habits (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  name            text not null,
  target_per_week int not null default 7,
  category        text check (category in ('mind','body','work')),
  is_active       bool not null default true,
  created_at      timestamptz not null default now()
);

-- ─── habit_logs ───────────────────────────────────────────────────────────────
create table habit_logs (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users on delete cascade,
  habit_id   uuid not null references habits on delete cascade,
  log_date   date not null,
  completed  bool not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, log_date)
);
create index on habit_logs (user_id, log_date);

-- ─── journal_entries ──────────────────────────────────────────────────────────
create table journal_entries (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  entry_date      date not null,
  went_well       text,
  didnt_go_well   text,
  grateful_for    text,
  free_form       text,
  created_at      timestamptz not null default now(),
  unique (user_id, entry_date)
);
create index on journal_entries (user_id, entry_date);

-- ─── applications ─────────────────────────────────────────────────────────────
create table applications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  applied_at  date not null,
  company     text not null,
  role        text not null,
  link        text,
  status      text not null default 'applied'
    check (status in ('applied','screening','interview','offer','rejected','ghosted')),
  notes       text,
  last_update date,
  created_at  timestamptz not null default now()
);
create index on applications (user_id, applied_at);

-- ─── books ────────────────────────────────────────────────────────────────────
create table books (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  title         text not null,
  author        text,
  category      text check (category in ('technical','philosophy','self_help','fiction')),
  started_at    date,
  finished_at   date,
  current_page  int default 0,
  total_pages   int,
  rating        int check (rating between 1 and 5),
  created_at    timestamptz not null default now()
);

-- ─── reading_sessions ─────────────────────────────────────────────────────────
create table reading_sessions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users on delete cascade,
  book_id      uuid not null references books on delete cascade,
  session_date date not null,
  minutes      int not null,
  pages_read   int,
  created_at   timestamptz not null default now()
);
create index on reading_sessions (user_id, session_date);

-- ─── expenses ─────────────────────────────────────────────────────────────────
create table expenses (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users on delete cascade,
  expense_date date not null,
  category     text not null check (category in ('food','transport','gym','personal','other')),
  amount_eur   numeric(8,2) not null,
  note         text,
  created_at   timestamptz not null default now()
);
create index on expenses (user_id, expense_date);

-- ─── income ───────────────────────────────────────────────────────────────────
create table income (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users on delete cascade,
  income_date  date not null,
  source       text not null,
  amount_eur   numeric(8,2) not null,
  created_at   timestamptz not null default now()
);
create index on income (user_id, income_date);

-- ─── goals ────────────────────────────────────────────────────────────────────
create table goals (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  title         text not null,
  metric        text,
  target_value  numeric,
  current_value numeric default 0,
  deadline      date,
  status        text not null default 'active'
    check (status in ('active','done','abandoned')),
  category      text,
  created_at    timestamptz not null default now()
);

-- ─── chess_ratings ────────────────────────────────────────────────────────────
create table chess_ratings (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users on delete cascade,
  rated_on   date not null,
  rapid_elo  int not null,
  created_at timestamptz not null default now()
);
create index on chess_ratings (user_id, rated_on);

-- ─── supplements_log ──────────────────────────────────────────────────────────
create table supplements_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  log_date    date not null,
  minox_am    bool not null default false,
  minox_pm    bool not null default false,
  finasteride bool not null default false,
  creatine    bool not null default false,
  vitamin_d   bool not null default false,
  omega3      bool not null default false,
  magnesium   bool not null default false,
  created_at  timestamptz not null default now(),
  unique (user_id, log_date)
);
create index on supplements_log (user_id, log_date);

-- ─── looksmax_log ─────────────────────────────────────────────────────────────
create table looksmax_log (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references auth.users on delete cascade,
  log_date          date not null,
  flossed           bool not null default false,
  whitening         bool not null default false,
  skincare_am       bool not null default false,
  skincare_pm       bool not null default false,
  posture_exercises bool not null default false,
  created_at        timestamptz not null default now(),
  unique (user_id, log_date)
);
create index on looksmax_log (user_id, log_date);

-- ─── social_log ───────────────────────────────────────────────────────────────
create table social_log (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references auth.users on delete cascade,
  log_date               date not null,
  in_person_interactions int not null default 0,
  notes                  text,
  created_at             timestamptz not null default now(),
  unique (user_id, log_date)
);
create index on social_log (user_id, log_date);

-- ─── eye_observations ─────────────────────────────────────────────────────────
create table eye_observations (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users on delete cascade,
  observed_on   date not null,
  drift_noticed bool not null default false,
  triggers      text check (triggers in ('fatigue','alcohol','screens','none')),
  notes         text,
  created_at    timestamptz not null default now()
);
create index on eye_observations (user_id, observed_on);

-- ─── alerts ───────────────────────────────────────────────────────────────────
create table alerts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users on delete cascade,
  type            text not null,
  message         text not null,
  triggered_at    timestamptz not null default now(),
  acknowledged_at timestamptz,
  created_at      timestamptz not null default now()
);
create index on alerts (user_id, triggered_at);

-- ─── badges ───────────────────────────────────────────────────────────────────
create table badges (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users on delete cascade,
  type       text not null,
  awarded_at timestamptz not null default now(),
  week_start date,
  created_at timestamptz not null default now()
);

-- ─── weekly_reviews ───────────────────────────────────────────────────────────
create table weekly_reviews (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  week_start  date not null,
  trend_text  text,
  what_worked text,
  what_broke  text,
  one_change  text,
  created_at  timestamptz not null default now(),
  unique (user_id, week_start)
);

-- ─── monthly_reviews ──────────────────────────────────────────────────────────
create table monthly_reviews (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users on delete cascade,
  month_start date not null,
  one_to_drop text,
  one_to_add  text,
  created_at  timestamptz not null default now(),
  unique (user_id, month_start)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- Row-Level Security — every table restricted to auth.uid()
-- ═══════════════════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  foreach t in array array[
    'daily_logs','workouts','workout_sets','weight_logs','progress_photos',
    'habits','habit_logs','journal_entries','applications','books',
    'reading_sessions','expenses','income','goals','chess_ratings',
    'supplements_log','looksmax_log','social_log','eye_observations',
    'alerts','badges','weekly_reviews','monthly_reviews'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy "users own their rows" on %I
       for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t
    );
  end loop;
end $$;
