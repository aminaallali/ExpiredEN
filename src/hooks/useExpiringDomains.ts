'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchExpiringRegistrations } from '@/lib/subgraph'
import { transformRegistration } from '@/utils/expiry'
import { ExpiryPhase, ExpiringDomain, PageCursor } from '@/types/ens'

interface UseExpiringDomainsOptions {
  phase: ExpiryPhase
  minLength?: number
  maxLength?: number
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
}: UseExpiringDomainsOptions) {
  return useInfiniteQuery<ExpiringDomainsPage, Error>({
    queryKey: ['expiring-domains', phase, minLength, maxLength],

    queryFn: async ({ pageParam }): Promise<ExpiringDomainsPage> => {
      const cursor = pageParam as PageCursor | undefined

      const { registrations, nextCursor } = await fetchExpiringRegistrations({
        phase,
        cursor,
        minLength,
        maxLength,
      })

      // Transform raw registrations into UI-ready domains
      // Filter out any that have no readable name
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

    // Refetch every 2 minutes in background to keep data fresh
    refetchInterval: 2 * 60 * 1000,

    // Don't refetch all pages — only the first one on background refresh
    refetchOnMount: true,
  })
}
