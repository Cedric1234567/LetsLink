import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'
import { CHATS_DATA, CURRENT_USER } from '../data/hardcoded'

export default function CreateGroup({ onCreateGroup, userName }) {
  const navigate = useNavigate()
  const activeUserName = (userName || CURRENT_USER.name || 'You').trim()
  const [name, setName] = useState('')
  const [searchOrigin, setSearchOrigin] = useState('My current location')
  const [selectedFriendIds, setSelectedFriendIds] = useState([])
  const [costTier, setCostTier] = useState('Low')
  const [distance, setDistance] = useState('Distance')
  const [startWindow, setStartWindow] = useState('After 5:00 PM')
  const [toast, setToast] = useState(null)

  const friendOptions = CHATS_DATA.filter(chat => !chat.isGroup && chat.name.toLowerCase() !== activeUserName.toLowerCase())
  const selectedFriends = friendOptions.filter(friend => selectedFriendIds.includes(friend.id))
  const totalMembers = selectedFriendIds.length + 1

  const toggleFriend = (friendId) => {
    setSelectedFriendIds(prev => prev.includes(friendId)
      ? prev.filter(id => id !== friendId)
      : [...prev, friendId])
  }

  const handleCreate = () => {
    if (!name.trim()) { setToast('Please enter a group name'); return }

    const memberEntries = [{ name: activeUserName, emoji: '⭐' }, ...selectedFriends.map(friend => ({ name: friend.name, emoji: friend.emoji }))]
    const uniqueMemberEntries = memberEntries.filter((entry, index, arr) =>
      arr.findIndex(item => item.name.toLowerCase() === entry.name.toLowerCase()) === index
    )
    const memberNames = uniqueMemberEntries.map(entry => entry.name)
    const memberEmojis = uniqueMemberEntries.map(entry => entry.emoji)
    const availability = memberNames.reduce((acc, memberName, index) => {
      // Creator is available immediately; invited friends default to available in Friends mode.
      acc[memberName] = true
      return acc
    }, {})

    const currentMembers = memberNames.length
    const newGroup = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: name.trim(),
      upcoming: 'N/A',
      maxMembers: totalMembers,
      currentMembers,
      memberNames,
      memberEmojis,
      availability,
      planBooked: null,
      defaultStartWindow: startWindow,
      budget: costTier,
      searchOrigin,
    }
    const created = onCreateGroup(newGroup)
    setToast('Group created. Next: plan an activity.')
    setTimeout(() => navigate(`/group/${created.id}`), 850)
  }

  return (
    <div className="page" style={{ paddingBottom: 20 }}>
      {/* Top bar */}
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => navigate('/groups')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <span className="top-bar-title">Create Group</span>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ height: 16 }} />

      {/* Group Name */}
      <div className="form-group">
        <label className="form-label">Group Name</label>
        <input className="form-input" placeholder="Ex: Hometown Friends"
          value={name} onChange={e => setName(e.target.value)} />
      </div>

      {/* Search origin */}
      <div className="form-group">
        <label className="form-label">Find third spaces around</label>
        <input
          className="form-input"
          value={searchOrigin}
          onChange={e => setSearchOrigin(e.target.value)}
          placeholder="Enter an address or landmark"
        />
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
          Default is your location. You can replace it with any address or landmark.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Add friends by clicking their names</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {friendOptions.map(friend => {
            const selected = selectedFriendIds.includes(friend.id)
            return (
              <button
                key={friend.id}
                className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => toggleFriend(friend.id)}
              >
                {friend.emoji} {friend.name}
              </button>
            )
          })}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Group size updates automatically from your friend selection. Current group: {totalMembers}
        </div>
      </div>

      {/* Cost range */}
      <div className="form-group">
        <label className="form-label">Budget preference:</label>
        <div className="cost-row">
          {['Low', 'Medium', 'High'].map(c => (
            <button key={c} className={`cost-pill ${costTier === c ? 'active' : ''}`}
              onClick={() => setCostTier(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Ideal start window:</label>
        <select className="form-input form-select" value={startWindow} onChange={e => setStartWindow(e.target.value)}>
          <option>After 5:00 PM</option>
          <option>After 6:00 PM</option>
          <option>Tonight (7:00 PM - 10:00 PM)</option>
          <option>Tomorrow evening</option>
        </select>
      </div>

      {/* Distance */}
      <div className="form-group">
        <label className="form-label">Distance from Location:</label>
        <select className="form-input form-select"
          value={distance} onChange={e => setDistance(e.target.value)}>
          <option>Distance</option>
          <option>Under 1 km</option>
          <option>Under 2 km</option>
          <option>Under 5 km</option>
          <option>Any distance</option>
        </select>
      </div>

      {/* Create button */}
      <div style={{ padding: '8px 20px' }}>
        <button className="btn btn-primary btn-full" onClick={handleCreate}>
          Create and Plan
        </button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
