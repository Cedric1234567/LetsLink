import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CURRENT_USER, VENUES } from '../data/hardcoded'
import Toast from '../components/Toast'

const DATE_OPTIONS = ['Today', 'Tomorrow']
const TIME_WINDOWS = ['After 5:00 PM', 'After 6:00 PM', '7:00 PM - 9:00 PM']
const BUDGET_OPTIONS = ['Any', 'Low', 'Medium', 'High']
const CATEGORY_OPTIONS = ['Any', 'Sports', 'Events', 'Food', 'Drinks', 'Music', 'Cafe']

export default function GroupDetail({ groups, onUpdateGroup, userName }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const group = groups.find(g => g.id === id)
  const [step, setStep] = useState('overview')
  const [toast, setToast] = useState(null)

  const [dateFilter, setDateFilter] = useState('Today')
  const [timeFilter, setTimeFilter] = useState('After 5:00 PM')
  const [budgetFilter, setBudgetFilter] = useState('Any')
  const [categoryFilter, setCategoryFilter] = useState('Any')
  const activeUserName = (userName || CURRENT_USER.name || 'You').trim()

  const allMembers = useMemo(() => {
    if (!group) return []
    if (Array.isArray(group.memberNames) && group.memberNames.length > 0) {
      return group.memberNames
    }
    return Object.keys(group.availability || {})
  }, [group])

  const [memberResponses, setMemberResponses] = useState(() => {
    const seed = {}
    if (!group) return seed
    const names = Array.isArray(group.memberNames) && group.memberNames.length > 0
      ? group.memberNames
      : Object.keys(group.availability || {})
    names.forEach((name) => {
      const isAvailable = !!group.availability?.[name]
      seed[name] = name.toLowerCase() === activeUserName.toLowerCase()
        ? 'pending'
        : (isAvailable ? 'accepted' : 'pending')
    })
    return seed
  })

  const [selectedVenueId, setSelectedVenueId] = useState(null)
  const [myVotedVenueId, setMyVotedVenueId] = useState(null)

  if (!group) {
    return (
      <div className="page">
        <div className="top-bar">
          <button className="top-bar-back" onClick={() => navigate('/groups')}>Groups</button>
          <span className="top-bar-title">Group</span>
          <div />
        </div>
        <div className="empty-state">Group not found.</div>
      </div>
    )
  }

  const availabilityEntries = allMembers.map(name => [name, !!group.availability?.[name]])
  const available = availabilityEntries.filter(([, v]) => !!v).length
  const hasPlannedActivity = !!group.planBooked

  const venueSuggestions = VENUES.filter(v => {
    const venueCategory = v.category === 'Café' ? 'Cafe' : v.category
    if (categoryFilter !== 'Any' && venueCategory !== categoryFilter) return false
    if (budgetFilter === 'Low' && v.costTier !== '$') return false
    if (budgetFilter === 'Medium' && v.costTier !== '$$') return false
    if (budgetFilter === 'High' && v.costTier !== '$$$') return false
    return true
  }).slice(0, 4)

  const accepted = Object.entries(memberResponses).filter(([, r]) => r === 'accepted').map(([name]) => name)
  const declined = Object.entries(memberResponses).filter(([, r]) => r === 'declined').map(([name]) => name)
  const pending = Object.entries(memberResponses).filter(([, r]) => r === 'pending').map(([name]) => name)
  const respondedCount = accepted.length + declined.length

  const selectedVenue = venueSuggestions.find(v => v.id === selectedVenueId) || venueSuggestions[0]

  const myMemberName = allMembers.find(name => name.toLowerCase() === activeUserName.toLowerCase())
    || (allMembers.includes('You') ? 'You' : allMembers[0])

  const votesByVenue = useMemo(() => {
    const counts = {}
    venueSuggestions.forEach(v => { counts[v.id] = 0 })
    if (venueSuggestions.length === 0) return counts

    const stableIndexFromName = (name, len) => {
      const total = Array.from(name).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
      return total % len
    }

    allMembers.forEach((memberName) => {
      if (memberResponses[memberName] !== 'accepted') return

      if (memberName === myMemberName) {
        if (myVotedVenueId && counts[myVotedVenueId] !== undefined) counts[myVotedVenueId] += 1
        return
      }

      const idx = stableIndexFromName(memberName, venueSuggestions.length)
      const autoVoteVenueId = venueSuggestions[idx].id
      counts[autoVoteVenueId] += 1
    })

    return counts
  }, [allMembers, memberResponses, myMemberName, myVotedVenueId, venueSuggestions])

  const markMyVote = (response) => {
    if (!myMemberName) return

    if (response === 'accepted') {
      if (!selectedVenueId) {
        setToast('Select an event option first, then tap Accept Option.')
        return
      }
      setMyVotedVenueId(selectedVenueId)
      setMemberResponses(prev => ({ ...prev, [myMemberName]: 'accepted' }))
      return
    }

    setMyVotedVenueId(null)
    setMemberResponses(prev => ({ ...prev, [myMemberName]: 'declined' }))
  }

  const finalizeDecision = () => {
    if (!selectedVenue) return
    const updatedUpcoming = `${dateFilter} - ${timeFilter}`
    onUpdateGroup(group.id, {
      upcoming: updatedUpcoming,
      planBooked: { ...selectedVenue, date: updatedUpcoming },
    })
    setToast('Group plan confirmed and saved.')
    setStep('result')
  }

  return (
    <div className="page">
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => (step === 'overview' ? navigate('/groups') : setStep('overview'))}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {step === 'overview' ? 'Groups' : 'Overview'}
        </button>
        <span className="top-bar-title">{group.name}</span>
        <button className="icon-btn" onClick={() => navigate('/chat')} title="Open group chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      {step === 'overview' && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: '16px',
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Upcoming group plan</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              {group.planBooked ? `${group.planBooked.name} - ${group.upcoming}` : 'No plan confirmed yet'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Availability so far: {available} of {availabilityEntries.length} members marked available
            </div>
          </div>

          <div style={{
            background: 'var(--primary-light)',
            borderRadius: 14,
            padding: '12px 14px',
            marginBottom: 14,
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}>
            Lightweight schedule board: use <strong>Check Availability</strong> first, then <strong>Plan Activity</strong> to vote and confirm.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <button
              className={`btn ${hasPlannedActivity ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => !hasPlannedActivity && setStep('preferences')}
              disabled={hasPlannedActivity}
              title={hasPlannedActivity ? 'This group already has a planned activity.' : 'Start planning an activity'}
            >
              {hasPlannedActivity ? 'Activity Planned' : 'Plan Activity'}
            </button>
            <button className="btn btn-secondary" onClick={() => setStep('availability')}>Check Availability</button>
          </div>

          {hasPlannedActivity && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
              This group already has a confirmed activity. Create a new group if you want to plan another one.
            </div>
          )}

          <button className="btn btn-outline btn-full" onClick={() => navigate('/chat')}>
            Invite Group in Chat
          </button>
        </div>
      )}

      {step === 'availability' && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Availability</div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {DATE_OPTIONS.map(d => (
              <button key={d} className={`chip ${dateFilter === d ? 'active' : ''}`} onClick={() => setDateFilter(d)}>{d}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {TIME_WINDOWS.map(t => (
              <button key={t} className={`chip ${timeFilter === t ? 'active' : ''}`} onClick={() => setTimeFilter(t)}>{t}</button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>
            {available} of {availabilityEntries.length} members are available for {dateFilter} {timeFilter}.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {availabilityEntries.map(([name, ok], idx) => (
              <div key={name} style={{
                background: 'var(--card)',
                borderRadius: 12,
                boxShadow: 'var(--shadow)',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: 16 }}>{group.memberEmojis[idx] || 'U'}</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: ok ? 'var(--success)' : 'var(--text-muted)' }}>
                  {ok ? 'Available' : 'Not available yet'}
                </span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-full" onClick={() => setStep('preferences')}>
            Continue to Planning
          </button>
        </div>
      )}

      {step === 'preferences' && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>Planning filters</div>

          <div style={{ marginBottom: 12 }}>
            <div className="form-label">Date</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DATE_OPTIONS.map(d => (
                <button key={d} className={`chip ${dateFilter === d ? 'active' : ''}`} onClick={() => setDateFilter(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="form-label">Time</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIME_WINDOWS.map(t => (
                <button key={t} className={`chip ${timeFilter === t ? 'active' : ''}`} onClick={() => setTimeFilter(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="form-label">Category</div>
            <select className="form-input form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div className="form-label">Budget</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BUDGET_OPTIONS.map(b => (
                <button key={b} className={`cost-pill ${budgetFilter === b ? 'active' : ''}`} onClick={() => setBudgetFilter(b)}>{b}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-full" onClick={() => setStep('voting')}>
            Find and Vote on Activities
          </button>
        </div>
      )}

      {step === 'voting' && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Group voting</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
            {respondedCount} of {allMembers.length} members responded
          </div>

          <div style={{
            background: 'var(--card)',
            borderRadius: 12,
            boxShadow: 'var(--shadow)',
            padding: '12px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Response status</div>
            <div style={{ fontSize: 12, marginBottom: 4 }}><strong>{accepted.length}</strong> accepted: {accepted.join(', ') || 'None yet'}</div>
            <div style={{ fontSize: 12, marginBottom: 4 }}><strong>{declined.length}</strong> declined: {declined.join(', ') || 'None yet'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}><strong>{pending.length}</strong> not responded: {pending.join(', ') || 'None'}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {venueSuggestions.map(v => {
              const isSelected = selectedVenueId === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVenueId(v.id)}
                  style={{
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--primary-light)' : 'var(--card)',
                    borderRadius: 12,
                    padding: '12px',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>{v.emoji} {v.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.distance}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{v.category} - {v.costLabel}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{votesByVenue[v.id] || 0} of {allMembers.length} members voted for this option</div>
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn btn-success btn-full" onClick={() => markMyVote('accepted')}>Accept Option</button>
            <button className="btn btn-outline btn-full" onClick={() => markMyVote('declined')}>Decline Option</button>
          </div>

          <button className="btn btn-primary btn-full" disabled={!selectedVenue} onClick={finalizeDecision}>
            Confirm Group Decision
          </button>
        </div>
      )}

      {step === 'result' && selectedVenue && (
        <div style={{ padding: '18px 20px 20px' }}>
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            padding: '16px',
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Decision confirmed</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
              {selectedVenue.name} was selected for {dateFilter} {timeFilter}.
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {accepted.length} accepted - {declined.length} declined - {pending.length} pending
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => navigate('/groups')}>Back to Groups</button>
            <button className="btn btn-secondary" onClick={() => navigate('/chat')}>Invite Group</button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
