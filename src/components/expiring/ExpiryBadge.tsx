import { formatDistanceToExpiry } from '@/utils/expiry';

export default function ExpiryBadge({ expiryDate }: { expiryDate: number }) {
  const label = formatDistanceToExpiry(expiryDate);
  return <span className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-200">{label}</span>;
}
