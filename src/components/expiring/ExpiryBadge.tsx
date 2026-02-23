import type { ExpiringDomain } from '@/types/ens'
import { getDaysInGrace } from '@/utils/expiry'

export default function ExpiryBadge({ domain }: { domain: ExpiringDomain }) {
  if (domain.phase === 'grace') {
    const days = getDaysInGrace(domain.expiryDate)
    return (
      <span className="inline-block text-xs px-2 py-0.5 rounded bg-terminal-grace/10 text-terminal-grace border border-terminal-grace/30 whitespace-nowrap">
        {days}d in grace
      </span>
    )
  }

  if (domain.phase === 'premium') {
    return (
      <span className="inline-block text-xs px-2 py-0.5 rounded bg-terminal-premium/10 text-terminal-premium border border-terminal-premium/30 whitespace-nowrap">
        {domain.daysUntilAvailable}d until free
      </span>
    )
  }

  return (
    <span className="inline-block text-xs px-2 py-0.5 rounded bg-terminal-available/10 text-terminal-available border border-terminal-available/30 whitespace-nowrap">
      Available now
    </span>
  )
}