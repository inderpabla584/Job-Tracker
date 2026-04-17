'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/applications')
    }
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

        {/* Title */}
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Welcome back</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
          Sign in to your account to continue.
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

        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Email
            </label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '20px 0',
          }}
        >
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border)' }} />
        </div>

        <Link href="/signup" style={{ textDecoration: 'none' }}>
          <button type="button" className="btn btn-ghost" style={{ width: '100%' }}>
            Create an account
          </button>
        </Link>
      </div>
    </main>
  )
}
