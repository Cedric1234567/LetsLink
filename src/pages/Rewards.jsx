import { CURRENT_USER } from '../data/hardcoded'
import { HomeIconBtn } from '../components/BottomNav'
import Toast from '../components/Toast'
import { useState } from 'react'

const REWARDS = [
  { id: 'coffee', title: 'Free Coffee Voucher', cost: 300, detail: 'Redeem at participating cafes.' },
  { id: 'sports-pass', title: 'Drop-in Sports Pass', cost: 300, detail: 'One free active event entry.' },
  { id: 'friend-bonus', title: 'Invite Bonus Pack', cost: 300, detail: 'Extra points on your next invite.' },
]

export default function Rewards({ points, earnedPoints, attendanceCount, redeemedRewardIds, onRedeemReward }) {
  const [toast, setToast] = useState(null)
  const pct = Math.min(100, Math.round((points / CURRENT_USER.nextLevelPoints) * 100))

  const handleRedeem = (reward) => {
    if (redeemedRewardIds.includes(reward.id)) {
      setToast('Reward already redeemed.')
      return
    }
    if (points < reward.cost) {
      setToast(`Need ${reward.cost - points} more points to redeem.`)
      return
    }
    onRedeemReward(reward.id)
    setToast(`${reward.title} redeemed.`)
  }

  return (
    <div className="page">
      <div className="top-bar">
        <HomeIconBtn />
        <span className="top-bar-title">Rewards</span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '16px',
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>AVAILABLE POINTS</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 6 }}>
            {points.toLocaleString()} pts
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>
            +{earnedPoints} earned from {attendanceCount} confirmed activities
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
            Progress to next level: {points}/{CURRENT_USER.nextLevelPoints}
          </div>
        </div>

        <div style={{
          background: 'var(--primary-light)',
          borderRadius: 12,
          padding: '12px 14px',
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: 14,
        }}>
          Redemption flow: confirm activities in Explore, earn points, then redeem below.
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          Redeem rewards
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {REWARDS.map(reward => {
            const redeemed = redeemedRewardIds.includes(reward.id)
            const canRedeem = points >= reward.cost && !redeemed
            return (
              <div key={reward.id} style={{
                background: 'var(--card)',
                borderRadius: 12,
                boxShadow: 'var(--shadow)',
                padding: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{reward.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{reward.cost} pts</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{reward.detail}</div>
                <button
                  className={`btn btn-sm ${redeemed ? 'btn-secondary' : canRedeem ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleRedeem(reward)}
                >
                  {redeemed ? 'Redeemed' : canRedeem ? 'Redeem Now' : 'Not enough points'}
                </button>
              </div>
            )
          })}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          How to earn points
        </div>
        {[
          { label: 'Confirm attendance for an activity', pts: '+50 pts' },
          { label: 'Join a new group', pts: '+30 pts' },
          { label: 'Plan a group outing', pts: '+100 pts' },
          { label: 'Invite one friend', pts: '+20 pts' },
        ].map(({ label, pts }) => (
          <div key={label} style={{
            background: 'var(--card)',
            borderRadius: 12,
            padding: '12px 14px',
            boxShadow: 'var(--shadow)',
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 13 }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{pts}</span>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
