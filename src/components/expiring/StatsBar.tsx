'use client';

import { useExpiringDomains } from '@/hooks/useExpiringDomains';

export default function StatsBar() {
  const { domains } = useExpiringDomains();
  const grace = domains.filter((d) => d.phase === 'grace').length;
  const pending = domains.filter((d) => d.phase === 'pending').length;

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded bg-slate-900 p-3">Grace: {grace}</div>
      <div className="rounded bg-slate-900 p-3">Pending: {pending}</div>
    </div>
  );
}
