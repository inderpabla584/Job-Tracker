import type {
  JobApplicationWithInterviews,
  NewJobApplication,
  UpdateJobApplication,
} from './types'

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T
  const text = await res.text()
  if (!res.ok) throw new Error(text || res.statusText)
  return JSON.parse(text)
}

// Cookies are sent automatically by the browser — no manual auth headers needed

export async function fetchApplications(): Promise<JobApplicationWithInterviews[]> {
  return handleResponse(await fetch('/api/applications'))
}

export async function createApplication(
  data: NewJobApplication
): Promise<JobApplicationWithInterviews> {
  return handleResponse(
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  )
}

export async function updateApplication(
  id: string,
  data: UpdateJobApplication
): Promise<JobApplicationWithInterviews> {
  return handleResponse(
    await fetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  )
}

export async function deleteApplication(id: string): Promise<void> {
  return handleResponse(await fetch(`/api/applications/${id}`, { method: 'DELETE' }))
}
