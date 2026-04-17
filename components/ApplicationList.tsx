'use client'

import { useState } from 'react'
import type { JobApplicationWithInterviews, ApplicationStatus } from '@/lib/types'
import ApplicationForm from '@/components/ApplicationForm'

const STATUS_STYLES: Record<ApplicationStatus, { bg: string; color: string }> = {
  wishlist:     { bg: '#F3F4F6', color: '#6B7280' },
  applied:      { bg: '#EFF6FF', color: '#2563EB' },
  phone_screen: { bg: '#FEFCE8', color: '#854D0E' },
  interview:    { bg: '#F5F3FF', color: '#6D28D9' },
  offer:        { bg: '#F0FDF4', color: '#15803D' },
  accepted:     { bg: '#DCFCE7', color: '#166534' },
  rejected:     { bg: '#FEF2F2', color: '#DC2626' },
  withdrawn:    { bg: '#F3F4F6', color: '#9CA3AF' },
}

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist:     'Wishlist',
  applied:      'Applied',
  phone_screen: 'Phone Screen',
  interview:    'Interview',
  offer:        'Offer',
  accepted:     'Accepted',
  rejected:     'Rejected',
  withdrawn:    'Withdrawn',
}

interface Props {
  applications: JobApplicationWithInterviews[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (app: JobApplicationWithInterviews) => void
}

export default function ApplicationList({ applications, onDelete, onUpdate }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleDelete(app: JobApplicationWithInterviews) {
    if (!confirm(`Delete application to ${app.company}?`)) return
    setDeletingId(app.id)
    try {
      await onDelete(app.id)
    } finally {
      setDeletingId(null)
    }
  }

  if (applications.length === 0) {
    return (
      <div
        className="card"
        style={{ textAlign: 'center', padding: '56px 28px', color: 'var(--text-muted)' }}
      >
        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No applications yet</p>
        <p style={{ fontSize: 13 }}>Hit <strong>+ New application</strong> to start tracking.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {applications.map(app => {
        const badge = STATUS_STYLES[app.status]

        if (editingId === app.id) {
          return (
            <ApplicationForm
              key={app.id}
              existing={app}
              onSuccess={updated => {
                onUpdate(updated)
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
            />
          )
        }

        return (
          <div
            key={app.id}
            className="card"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
          >
            {/* Left: info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{app.company}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: badge.bg,
                    color: badge.color,
                  }}
                >
                  {STATUS_LABELS[app.status]}
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                {app.role}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>
                  Applied {new Date(app.date_applied + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {app.location && <span>{app.location}</span>}
                {(app.salary_min || app.salary_max) && (
                  <span>
                    {app.salary_min ? `$${app.salary_min.toLocaleString()}` : ''}
                    {app.salary_min && app.salary_max ? ' – ' : ''}
                    {app.salary_max ? `$${app.salary_max.toLocaleString()}` : ''}
                  </span>
                )}
                {app.interviews.length > 0 && (
                  <span>{app.interviews.length} interview{app.interviews.length !== 1 ? 's' : ''}</span>
                )}
              </div>

              {app.notes && (
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginTop: 8,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {app.notes}
                </p>
              )}
            </div>

            {/* Right: actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  View ↗
                </a>
              )}
              <button
                onClick={() => setEditingId(app.id)}
                style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(app)}
                disabled={deletingId === app.id}
                style={{
                  fontSize: 12,
                  color: deletingId === app.id ? 'var(--text-muted)' : '#D1D5DB',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { if (deletingId !== app.id) e.currentTarget.style.color = '#DC2626' }}
                onMouseLeave={e => { if (deletingId !== app.id) e.currentTarget.style.color = '#D1D5DB' }}
              >
                {deletingId === app.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
