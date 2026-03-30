import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import ModeSelect from './pages/ModeSelect'
import Home from './pages/Home'
import Groups from './pages/Groups'
import CreateGroup from './pages/CreateGroup'
import JoinGroup from './pages/JoinGroup'
import GroupDetail from './pages/GroupDetail'
import Explore from './pages/Explore'
import Chat from './pages/Chat'
import Rewards from './pages/Rewards'
import Profile from './pages/Profile'
import { CURRENT_USER, GROUPS } from './data/hardcoded'

export default function App() {
  const [user, setUser]     = useState(null)   // null = not logged in
  const [mode, setMode]     = useState(null)   // null = not chosen yet, 'solo' | 'group'
  const [groups, setGroups] = useState(GROUPS)
  const [favoriteVenueIds, setFavoriteVenueIds] = useState(['live-jazz'])
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [redeemedRewardIds, setRedeemedRewardIds] = useState([])

  // ── Not logged in → show Login ──────────────────────
  if (!user) {
    return (
      <div className="app-shell">
        <Login onLogin={(name) => setUser(name)} />
      </div>
    )
  }

  // ── Logged in but no mode chosen → show ModeSelect ──
  if (!mode) {
    return (
      <div className="app-shell">
        <ModeSelect userName={user} onSelect={(m) => setMode(m)} />
      </div>
    )
  }

  // ── Full app ─────────────────────────────────────────
  const handleCreateGroup = (g) => {
    setGroups(prev => [...prev, g])
    return g
  }
  const handleJoinGroup   = (g)    => setGroups(prev => prev.find(x => x.id === g.id) ? prev : [...prev, g])
  const handleUpdateGroup = (id,u) => setGroups(prev => prev.map(g => g.id === id ? { ...g, ...u } : g))
  const handleToggleFavorite = (venueId) => {
    setFavoriteVenueIds(prev => prev.includes(venueId)
      ? prev.filter(id => id !== venueId)
      : [...prev, venueId])
  }
  const handleAttendVenue = (venue) => {
    setAttendanceHistory(prev => [{
      id: `${venue.id}-${Date.now()}`,
      venueId: venue.id,
      venueName: venue.name,
      location: venue.placeName || 'Location not set',
      address: venue.address || 'Address not set',
      when: venue.date || 'Time not set',
      distance: venue.distance || 'Distance not set',
      category: venue.category,
      budgetLabel: venue.costLabel || 'Budget not set',
      budgetTier: venue.costTier || '-',
      rating: venue.rating || 'N/A',
      expected: venue.expected || 'Expected attendance not set',
      verified: !!venue.verified,
      description: venue.description || 'No description provided',
      mode,
    }, ...prev].slice(0, 12))
  }
  const handleRedeemReward = (rewardId) => {
    setRedeemedRewardIds(prev => prev.includes(rewardId) ? prev : [...prev, rewardId])
  }
  const handleRemoveActivity = (activityId) => {
    setAttendanceHistory(prev => prev.filter(item => item.id !== activityId))
  }

  const earnedPoints = attendanceHistory.length * 50
  const redeemedPoints = redeemedRewardIds.length * 300
  const totalPoints = Math.max(0, CURRENT_USER.points + earnedPoints - redeemedPoints)

  return (
    <div className="app-shell">
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Routes>
          <Route path="/" element={
            <Home
              groups={groups}
              userName={user}
              mode={mode}
              points={totalPoints}
              attendanceHistory={attendanceHistory}
              onRemoveActivity={handleRemoveActivity}
              onSwitchMode={setMode}
            />
          }/>
          <Route path="/groups"       element={<Groups groups={groups} mode={mode} />} />
          <Route path="/create-group" element={<CreateGroup onCreateGroup={handleCreateGroup} userName={user} />} />
          <Route path="/join-group"   element={<JoinGroup  onJoinGroup={handleJoinGroup} userName={user} />} />
          <Route path="/group/:id"    element={<GroupDetail groups={groups} onUpdateGroup={handleUpdateGroup} userName={user} />} />
          <Route path="/explore"      element={<Explore
            mode={mode}
            groups={groups}
            favoriteVenueIds={favoriteVenueIds}
            onToggleFavorite={handleToggleFavorite}
            onAttendVenue={handleAttendVenue}
            onUpdateGroup={handleUpdateGroup}
          />} />
          <Route path="/chat"         element={<Chat />} />
          <Route path="/rewards"      element={<Rewards
            points={totalPoints}
            earnedPoints={earnedPoints}
            attendanceCount={attendanceHistory.length}
            redeemedRewardIds={redeemedRewardIds}
            onRedeemReward={handleRedeemReward}
          />} />
          <Route path="/profile"      element={<Profile
            userName={user}
            mode={mode}
            points={totalPoints}
            redeemedCount={redeemedRewardIds.length}
            redeemedRewardIds={redeemedRewardIds}
            onLogout={() => { setUser(null); setMode(null) }}
          />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}
