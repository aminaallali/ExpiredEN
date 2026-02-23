import type { ExpiringDomain } from '@/types/ens'
import { formatExpiryDate } from '@/utils/expiry'

type Props =
  | { expiryDate: number; domain?: never }
  | { domain: ExpiringDomain; expiryDate?: never }

export default function ExpiryBadge(props: Props) {
  const expiryDate = props.domain ? props.domain.expiryDate : props.expiryDate

  return (
    <span className="bg-brand-cream text-brand-dark px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
      {formatExpiryDate(expiryDate)}
    </span>
  )
}
