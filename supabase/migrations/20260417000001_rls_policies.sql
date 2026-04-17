-- Ensure RLS is enabled and all policies are in place.
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE patterns.

-- ── job_applications ─────────────────────────────────────────────────────────

alter table job_applications enable row level security;

drop policy if exists "users can manage their own applications" on job_applications;
create policy "users can manage their own applications"
  on job_applications
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── interviews ────────────────────────────────────────────────────────────────

alter table interviews enable row level security;

drop policy if exists "users can manage their own interviews" on interviews;
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
