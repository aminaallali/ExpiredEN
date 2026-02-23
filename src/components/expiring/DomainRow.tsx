import type { ExpiringDomain } from '@/types/ens'
import ExpiryBadge from './ExpiryBadge'

export default function DomainRow({ domain }: { domain: ExpiringDomain }) {
  return (
    <tr className="domain-row border-b border-terminal-border">
      <td className="p-3 text-terminal-text">{domain.name}</td>
      <td className="p-3 capitalize text-terminal-muted">{domain.phase}</td>
      <td className="p-3">
        <ExpiryBadge expiryDate={domain.expiryDate} />
      </td>
    </tr>
  )
}
