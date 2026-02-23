import { formatExpiryDate } from '@/utils/expiry'

export default function ExpiryBadge({ expiryDate }: { expiryDate: number }) {
  return (
    <span className="rounded bg-terminal-surface px-2 py-1 text-xs text-terminal-muted">
      {formatExpiryDate(expiryDate)}
    </span>
  )
}
