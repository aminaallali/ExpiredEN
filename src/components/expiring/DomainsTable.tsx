'use client'

import { useEffect, useRef } from 'react'
import { useExpiringDomains } from '@/hooks/useExpiringDomains'
import { ExpiryPhase } from '@/types/ens'
import DomainRow from './DomainRow'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'

interface Props {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
  maxDaysLeft?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
  sortDirection?: 'asc' | 'desc'
}

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
      <div className="rounded-full border border-brand-surface-light bg-brand-surface px-4 py-2 text-sm text-brand-muted mb-4 inline-flex">
        Showing {domains.length.toLocaleString()} domains{hasNextPage ? ' — scroll for more' : ''}
      </div>

      <div className="space-y-4">
        {domains.map((domain) => (
          <DomainRow key={domain.id} domain={domain} />
        ))}
      </div>

      <div ref={bottomRef} className="py-8 flex justify-center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && domains.length > 0 && (
          <p className="text-xs text-brand-muted">All domains loaded</p>
        )}
      </div>
    </div>
  )
}
