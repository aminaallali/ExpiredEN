'use client'

import { useEffect, useRef } from 'react'
import { useExpiringDomains } from '@/hooks/useExpiringDomains'
import { ExpiryPhase } from '@/types/ens'
import DomainRow from './DomainRow'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import { formatExpiryDate, getDaysInGrace } from '@/utils/expiry'
import { truncateAddress, ensAppUrl, etherscanUrl } from '@/utils/ens'

const COLUMNS = ['Domain', 'Length', 'Type', 'Expired', 'Status', 'Owner', 'Action']

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
    expiresWithinDays,
    englishOnly,
    hideEmojiDomains,
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
    if (bottomRef.current) observer.observe(bottomRef.current)
    return () => observer.disconnect()
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
      <div className="rounded border border-terminal-border bg-terminal-surface/30 px-3 py-2 text-xs text-terminal-muted mb-3">
        Showing {domains.length.toLocaleString()} domains
        {hasNextPage && ' (scroll for more)'}
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="rounded border border-terminal-border bg-terminal-surface p-3 animate-in"
          >
            <div className="flex items-start justify-between">
              <a
                href={ensAppUrl(domain.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-terminal-accent hover:underline break-all"
              >
                {domain.name}
              </a>
              <span className="text-xs text-terminal-muted ml-2 shrink-0">
                {domain.characterCount} chars
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {domain.phase === 'grace' && (
                <span className="text-xs px-2 py-0.5 rounded bg-terminal-grace/10 text-terminal-grace border border-terminal-grace/30">
                  {getDaysInGrace(domain.expiryDate)}d in grace
                </span>
              )}
              {domain.phase === 'premium' && (
                <span className="text-xs px-2 py-0.5 rounded bg-terminal-premium/10 text-terminal-premium border border-terminal-premium/30">
                  {domain.daysUntilAvailable}d until free
                </span>
              )}
              {domain.phase === 'available' && (
                <span className="text-xs px-2 py-0.5 rounded bg-terminal-available/10 text-terminal-available border border-terminal-available/30">
                  Available
                </span>
              )}
              <span className="text-xs text-terminal-muted">
                {formatExpiryDate(domain.expiryDate)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <a
                href={etherscanUrl(domain.owner)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-terminal-muted hover:text-terminal-text"
              >
                {truncateAddress(domain.owner)}
              </a>
              <a
                href={ensAppUrl(domain.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/10"
              >
                {domain.phase === 'available' ? 'Register' : 'View'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <table className="hidden w-full border-collapse overflow-hidden rounded border border-terminal-border text-sm md:table">
        <thead className="bg-terminal-surface text-left text-xs text-terminal-muted uppercase tracking-wider">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} className="p-3 font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map((domain, i) => (
            <DomainRow key={domain.id} domain={domain} index={i} />
          ))}
        </tbody>
      </table>

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
