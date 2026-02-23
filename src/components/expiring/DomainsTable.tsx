'use client';

import { useState } from 'react';
import DomainRow from './DomainRow';
import PhaseFilters, { type PhaseValue } from './PhaseFilters';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { useExpiringDomains } from '@/hooks/useExpiringDomains';

export default function DomainsTable() {
  const [phase, setPhase] = useState<PhaseValue>('all');
  const { domains, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useExpiringDomains();

  const filtered = phase === 'all' ? domains : domains.filter((d) => d.phase === phase);

  if (isLoading) return <Spinner label="Loading domains..." />;
  if (!filtered.length) return <EmptyState title="No domains found" description="Try another filter." />;

  return (
    <div className="space-y-3">
      <PhaseFilters value={phase} onChange={setPhase} />
      <table className="w-full border-collapse overflow-hidden rounded border border-slate-800 text-sm">
        <thead className="bg-slate-900 text-left text-slate-300">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Phase</th>
            <th className="p-2">Expires</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((domain) => (
            <DomainRow key={domain.id} domain={domain} />
          ))}
        </tbody>
      </table>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} className="rounded bg-slate-800 px-3 py-2 text-sm" disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
