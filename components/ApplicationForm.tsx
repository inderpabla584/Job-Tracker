'use client'

import { useState } from 'react'
import { createApplication, updateApplication } from '@/lib/api'
import type { ApplicationStatus, NewJobApplication, JobApplicationWithInterviews } from '@/lib/types'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'wishlist',     label: 'Wishlist' },
  { value: 'applied',      label: 'Applied' },
  { value: 'phone_screen', label: 'Phone Screen' },
  { value: 'interview',    label: 'Interview' },
  { value: 'offer',        label: 'Offer' },
  { value: 'accepted',     label: 'Accepted' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'withdrawn',    label: 'Withdrawn' },
]

const EMPTY: NewJobApplication = {
  company: '',
  role: '',
  status: 'applied',
  date_applied: new Date().toISOString().split('T')[0],
  location: null,
  url: null,
  salary_min: null,
  salary_max: null,
  notes: null,
}

interface Props {
  onSuccess: (app: JobApplicationWithInterviews) => void
  onCancel: () => void
  existing?: JobApplicationWithInterviews
}

function strOrNull(v: string): string | null {
  return v.trim() === '' ? null : v.trim()
}
function numOrNull(v: string): number | null {
  const n = Number(v)
  return v === '' || isNaN(n) ? null : n
}

export default function ApplicationForm({ onSuccess, onCancel, existing }: Props) {
  const [form, setForm] = useState<NewJobApplication>(
    existing
      ? {
          company:      existing.company,
          role:         existing.role,
          status:       existing.status,
          date_applied: existing.date_applied,
          location:     existing.location,
          url:          existing.url,
          salary_min:   existing.salary_min,
          salary_max:   existing.salary_max,
          notes:        existing.notes,
        }
      : EMPTY
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof NewJobApplication>(key: K, value: NewJobApplication[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      onSuccess(
        existing
          ? await updateApplication(existing.id, form)
          : await createApplication(form)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const requiredMark = (
    <span style={{ color: 'var(--primary)', marginLeft: 2 }}>*</span>
  )

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 5,
    display: 'block',
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20 }}>
      {error && (
        <div
          style={{
            fontSize: 13,
            color: '#DC2626',
            background: '#FEF2F2',
            border: '0.5px solid #FECACA',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {/* POSITION */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">Position</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Company{requiredMark}</label>
            <input
              className="form-input"
              value={form.company}
              onChange={e => set('company', e.target.value)}
              required
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label style={labelStyle}>Role{requiredMark}</label>
            <input
              className="form-input"
              value={form.role}
              onChange={e => set('role', e.target.value)}
              required
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={e => set('status', e.target.value as ApplicationStatus)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Date Applied</label>
            <input
              type="date"
              className="form-input"
              value={form.date_applied}
              onChange={e => set('date_applied', e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input
              className="form-input"
              value={form.location ?? ''}
              onChange={e => set('location', strOrNull(e.target.value))}
              placeholder="Remote / New York"
            />
          </div>
          <div>
            <label style={labelStyle}>Job URL</label>
            <input
              type="url"
              className="form-input"
              value={form.url ?? ''}
              onChange={e => set('url', strOrNull(e.target.value))}
              placeholder="https://…"
            />
          </div>
        </div>
      </div>

      {/* SALARY */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-label">Salary</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Min</label>
            <input
              type="number"
              className="form-input"
              value={form.salary_min ?? ''}
              onChange={e => set('salary_min', numOrNull(e.target.value))}
              placeholder="80,000"
            />
          </div>
          <div>
            <label style={labelStyle}>Max</label>
            <input
              type="number"
              className="form-input"
              value={form.salary_max ?? ''}
              onChange={e => set('salary_max', numOrNull(e.target.value))}
              placeholder="120,000"
            />
          </div>
        </div>
      </div>

      {/* NOTES */}
      <div style={{ marginBottom: 24 }}>
        <p className="section-label">Notes</p>
        <textarea
          className="form-textarea"
          rows={3}
          value={form.notes ?? ''}
          onChange={e => set('notes', strOrNull(e.target.value))}
          placeholder="Recruiter name, referral, next steps…"
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save application'}
        </button>
      </div>
    </form>
  )
}
