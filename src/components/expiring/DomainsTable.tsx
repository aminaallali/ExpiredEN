'use client'

import { useEffect, useRef } from 'react'
import { useExpiringDomains } from '@/hooks/useExpiringDomains'
import { ExpiryPhase } from '@/types/ens'
import DomainRow from './DomainRow'
import ExpiryBadge from './ExpiryBadge'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { formatExpiryDate } from '@/utils/expiry'
import { truncateAddress, ensAppUrl, etherscanUrl } from '@/utils/ens'

interface Props {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
  maxDaysLeft?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
  sortDirection?: 'asc' | 'desc'
}

const COLUMNS = [
  { label: 'Domain', className: 'min-w-[160px]' },
  { label: 'Length', className: 'min-w-[60px]' },
  { label: 'Type', className: 'min-w-[60px] hidden lg:table-cell' },
  { label: 'Expired', className: 'min-w-[100px] hidden md:table-cell' },
  { label: 'Status', className: 'min-w-[120px]' },
  { label: 'Owner', className: 'min-w-[120px] hidden lg:table-cell' },
  { label: 'Action', className: 'min-w-[80px]' },
]

export default function DomainsTable({
  phase,
  minLength,
  maxLength,
  maxDaysLeft,
  englishOnly,
  hideEmojiDomains,
  sortDirection = 'asc',
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useExpiringDomains({
    phase,
    minLength,
    maxLength,
    maxDaysLeft,
    englishOnly,
    hideEmojiDomains,
    sortDirection,
  })

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    const el = bottomRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
      observer.disconnect()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const domains = data?.pages.flatMap((p) => p.domains) ?? []

  if (isLoading) return <Spinner />
  if (isError) {
    return (
      <EmptyState
        title="Failed to load"
        description="Could not reach the ENS subgraph. Check your API key or try again."
      />
    )
  }
  if (!domains.length) {
    return (
      <EmptyState
        title="No domains found"
        description="No domains match your current filters. Try adjusting or clearing them."
      />
    )
  }

  return (
    <div>
      {/* Count */}
      <div className="rounded border border-terminal-border bg-terminal-surface/30 px-3 py-2 text-xs text-terminal-muted mb-3">
        Showing {domains.length.toLocaleString()} domains
        {hasNextPage && ' — scroll for more'}
      </div>

      {/* Mobile cards — visible below md */}
      <div className="space-y-2 md:hidden">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="rounded-lg border border-terminal-border bg-terminal-surface p-3 animate-in"
          >
            {/* Row 1: name + length */}
            <div className="flex items-start justify-between gap-2">
              <a
                href={ensAppUrl(domain.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-terminal-accent hover:underline break-all"
              >
                {domain.name}
              </a>
              <span className="text-xs text-terminal-muted shrink-0 bg-terminal-bg px-2 py-0.5 rounded">
                {domain.characterCount} chars
              </span>
            </div>

            {/* Row 2: badge + date */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ExpiryBadge domain={domain} />
              <span className="text-xs text-terminal-muted">
                Expired {formatExpiryDate(domain.expiryDate)}
              </span>
            </div>

            {/* Row 3: owner + action */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-terminal-border">
              <a
                href={etherscanUrl(domain.owner)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-terminal-muted hover:text-terminal-text transition-colors"
              >
                {truncateAddress(domain.owner)}
              </a>
              <a
                href={ensAppUrl(domain.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/10 transition-colors"
              >
                {domain.phase === 'available' ? 'Register' : 'View'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table — visible at md and above */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-terminal-border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-terminal-surface text-left text-xs text-terminal-muted uppercase tracking-wider">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.label}
                  className={`p-3 font-medium whitespace-nowrap ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {domains.map((domain, i) => (
              <DomainRow key={domain.id} domain={domain} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll trigger */}
      <div ref={bottomRef} className="py-8 flex justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && domains.length > 0 && (
          <p className="text-xs text-terminal-muted">All domains loaded</p>
        )}
      </div>
    </div>
  )
}
