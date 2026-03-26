export default function Profile({ userName, mode, points, redeemedCount, onSwitchMode, onLogout }) {
  return (
    <div className="page">
      <div className="top-bar">
        <div style={{ width: 36 }} />
        <span className="top-bar-title">Profile</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '18px',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>SIGNED IN AS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{userName}</div>
        </div>

        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '18px',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>REWARDS BALANCE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{points} pts</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{redeemedCount} reward{redeemedCount === 1 ? '' : 's'} redeemed</div>
        </div>

        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '18px',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Planning mode</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            Keep one active mode so solo and group tasks stay clear.
          </div>
          <div style={{ display: 'inline-flex', background: 'var(--tag-bg)', borderRadius: 100, padding: 4 }}>
            {['solo', 'group'].map(m => (
              <button
                key={m}
                onClick={() => onSwitchMode(m)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 600,
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
              >
                {m === 'solo' ? 'Solo' : 'Group'}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--primary-light)',
          borderRadius: 14,
          padding: '14px 16px',
          marginBottom: 16,
          fontSize: 13,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
        }}>
          Tip: Use <strong>Explore</strong> for discovery, <strong>Groups</strong> for planning with friends, and <strong>Rewards</strong> to redeem points.
        </div>

        <button className="btn btn-outline btn-full" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
