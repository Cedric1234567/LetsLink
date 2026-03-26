export default function ModeSelect({ userName, onSelect }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '32px 24px', gap: 0,
    }}>
      {/* Greeting */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
        Hey, {userName}! 👋
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 40, lineHeight: 1.5 }}>
        How do you want to use LetsLink today?
      </div>

      {/* Solo card */}
      <button onClick={() => onSelect('solo')} style={{
        width: '100%', background: 'white', border: '2px solid var(--border)',
        borderRadius: 20, padding: '24px', marginBottom: 14,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        boxShadow: 'var(--shadow)',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>🚶</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
          Go Solo
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>
          Explore third spaces and events on your own. Discover what's nearby, attend events, and earn rewards.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['🗺 Explore', '🎟 Events', '🏆 Rewards', '💬 Chat'].map(t => (
            <span key={t} style={{ fontSize: 12, background: 'var(--tag-bg)', padding: '4px 10px', borderRadius: 100, color: 'var(--text-muted)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </button>

      {/* Group card */}
      <button onClick={() => onSelect('group')} style={{
        width: '100%', background: 'white', border: '2px solid var(--border)',
        borderRadius: 20, padding: '24px', marginBottom: 28,
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
        boxShadow: 'var(--shadow)',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, marginBottom: 6 }}>
          Go as a Group
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>
          Create or join groups, plan outings together, vote on venues, and coordinate meetups with friends.
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['👥 Groups', '🗺 Explore', '🗳 Vote', '💬 Chat', '🏆 Rewards'].map(t => (
            <span key={t} style={{ fontSize: 12, background: 'var(--primary-light)', padding: '4px 10px', borderRadius: 100, color: 'var(--primary)', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </button>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
        You can switch modes anytime from the dashboard.
      </div>
    </div>
  )
}
