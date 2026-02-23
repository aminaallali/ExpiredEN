export function formatDistanceToExpiry(expiryDate: number): string {
  const now = Date.now();
  const target = expiryDate * 1000;
  const diff = target - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d`;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}m`;
}
