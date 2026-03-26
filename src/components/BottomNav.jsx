import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const NAV = [
    { path: '/',        label: 'Home',    Icon: HomeIcon },
    { path: '/explore', label: 'Explore', Icon: ExploreIcon },
    { path: '/groups',  label: 'Groups',  Icon: GroupsIcon },
    { path: '/rewards', label: 'Rewards', Icon: RewardsIcon },
  ]

  return (
    <nav style={{
      width: '100%', height: 'var(--nav-height)', background: 'white',
      borderTop: '1px solid var(--border)', display: 'flex',
      alignItems: 'center', justifyContent: 'space-around',
      flexShrink: 0, paddingBottom: '6px',
    }}>
      {NAV.map(({ path, label, Icon }) => {
        const active = path === '/groups'
          ? location.pathname === '/groups' || location.pathname.startsWith('/group/') || location.pathname === '/create-group' || location.pathname === '/join-group'
          : location.pathname === path
        return (
          <button key={path} onClick={() => navigate(path)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 10px', borderRadius: '10px',
            color: active ? 'var(--primary)' : 'var(--text-muted)',
            transition: 'all 0.18s', minWidth: 48,
          }}>
            <Icon active={active} />
            <span style={{ fontSize: '9px', fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 500 }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export function HomeIconBtn() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate('/')} className="icon-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </button>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'var(--primary)' : 'none'} stroke={active ? 'var(--primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function ExploreIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" fill={active ? 'var(--primary-light)' : 'none'}/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
function GroupsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'var(--primary-light)' : 'none'} stroke={active ? 'var(--primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function RewardsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--primary)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" fill={active ? 'var(--primary-light)' : 'none'} stroke={active ? 'var(--primary)' : 'currentColor'}/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  )
}
