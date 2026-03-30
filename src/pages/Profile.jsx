const REWARD_COUPONS = {
  coffee: {
    title: 'Free Coffee Voucher',
    code: 'LINK-COFFEE-300',
    usage: 'Show this code at participating cafes.',
  },
  'sports-pass': {
    title: 'Drop-in Sports Pass',
    code: 'LINK-SPORT-300',
    usage: 'Use this pass at the next eligible sports event.',
  },
  'friend-bonus': {
    title: 'Invite Bonus Pack',
    code: 'LINK-INVITE-300',
    usage: 'Apply when sending your next friend invite.',
  },
}

export default function Profile({ userName, mode, points, redeemedCount, redeemedRewardIds = [], onLogout }) {
  const redeemedCoupons = redeemedRewardIds
    .map(id => ({ id, ...(REWARD_COUPONS[id] || { title: id, code: 'N/A', usage: 'Coupon details unavailable.' }) }))

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

        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '16px',
          marginBottom: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 10 }}>My Coupons</div>
          {redeemedCoupons.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              No coupons yet. Redeem rewards to unlock usable coupon codes here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {redeemedCoupons.map(coupon => (
                <div key={coupon.id} style={{
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '10px 12px',
                  background: 'var(--surface)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{coupon.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>Ready to use</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#B42318', marginBottom: 4 }}>Code: <strong>{coupon.code}</strong></div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{coupon.usage}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-outline btn-full" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
