-- Job Application Tracker — Initial Schema

-- Status enum for application pipeline stages
create type application_status as enum (
  'wishlist',
  'applied',
  'phone_screen',
  'interview',
  'offer',
  'accepted',
  'rejected',
  'withdrawn'
);

-- Interview type enum
create type interview_type as enum (
  'phone',
  'technical',
  'take_home',
  'onsite',
  'final',
  'other'
);

-- Core job applications table
create table job_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  company       text not null,
  role          text not null,
  status        application_status not null default 'applied',
  date_applied  date not null default current_date,
  location      text,
  url           text,
  salary_min    integer,
  salary_max    integer,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Interview dates and details for each application
create table interviews (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references job_applications(id) on delete cascade,
  interview_date  timestamptz not null,
  type            interview_type not null default 'other',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Indexes
create index job_applications_user_id_idx  on job_applications(user_id);
create index job_applications_status_idx   on job_applications(status);
create index job_applications_date_idx     on job_applications(date_applied desc);
create index interviews_application_id_idx on interviews(application_id);
create index interviews_date_idx           on interviews(interview_date);

-- Auto-update updated_at on row changes
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger job_applications_updated_at
  before update on job_applications
  for each row execute function set_updated_at();

create trigger interviews_updated_at
  before update on interviews
  for each row execute function set_updated_at();

-- Row Level Security: users can only access their own data
alter table job_applications enable row level security;
alter table interviews       enable row level security;

create policy "users can manage their own applications"
  on job_applications
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can manage their own interviews"
  on interviews
  for all
  using (
    exists (
      select 1 from job_applications
      where id = interviews.application_id
        and user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from job_applications
      where id = interviews.application_id
        and user_id = auth.uid()
    )
  );
