'use client'

import { useExpiringDomains } from '@/hooks/useExpiringDomains'
import { ExpiryPhase } from '@/types/ens'
import DomainRow from './DomainRow'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'

interface Props {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
}

export default function DomainsTable({ phase, minLength, maxLength }: Props) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExpiringDomains({ phase, minLength, maxLength })

  const domains = data?.pages.flatMap((p) => p.domains) ?? []

  if (isLoading) return <Spinner label="Loading domains..." />
  if (!domains.length) return <EmptyState title="No domains found" description="Try another phase or filter." />

  return (
    <div className="space-y-3">
      <table className="w-full border-collapse overflow-hidden rounded border border-terminal-border text-sm">
        <thead className="bg-terminal-surface text-left text-terminal-muted">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phase</th>
            <th className="p-3">Expires</th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <DomainRow key={domain.id} domain={domain} />
          ))}
        </tbody>
      </table>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="rounded border border-terminal-border bg-terminal-surface px-4 py-2 text-sm text-terminal-muted hover:text-terminal-text transition-colors"
        >
          {isFetchingNextPage ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
