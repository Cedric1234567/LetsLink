import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast'

export default function CreateGroup({ onCreateGroup }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [searchOrigin, setSearchOrigin] = useState('My current location')
  const [addMethod, setAddMethod] = useState('Share Link')
  const [memberRange, setMemberRange] = useState(6)
  const [costTier, setCostTier] = useState('Low')
  const [distance, setDistance] = useState('Distance')
  const [startWindow, setStartWindow] = useState('After 5:00 PM')
  const [toast, setToast] = useState(null)

  const handleCreate = () => {
    if (!name.trim()) { setToast('Please enter a group name'); return }
    const newGroup = {
      id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: name.trim(),
      upcoming: 'N/A',
      maxMembers: memberRange,
      currentMembers: 1,
      memberNames: ['Lihi'],
      memberEmojis: ['⭐'],
      availability: { Lihi: true, Josh: false, Jess: false },
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

      {/* Add members */}
      <div className="form-group">
        <label className="form-label">Add members:</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Share Link', 'Friends'].map(m => (
            <button key={m}
              className={`btn btn-sm ${addMethod === m ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setAddMethod(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Member range */}
      <div className="form-group">
        <label className="form-label">Number of Members: 3–{memberRange}</label>
        <input type="range" min="3" max="20" value={memberRange}
          onChange={e => setMemberRange(Number(e.target.value))}
          style={{ marginTop: 8 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          <span>3</span><span>20</span>
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
