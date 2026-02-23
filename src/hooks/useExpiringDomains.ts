'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchSubgraph } from '@/lib/subgraph';
import type { Domain, DomainPhase } from '@/types/ens';

const QUERY = `
  query ExpiringDomains($first: Int!, $skip: Int!) {
    domains(first: $first, skip: $skip, orderBy: expiryDate, orderDirection: asc) {
      id
      name
      expiryDate
    }
  }
`;

type SubgraphResponse = {
  data: {
    domains: Array<{ id: string; name: string; expiryDate: string }>;
  };
};

const PAGE_SIZE = 20;

function toPhase(expiryDate: number): DomainPhase {
  const now = Math.floor(Date.now() / 1000);
  const graceWindow = 90 * 24 * 60 * 60;
  return expiryDate + graceWindow > now ? 'grace' : 'pending';
}

export function useExpiringDomains() {
  const query = useInfiniteQuery({
    queryKey: ['expiring-domains'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchSubgraph<SubgraphResponse>(QUERY, { first: PAGE_SIZE, skip: pageParam });
      const domains: Domain[] = result.data.domains.map((domain) => {
        const expiryDate = Number(domain.expiryDate);
        return {
          id: domain.id,
          name: domain.name,
          expiryDate,
          phase: toPhase(expiryDate),
        };
      });
      return {
        domains,
        nextCursor: domains.length === PAGE_SIZE ? pageParam + PAGE_SIZE : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return {
    ...query,
    domains: query.data?.pages.flatMap((page) => page.domains) ?? [],
  };
}
