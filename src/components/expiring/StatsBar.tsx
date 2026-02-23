'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchPhaseCounts } from '@/lib/subgraph'
import { ExpiryPhase } from '@/types/ens'

interface Props {
  activePhase: ExpiryPhase
}

const STATS: { label: string; phase: ExpiryPhase; color: string }[] = [
  { label: 'Grace Period',     phase: 'grace',     color: 'text-terminal-grace' },
  { label: 'Premium Auction',  phase: 'premium',   color: 'text-terminal-premium' },
  { label: 'Available',        phase: 'available', color: 'text-terminal-available' },
]

export function StatsBar({ activePhase }: Props) {
  const { data } = useQuery({
    queryKey: ['phase-counts'],
    queryFn: fetchPhaseCounts,
    staleTime: 60 * 1000,
  })

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {STATS.map((stat) => (
        <div
          key={stat.phase}
          className={`rounded-lg border p-4 transition-colors ${
            activePhase === stat.phase
              ? 'border-terminal-accent bg-terminal-surface'
              : 'border-terminal-border bg-terminal-surface/50'
          }`}
        >
          <div className="text-xs text-terminal-muted mb-1">{stat.label}</div>
          <div className={`text-2xl font-bold font-display ${stat.color}`}>
            {data === undefined
              ? '—'
              : data[stat.phase] >= 1000
              ? '1000+'
              : data[stat.phase]}
          </div>
        </div>
      ))}
    </div>
  )
}
