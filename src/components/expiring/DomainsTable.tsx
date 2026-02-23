'use client'

import { useExpiringDomains } from '@/hooks/useExpiringDomains'
import { ExpiryPhase } from '@/types/ens'
import DomainRow from './DomainRow'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import ExpiryBadge from './ExpiryBadge'

interface Props {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
  expiresWithinDays?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
}

export default function DomainsTable({
  phase,
  minLength,
  maxLength,
  expiresWithinDays,
  englishOnly,
  hideEmojiDomains,
}: Props) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useExpiringDomains({
    phase,
    minLength,
    maxLength,
    expiresWithinDays,
    englishOnly,
    hideEmojiDomains,
  })

  const domains = data?.pages.flatMap((p) => p.domains) ?? []

  if (isLoading) return <Spinner label="Loading domains..." />
  if (!domains.length) return <EmptyState title="No domains found" description="Try another phase or filter." />

  return (
    <div className="space-y-3">
      <div className="rounded border border-terminal-border bg-terminal-surface/30 px-3 py-2 text-xs text-terminal-muted">
        Showing {domains.length} domains
      </div>

      <div className="space-y-2 md:hidden">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="rounded border border-terminal-border bg-terminal-surface p-3"
          >
            <div className="font-medium text-terminal-text break-all">{domain.name}</div>
            <div className="mt-1 text-xs capitalize text-terminal-muted">{domain.phase}</div>
            <div className="mt-2 text-xs">
              <ExpiryBadge expiryDate={domain.expiryDate} />
            </div>
          </div>
        ))}
      </div>

      <table className="hidden w-full border-collapse overflow-hidden rounded border border-terminal-border text-sm md:table">
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
