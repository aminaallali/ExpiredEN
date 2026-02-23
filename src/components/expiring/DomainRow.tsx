import type { ExpiringDomain } from '@/types/ens'
import ExpiryBadge from './ExpiryBadge'
import { truncateAddress, ensAppUrl, etherscanUrl } from '@/utils/ens'
import { formatExpiryDate } from '@/utils/expiry'

interface Props {
  domain: ExpiringDomain
  index: number
}

export default function DomainRow({ domain, index }: Props) {
  const typeLabel = domain.hasEmoji
    ? '😀'
    : domain.hasNumbers
    ? '🔢'
    : '🔤'

  const typeTitle = domain.hasEmoji
    ? 'Contains emoji'
    : domain.hasNumbers
    ? 'Contains numbers'
    : 'Letters only'

  return (
    <tr
      className="domain-row border-b border-terminal-border last:border-0 animate-in"
      style={{ animationDelay: `${Math.min(index * 20, 300)}ms` }}
    >
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

      <td className="p-3 text-terminal-muted text-sm">
        {domain.characterCount}
      </td>

      <td className="p-3 text-sm hidden lg:table-cell" title={typeTitle}>
        {typeLabel}
      </td>

      <td className="p-3 text-terminal-muted text-xs whitespace-nowrap hidden md:table-cell">
        {formatExpiryDate(domain.expiryDate)}
      </td>

      <td className="p-3">
        <ExpiryBadge domain={domain} />
      </td>

      <td className="p-3 hidden lg:table-cell">
        <a
          href={etherscanUrl(domain.owner)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-muted text-xs hover:text-terminal-text transition-colors font-mono"
        >
          {truncateAddress(domain.owner)}
        </a>
      </td>

      <td className="p-3">
        <a
          href={ensAppUrl(domain.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/10 transition-colors whitespace-nowrap"
        >
          {domain.phase === 'available' ? 'Register' : 'View'}
        </a>
      </td>
    </tr>
  )
}