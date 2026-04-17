export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export type InterviewType =
  | 'phone'
  | 'technical'
  | 'take_home'
  | 'onsite'
  | 'final'
  | 'other'

export interface JobApplication {
  id: string
  user_id: string
  company: string
  role: string
  status: ApplicationStatus
  date_applied: string        // ISO date string (YYYY-MM-DD)
  location: string | null
  url: string | null
  salary_min: number | null
  salary_max: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Interview {
  id: string
  application_id: string
  interview_date: string      // ISO timestamp string
  type: InterviewType
  notes: string | null
  created_at: string
  updated_at: string
}

export type JobApplicationWithInterviews = JobApplication & {
  interviews: Interview[]
}

// Convenience types for inserts/updates (omit server-managed fields)
export type NewJobApplication = Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateJobApplication = Partial<NewJobApplication>

export type NewInterview = Omit<Interview, 'id' | 'created_at' | 'updated_at'>
export type UpdateInterview = Partial<Omit<NewInterview, 'application_id'>>
