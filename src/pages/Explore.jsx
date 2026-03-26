import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHATS_DATA, VENUES } from '../data/hardcoded'
import { HomeIconBtn } from '../components/BottomNav'
import Toast from '../components/Toast'

const DATE_FILTERS = ['Today', 'Tomorrow']
const TIME_FILTERS = ['Any time', 'After 5:00 PM', 'After 6:00 PM']
const DISTANCE_FILTERS = ['Within 1 km', 'Within 2 km', 'Within 5 km']
const CATEGORY_FILTERS = ['All event types', 'Sports', 'Events', 'Food', 'Drinks', 'Music', 'Cafe']
const BUDGET_FILTERS = ['All budgets', 'Low', 'Medium', 'High']

export default function Explore({ mode, groups, favoriteVenueIds, onToggleFavorite, onAttendVenue }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('Today')
  const [timeFilter, setTimeFilter] = useState('After 5:00 PM')
  const [distanceFilter, setDistanceFilter] = useState('Within 5 km')
  const [categoryFilter, setCategoryFilter] = useState('All event types')
  const [budgetFilter, setBudgetFilter] = useState('All budgets')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [attendingIds, setAttendingIds] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '')
  const [checkedAvailability, setCheckedAvailability] = useState(false)
  const [toast, setToast] = useState(null)
  const friendOptions = CHATS_DATA.filter(c => !c.isGroup)

  const filtered = useMemo(() => {
    return VENUES.filter(v => {
      if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== 'All event types' && normalizeCategory(v.category) !== categoryFilter) return false
      if (budgetFilter !== 'All budgets' && budgetFromTier(v.costTier) !== budgetFilter) return false
      if (!matchDate(v, dateFilter)) return false
      if (!matchTime(v, timeFilter)) return false
      if (!matchDistance(v, distanceFilter)) return false
      if (favoritesOnly && !favoriteVenueIds.includes(v.id)) return false
      return true
    })
  }, [search, categoryFilter, budgetFilter, dateFilter, timeFilter, distanceFilter, favoritesOnly, favoriteVenueIds])

  const handleConfirmAttendance = (venue) => {
    if (!attendingIds.includes(venue.id)) {
      setAttendingIds(prev => [...prev, venue.id])
      onAttendVenue(venue)
      setToast(`Attendance confirmed for ${venue.name}.`)
    } else {
      setToast(`You are already attending ${venue.name}.`)
    }
  }

  const handleCheckAvailability = () => {
    setCheckedAvailability(true)
    setToast('Availability checked. Group looks ready to invite.')
  }

  return (
    <div className="page">
      <div className="top-bar">
        <HomeIconBtn />
        <span className="top-bar-title">Explore</span>
        <button className="icon-btn" title="Open Chat" onClick={() => navigate('/chat')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input placeholder="Search activities or places" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="chips" style={{ paddingBottom: 8 }}>
        {DATE_FILTERS.map(d => (
          <button key={d} className={`chip ${dateFilter === d ? 'active' : ''}`} onClick={() => setDateFilter(d)}>{d}</button>
        ))}
      </div>

      <div className="chips" style={{ paddingTop: 0, paddingBottom: 8 }}>
        {TIME_FILTERS.map(t => (
          <button key={t} className={`chip ${timeFilter === t ? 'active' : ''}`} onClick={() => setTimeFilter(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 20px 8px' }}>
        <select className="form-input form-select" value={distanceFilter} onChange={e => setDistanceFilter(e.target.value)}>
          {DISTANCE_FILTERS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 20px 10px' }}>
        <select className="form-input form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {CATEGORY_FILTERS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="form-input form-select" value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}>
          {BUDGET_FILTERS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="chips" style={{ paddingTop: 0, paddingBottom: 12 }}>
        <button className={`chip ${favoritesOnly ? 'active' : ''}`} onClick={() => setFavoritesOnly(v => !v)}>
          Saved places only
        </button>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingTop: 8 }}>
          Ratings shown are from external venue data.
        </span>
      </div>

      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.3px' }}>
          MATCHING RESULTS ({filtered.length})
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
        {filtered.map(venue => {
          const isFavorite = favoriteVenueIds.includes(venue.id)
          const isAttending = attendingIds.includes(venue.id)
          return (
            <div key={venue.id} className="venue-card" onClick={() => setSelectedVenue(venue)}>
              <div className="venue-card-emoji">{venue.emoji}</div>
              <div className="venue-card-info">
                <div className="venue-card-name">
                  {venue.name}
                  {venue.verified && <span className="venue-verified">Verified</span>}
                </div>
                <div className="venue-card-meta">{venue.expected}</div>
                <div className="venue-card-row">
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rating {venue.rating}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{venue.distance}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{budgetFromTier(venue.costTier)} budget</span>
                </div>
                {isAttending && (
                  <div style={{ marginTop: 6, fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>
                    Attendance confirmed
                  </div>
                )}
              </div>

              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite(venue.id)
                }}
                title={isFavorite ? 'Remove from saved places' : 'Save place'}
                style={{ alignSelf: 'flex-start', marginTop: -2 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'var(--primary)' : 'none'} stroke={isFavorite ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state" style={{ marginTop: 20 }}>
          No activities match your filters. Try changing date, time, budget, or distance.
        </div>
      )}

      {selectedVenue && (
        <VenueModal
          venue={selectedVenue}
          mode={mode}
          groups={groups}
          friendOptions={friendOptions}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          checkedAvailability={checkedAvailability}
          onCheckAvailability={handleCheckAvailability}
          attending={attendingIds.includes(selectedVenue.id)}
          onConfirm={() => handleConfirmAttendance(selectedVenue)}
          onInviteFriend={(friendId) => navigate('/chat', {
            state: {
              friendId,
              inviteActivity: {
                id: selectedVenue.id,
                name: selectedVenue.name,
                date: selectedVenue.date,
                placeName: selectedVenue.placeName,
                address: selectedVenue.address,
                distance: selectedVenue.distance,
              },
            },
          })}
          onPlanWithGroup={() => navigate(selectedGroupId ? `/group/${selectedGroupId}` : '/groups')}
          onClose={() => {
            setSelectedVenue(null)
            setCheckedAvailability(false)
          }}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

function VenueModal({
  venue,
  mode,
  groups,
  friendOptions,
  selectedGroupId,
  setSelectedGroupId,
  checkedAvailability,
  onCheckAvailability,
  attending,
  onConfirm,
  onInviteFriend,
  onPlanWithGroup,
  onClose,
}) {
  const [selectedFriendId, setSelectedFriendId] = useState(friendOptions[0]?.id || '')
  const [showFriendPicker, setShowFriendPicker] = useState(false)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        <div style={{
          height: 140,
          background: 'linear-gradient(135deg, var(--primary-light), var(--accent)33)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          margin: '0 0 16px',
        }}>
          {venue.emoji}
        </div>

        <div style={{ padding: '0 24px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{venue.name}</h2>
            {venue.verified && <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>Verified</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{venue.expected}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Budget: {budgetFromTier(venue.costTier)} ({venue.costLabel})</div>
            <div style={{ fontSize: 13, color: 'var(--text)' }}>{venue.description}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Date/time: {venue.date}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Distance: {venue.distance}</div>
          </div>

          <button className={`btn btn-full ${attending ? 'btn-success' : 'btn-primary'}`} onClick={onConfirm}>
            {attending ? 'Attendance Confirmed' : 'Confirm Attendance'}
          </button>

          <div style={{ marginTop: 8, marginBottom: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            Want to go with someone else?
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <button className="btn btn-outline" onClick={() => setShowFriendPicker(v => !v)}>Invite 1 Friend</button>
            <button className="btn btn-outline" onClick={onPlanWithGroup}>Switch to Group Plan</button>
          </div>

          {showFriendPicker && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Choose a friend to invite</div>
              <select className="form-input form-select" value={selectedFriendId} onChange={e => setSelectedFriendId(e.target.value)} style={{ marginBottom: 8 }}>
                {friendOptions.map(friend => (
                  <option key={friend.id} value={friend.id}>{friend.name}</option>
                ))}
              </select>
              <button className="btn btn-primary btn-full" onClick={() => onInviteFriend(selectedFriendId)} disabled={!selectedFriendId}>
                Send Invite Message
              </button>
            </div>
          )}

          {mode === 'group' && (
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px',
              marginBottom: 8,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Plan with an existing group</div>
              <select className="form-input form-select" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} style={{ marginBottom: 8 }}>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <button className="btn btn-secondary btn-full" onClick={onCheckAvailability}>Check Availability</button>
              {checkedAvailability && (
                <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 8 }}>
                  Availability checked for this group. Ready to invite.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function budgetFromTier(tier) {
  if (tier === '$') return 'Low'
  if (tier === '$$') return 'Medium'
  return 'High'
}

function normalizeCategory(category) {
  return category === 'Café' ? 'Cafe' : category
}

function matchDate(venue, dateFilter) {
  const date = (venue.date || '').toLowerCase()
  if (dateFilter === 'Today') return date.includes('today')
  return !date.includes('today')
}

function matchTime(venue, timeFilter) {
  if (timeFilter === 'Any time') return true
  const hour = parseHour(venue.date)
  if (hour === null) return true
  if (timeFilter === 'After 5:00 PM') return hour >= 17
  if (timeFilter === 'After 6:00 PM') return hour >= 18
  return true
}

function parseHour(dateText) {
  if (!dateText) return null
  const match = dateText.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.m\.|p\.m\.|am|pm)/i)
  if (!match) return null
  let hour = Number(match[1])
  const suffix = match[3].toLowerCase()
  if (suffix.includes('p') && hour < 12) hour += 12
  if (suffix.includes('a') && hour === 12) hour = 0
  return hour
}

function matchDistance(venue, distanceFilter) {
  const dist = Number((venue.distance || '').replace(' km', ''))
  if (Number.isNaN(dist)) return true
  if (distanceFilter === 'Within 1 km') return dist <= 1
  if (distanceFilter === 'Within 2 km') return dist <= 2
  return dist <= 5
}
