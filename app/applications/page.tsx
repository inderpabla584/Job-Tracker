'use client'

import { useEffect, useState } from 'react'
import { fetchApplications, deleteApplication } from '@/lib/api'
import type { JobApplicationWithInterviews } from '@/lib/types'
import ApplicationForm from '@/components/ApplicationForm'
import ApplicationList from '@/components/ApplicationList'

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplicationWithInterviews[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      setApplications(await fetchApplications())
    } catch {
      setError('Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    await deleteApplication(id)
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  function handleAdded(app: JobApplicationWithInterviews) {
    setApplications(prev => [app, ...prev])
    setShowForm(false)
  }

  function handleUpdated(app: JobApplicationWithInterviews) {
    setApplications(prev => prev.map(a => a.id === app.id ? app : a))
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 52px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        Loading…
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Applications</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(v => !v)}
        >
          {showForm ? 'Cancel' : '+ New application'}
        </button>
      </div>

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

      {showForm && (
        <ApplicationForm onSuccess={handleAdded} onCancel={() => setShowForm(false)} />
      )}

      <ApplicationList applications={applications} onDelete={handleDelete} onUpdate={handleUpdated} />
    </div>
  )
}
