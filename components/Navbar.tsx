'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/lib/theme'

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M10.61 10.61l1.06 1.06M2.93 12.07l1.06-1.06M10.61 4.39l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M12.5 9.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 7 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Navbar() {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="navbar">
      {/* Brand */}
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

      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
        Job Tracker
      </span>

      <div style={{ flex: 1 }} />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="btn btn-ghost"
        style={{ width: 36, padding: 0, color: 'var(--text-secondary)' }}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>

      <button className="btn btn-ghost" onClick={handleSignOut}>
        Sign out
      </button>
    </nav>
  )
}
