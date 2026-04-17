'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName.trim() || undefined },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: 5,
    display: 'block',
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: '24px',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 360 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div className="brand-icon">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M4.5 3.5V2.75A1.25 1.25 0 0 1 5.75 1.5h3.5A1.25 1.25 0 0 1 10.5 2.75V3.5M1.5 5.5h12M2.75 3.5h9.5A1.25 1.25 0 0 1 13.5 4.75v7.5A1.25 1.25 0 0 1 12.25 13.5H2.75A1.25 1.25 0 0 1 1.5 12.25v-7.5A1.25 1.25 0 0 1 2.75 3.5z"
                stroke="white"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Job Tracker</span>
        </div>

        {success ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#F0FDF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l4 4 8-8" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Check your email</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                marginTop: 20,
                fontSize: 13,
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Create an account</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Start tracking your job applications.
            </p>

            {error && (
              <div
                style={{
                  fontSize: 13,
                  color: '#DC2626',
                  background: '#FEF2F2',
                  border: '0.5px solid #FECACA',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 16,
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.fullName}
                  onChange={e => set('fullName', e.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Email <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Password <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Confirm password <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  required
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', marginTop: 8 }}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
            </div>

            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button type="button" className="btn btn-ghost" style={{ width: '100%' }}>
                Sign in to existing account
              </button>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
