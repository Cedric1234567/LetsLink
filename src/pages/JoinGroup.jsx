import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { INVITES } from '../data/hardcoded'
import Toast from '../components/Toast'

export default function JoinGroup({ onJoinGroup }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [invites, setInvites] = useState(INVITES)
  const [toast, setToast] = useState(null)
  const [distFilter, setDistFilter] = useState(false)
  const [intFilter, setIntFilter] = useState(false)

  const handleAccept = (invite) => {
    const newGroup = {
      id: invite.id,
      name: invite.name,
      upcoming: 'N/A',
      maxMembers: invite.max,
      currentMembers: invite.current + 1,
      memberNames: ['Lihi'],
      memberEmojis: ['⭐', '🎨', '🎵', '🌿'],
      availability: {},
      planBooked: null,
    }
    onJoinGroup(newGroup)
    setInvites(prev => prev.filter(i => i.id !== invite.id))
    setToast(`Joined "${invite.name}". You can plan right away.`)
    setTimeout(() => navigate(`/group/${invite.id}`), 900)
  }

  const handleDecline = (id) => {
    setInvites(prev => prev.filter(i => i.id !== id))
    setToast('Invite declined')
  }

  return (
    <div className="page" style={{ paddingBottom: 20 }}>
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => navigate('/groups')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <span className="top-bar-title">Join Group</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginTop: 16 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Find a group & request..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="chips" style={{ paddingTop: 4 }}>
        <button className={`chip ${distFilter ? 'active' : ''}`} onClick={() => setDistFilter(v => !v)}>
          Distance {distFilter ? '▲' : '▼'}
        </button>
        <button className={`chip ${intFilter ? 'active' : ''}`} onClick={() => setIntFilter(v => !v)}>
          Interests {intFilter ? '▲' : '▼'}
        </button>
      </div>

      {/* Invites */}
      {invites.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', padding: '8px 20px 10px', letterSpacing: '0.3px' }}>
            Invites:
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {invites.map(invite => (
              <div key={invite.id} style={{
                background: 'var(--card)',
                border: '2px solid var(--primary)',
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                boxShadow: 'var(--shadow)',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
                  {invite.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {invite.distance} • Invite pending your response
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={() => handleAccept(invite)}>
                      Accept
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDecline(invite.id)}>
                      Decline
                    </button>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {invite.current} of {invite.max} members currently in group
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {invites.length === 0 && (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="emoji">📭</div>
          <div>No pending invites.<br />Search above to find a public group!</div>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
