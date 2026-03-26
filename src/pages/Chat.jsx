import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CHATS_DATA } from '../data/hardcoded'
import { HomeIconBtn } from '../components/BottomNav'

export default function Chat() {
  const navigate = useNavigate()
  const location = useLocation()
  const [openChat, setOpenChat] = useState(null)
  const [chats, setChats] = useState(CHATS_DATA)
  const [newMsg, setNewMsg] = useState('')

  useEffect(() => {
    const invite = location.state?.inviteActivity
    const selectedFriendId = location.state?.friendId
    if (!invite) return

    const targetId = pickDirectChatId(chats, selectedFriendId)
    if (!targetId) return

    const inviteText = buildInviteMessage(invite)
    const inviteMessage = {
      id: `invite-${invite.id}-${Date.now()}`,
      from: 'Me',
      text: inviteText,
      time: 'Now',
      mine: true,
      type: 'invite',
      inviteStatus: 'pending',
      activityName: invite.name,
    }

    setChats(prev => prev.map(c => {
      if (c.id !== targetId) return c
      const last = c.messages[c.messages.length - 1]
      const alreadySent = last?.mine && last?.text === inviteText
      if (alreadySent) return c
      return {
        ...c,
        lastMessage: `You: ${inviteText}`,
        time: 'Now',
        messages: [...c.messages, inviteMessage],
      }
    }))

    setOpenChat(prev => {
      const targetChat = chats.find(c => c.id === targetId)
      if (!targetChat) return prev
      const last = targetChat.messages[targetChat.messages.length - 1]
      const alreadySent = last?.mine && last?.text === inviteText
      if (alreadySent) return targetChat
      return {
        ...targetChat,
        messages: [...targetChat.messages, inviteMessage],
      }
    })

    navigate('/chat', { replace: true, state: null })
  }, [location.state, chats, navigate])

  const sendMessage = () => {
    if (!newMsg.trim()) return
    const text = newMsg.trim()
    setChats(prev => prev.map(c =>
      c.id === openChat.id
        ? { ...c, lastMessage: 'You: ' + text, messages: [...c.messages, { from: 'Me', text, time: 'Now', mine: true }] }
        : c
    ))
    setOpenChat(prev => ({
      ...prev,
      messages: [...prev.messages, { from: 'Me', text, time: 'Now', mine: true }]
    }))
    setNewMsg('')
  }

  if (openChat) {
    const live = chats.find(c => c.id === openChat.id) || openChat
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--bg)' }}>
        {/* Chat header */}
        <div className="top-bar">
          <button className="top-bar-back" onClick={() => setOpenChat(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Chat
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: live.isGroup ? 'var(--primary-light)' : 'var(--tag-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {live.emoji}
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{live.name}</span>
          </div>
          <button className="icon-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg)' }}>
          {live.messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.mine ? 'flex-end' : 'flex-start', gap: 2 }}>
              {!msg.mine && live.isGroup && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 4 }}>{msg.from}</span>
              )}
              <div className={`chat-bubble ${msg.mine ? 'mine' : 'theirs'}`}>{msg.text}</div>
              {msg.type === 'invite' && msg.mine && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Invite status: Pending</span>
                </div>
              )}
              <span style={{ fontSize: 10, color: 'var(--text-muted)', paddingLeft: 4 }}>{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <input
            style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 100, padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: 'var(--bg)' }}
            placeholder="Message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="top-bar">
        <HomeIconBtn />
        <span className="top-bar-title">Chat</span>
        <button className="icon-btn" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search" />
      </div>

      {/* Chat list */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {chats.map(chat => (
          <button key={chat.id}
            onClick={() => setOpenChat(chat)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid var(--border)', textAlign: 'left', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--tag-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>

            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: chat.isGroup ? '14px' : '50%',
              background: chat.isGroup ? 'var(--primary-light)' : 'var(--tag-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>{chat.emoji}</div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
                  {chat.name}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{chat.time}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.lastMessage}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function pickDirectChatId(chats, preferredId) {
  if (preferredId) {
    const preferredMatch = chats.find(c => c.id === preferredId && !c.isGroup)
    if (preferredMatch) return preferredMatch.id
  }
  const preferred = ['cedric', 'josh', 'erik']
  for (const id of preferred) {
    const match = chats.find(c => c.id === id && !c.isGroup)
    if (match) return match.id
  }
  const fallback = chats.find(c => !c.isGroup)
  return fallback?.id || null
}

function buildInviteMessage(activity) {
  const where = activity.placeName || activity.address || 'nearby'
  return `Want to join ${activity.name} at ${where} (${activity.date})?`
}
