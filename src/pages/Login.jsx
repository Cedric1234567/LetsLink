import { useState } from 'react'

// ── Ready-made credentials ──────────────────────────────
// Email:    demo@letslink.com
// Password: letslink123
// ───────────────────────────────────────────────────────

const DEMO = { email: 'demo@letslink.com', password: 'letslink123', name: 'Lihi' }

export default function Login({ onLogin }) {
  const [tab, setTab]         = useState('login')   // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setTimeout(() => {
      if (email.trim() === DEMO.email && password === DEMO.password) {
        onLogin(DEMO.name)
      } else {
        setError('Incorrect email or password. Try demo@letslink.com / letslink123')
        setLoading(false)
      }
    }, 700)
  }

  const handleSignup = () => {
    setError('')
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setTimeout(() => { onLogin(name || 'You') }, 700)
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', overflow: 'hidden',
    }}>
      {/* Hero top */}
      <div style={{
        flex: '0 0 220px',
        background: 'linear-gradient(160deg, var(--primary) 0%, #C04E18 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 10,
        borderRadius: '0 0 32px 32px',
      }}>
        <div style={{ fontSize: 52 }}>🔗</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'white' }}>
          LetsLink
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.5px' }}>
          Find your third space
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', margin: '24px 24px 0', background: 'var(--tag-bg)', borderRadius: 100, padding: 4 }}>
        {['login', 'signup'].map(t => (
          <button key={t} onClick={() => { setTab(t); setError('') }} style={{
            flex: 1, padding: '10px', borderRadius: 100, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: tab === t ? 'var(--shadow)' : 'none',
            transition: 'all 0.2s',
          }}>
            {t === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {tab === 'signup' && (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              YOUR NAME
            </label>
            <input className="form-input" placeholder="e.g. Lihi"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            EMAIL
          </label>
          <input className="form-input" type="email" placeholder="demo@letslink.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleSignup())} />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
            PASSWORD
          </label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleSignup())} />
        </div>

        {error && (
          <div style={{
            background: '#FFEEEE', border: '1px solid #FFCCCC',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, color: '#C0392B',
          }}>
            {error}
          </div>
        )}

        {tab === 'login' && (
          <div style={{
            background: 'var(--primary-light)', borderRadius: 10, padding: '10px 14px',
            fontSize: 12, color: 'var(--primary)', lineHeight: 1.5,
          }}>
            <strong>Demo account:</strong><br />
            demo@letslink.com / letslink123
          </div>
        )}

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 4, padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
          onClick={tab === 'login' ? handleLogin : handleSignup}
          disabled={loading}>
          {loading ? '...' : tab === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </div>
    </div>
  )
}
