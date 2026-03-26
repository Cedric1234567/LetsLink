import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Home({ groups, userName, mode, points, attendanceHistory, onRemoveActivity }) {
  const navigate = useNavigate()
  const isGroup = mode === 'group'
  const [expandedActivityId, setExpandedActivityId] = useState(null)

  return (
    <div className="page">
      {/* Top bar */}
      <div className="top-bar">
        <div style={{ fontSize: 22 }}>🔗</div>
        <span className="top-bar-title">LetsLink</span>
        <button className="icon-btn" onClick={() => navigate('/profile')} title="Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0114 0"/>
          </svg>
        </button>
      </div>

      {/* Greeting */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Good to see you 👋</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          Hey, {userName}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--primary-light)',
          borderRadius: 14,
          padding: '10px 12px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Current mode: <strong style={{ color: 'var(--text)' }}>{isGroup ? 'Group' : 'Solo'}</strong>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>
            Change in Profile
          </button>
        </div>
      </div>

      {/* Feature tiles */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Explore */}
        <Tile
          emoji="🗺"
          label="Explore"
          sub="Find nearby spaces & events"
          color="#FDF0E8"
          accent="#E8652A"
          onClick={() => navigate('/explore')}
          wide={false}
        />

        {/* Rewards */}
        <Tile
          emoji="🏆"
          label="Rewards"
          sub={`${points} pts · Level 1`}
          color="#FFF9E6"
          accent="#E5B830"
          onClick={() => navigate('/rewards')}
        />

        {/* Chat — full width */}
        <Tile
          emoji="💬"
          label="Chat"
          sub="5 conversations"
          color="#EEF4FF"
          accent="#5B7FD4"
          onClick={() => navigate('/chat')}
          wide
        />

        {/* Create / Join group — only in group mode */}
        {isGroup && (
          <>
            <Tile
              emoji="➕"
              label="Create Group"
              sub="Start a new outing"
              color="#FDF0E8"
              accent="#E8652A"
              onClick={() => navigate('/create-group')}
            />
            <Tile
              emoji="🚪"
              label="Join Group"
              sub="Accept invites"
              color="#F4EEFF"
              accent="#8B5CF6"
              onClick={() => navigate('/join-group')}
            />
          </>
        )}
      </div>

      {attendanceHistory.length > 0 && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Recent activity</div>
          {attendanceHistory.slice(0, 2).map(a => (
            <div key={a.id} style={{
              background: 'var(--card)',
              borderRadius: 12,
              padding: '12px 14px',
              boxShadow: 'var(--shadow)',
              marginBottom: 8,
              cursor: 'pointer',
            }} onClick={() => setExpandedActivityId(prev => prev === a.id ? null : a.id)}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {a.venueName} {a.verified ? '✓' : ''}
                </div>
                <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>Confirmed</span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                {a.when} - {a.mode === 'group' ? 'Group plan' : 'Solo plan'}
              </div>

              {expandedActivityId === a.id && (
                <>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {a.location} - {a.address}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {a.distance} - {a.category} - {a.budgetTier} ({a.budgetLabel})
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Rating {a.rating} - {a.expected}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.description}</div>

                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-outline btn-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveActivity(a.id)
                        setExpandedActivityId(prev => prev === a.id ? null : prev)
                      }}
                      style={{ color: '#C0392B', borderColor: '#F0C8C2', background: '#FFF7F6' }}
                    >
                      Not done yet? Remove activity
                    </button>
                  </div>
                </>
              )}

              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>
                {expandedActivityId === a.id ? 'Hide details' : 'Tap to view details'}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 8 }} />
    </div>
  )
}

function Tile({ emoji, label, sub, color, accent, onClick, wide }) {
  return (
    <button
      onClick={onClick}
      style={{
        gridColumn: wide ? 'span 2' : 'span 1',
        background: color,
        border: `1.5px solid ${accent}22`,
        borderRadius: 18,
        padding: '18px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s',
        boxShadow: 'var(--shadow)',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
    >
      <div style={{ fontSize: wide ? 28 : 32, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12, color: accent, fontWeight: 500 }}>{sub}</div>
    </button>
  )
}
