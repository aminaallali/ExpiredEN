import type { ExpiringDomain } from '@/types/ens'
import { truncateAddress, ensAppUrl, etherscanUrl } from '@/utils/ens'
import { formatExpiryDate, getDaysInGrace } from '@/utils/expiry'

interface Props {
  domain: ExpiringDomain
  index: number
}

export default function DomainRow({ domain, index }: Props) {
  const typeLabel = domain.hasEmoji ? '😀' : domain.hasNumbers ? '🔢' : '🔤'

  const badge = () => {
    if (domain.phase === 'grace') {
      const days = getDaysInGrace(domain.expiryDate)
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-terminal-grace/10 text-terminal-grace border border-terminal-grace/30">
          {days}d in grace
        </span>
      )
    }
    if (domain.phase === 'premium') {
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-terminal-premium/10 text-terminal-premium border border-terminal-premium/30">
          {domain.daysUntilAvailable}d until free
        </span>
      )
    }
    return (
      <span className="text-xs px-2 py-0.5 rounded bg-terminal-available/10 text-terminal-available border border-terminal-available/30">
        Available now
      </span>
    )
  }

  return (
    <tr
      className="domain-row border-b border-terminal-border animate-in"
      style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
    >
      {/* Domain name */}
      <td className="p-3">
        <a
          href={ensAppUrl(domain.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-accent hover:underline font-mono text-sm"
        >
          {domain.name}
        </a>
      </td>

      {/* Character count */}
      <td className="p-3 text-terminal-muted text-sm">
        {domain.characterCount}
      </td>

      {/* Type */}
      <td className="p-3 text-sm" title={domain.hasEmoji ? 'Emoji' : domain.hasNumbers ? 'Alphanumeric' : 'Letters'}>
        {typeLabel}
      </td>

      {/* Expiry date */}
      <td className="p-3 text-terminal-muted text-xs">
        {formatExpiryDate(domain.expiryDate)}
      </td>

      {/* Phase badge */}
      <td className="p-3">
        {badge()}
      </td>

      {/* Owner */}
      <td className="p-3">
        <a
          href={etherscanUrl(domain.owner)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-muted text-xs hover:text-terminal-text transition-colors font-mono"
        >
          {truncateAddress(domain.owner)}
        </a>
      </td>

      {/* Action */}
      <td className="p-3">
        <a
          href={ensAppUrl(domain.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/10 transition-colors"
        >
          {domain.phase === 'available' ? 'Register' : 'View'}
        </a>
      </td>
    </tr>
  )
}
