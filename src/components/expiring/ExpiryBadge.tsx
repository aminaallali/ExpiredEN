import { formatExpiryDate } from '@/utils/expiry'

export default function ExpiryBadge({ expiryDate }: { expiryDate: number }) {
  return (
    <span className="bg-brand-cream text-brand-dark px-3 py-1.5 rounded-full text-sm font-medium">
      {formatExpiryDate(expiryDate)}
    </span>
  )
}
