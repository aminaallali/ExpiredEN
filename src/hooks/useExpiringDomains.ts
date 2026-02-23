'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchExpiringRegistrations } from '@/lib/subgraph'
import { transformRegistration } from '@/utils/expiry'
import { ExpiryPhase, ExpiringDomain, PageCursor } from '@/types/ens'

interface UseExpiringDomainsOptions {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
  maxDaysLeft?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
  sortDirection?: 'asc' | 'desc'
}

interface ExpiringDomainsPage {
  domains: ExpiringDomain[]
  nextCursor: PageCursor | null
  hasMore: boolean
}

export function useExpiringDomains({
  phase,
  minLength,
  maxLength,
  maxDaysLeft,
  englishOnly,
  hideEmojiDomains,
  sortDirection = 'asc',
}: UseExpiringDomainsOptions) {
  return useInfiniteQuery<ExpiringDomainsPage, Error>({
    // Include ALL params in queryKey so cache invalidates on any change
    queryKey: [
      'expiring-domains',
      phase,
      minLength,
      maxLength,
      maxDaysLeft,
      englishOnly,
      hideEmojiDomains,
      sortDirection,
    ],

    queryFn: async ({ pageParam }): Promise<ExpiringDomainsPage> => {
      const cursor = pageParam as PageCursor | undefined

      const { registrations, nextCursor } =
        await fetchExpiringRegistrations({
          phase,
          cursor,
          minLength,
          maxLength,
          maxDaysLeft,
          englishOnly,
          hideEmojiDomains,
          sortDirection,
        })

      const domains: ExpiringDomain[] = registrations
        .map(transformRegistration)
        .filter((d): d is ExpiringDomain => d !== null)

      return {
        domains,
        nextCursor,
        hasMore: nextCursor !== null,
      }
    },

    initialPageParam: undefined as PageCursor | undefined,

    getNextPageParam: (lastPage): PageCursor | undefined =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,

    refetchInterval: 2 * 60 * 1000,
    refetchOnMount: true,
  })
}
