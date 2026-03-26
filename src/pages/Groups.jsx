import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeIconBtn } from '../components/BottomNav'

export default function Groups({ groups, mode }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="page">
      <div className="top-bar">
        <HomeIconBtn />
        <span className="top-bar-title">Groups</span>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button className="icon-btn" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
            onClick={() => setMenuOpen(v => !v)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="popup-menu" style={{ right: 0, top: '44px' }}>
              <button className="popup-item" onClick={() => { setMenuOpen(false); navigate('/create-group') }}>Create Group</button>
              <button className="popup-item" onClick={() => { setMenuOpen(false); navigate('/join-group') }}>Join Group</button>
              <button className="popup-item danger" onClick={() => setMenuOpen(false)}>Cancel ✕</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 8 }} />

      {mode !== 'group' && (
        <div style={{ margin: '0 20px 12px', background: 'var(--primary-light)', borderRadius: 14, padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          You are currently in Solo mode. You can still view groups, or switch mode in Profile before planning as a group.
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <div>No groups yet.<br />Create or join one to get started!</div>
        </div>
      ) : (
        groups.map(group => (
          <div key={group.id} className="group-card" onClick={() => navigate(`/group/${group.id}`)}>
            <div className="group-card-icon">{group.memberEmojis[0]}</div>
            <div className="group-card-info">
              <div className="group-card-name">{group.name}</div>
              <div className="group-card-meta">Upcoming: {group.upcoming}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button className="btn btn-primary btn-sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/group/${group.id}`) }}
                  style={{ fontSize: 12, padding: '6px 14px' }}>
                  View Group
                </button>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {group.currentMembers} of {group.maxMembers} members
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
