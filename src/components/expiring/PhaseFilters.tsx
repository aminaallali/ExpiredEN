'use client'

import { ExpiryPhase } from '@/types/ens'

const PHASES: { label: string; value: ExpiryPhase | 'all' }[] = [
  { label: 'All',     value: 'all' },
  { label: 'Grace',   value: 'grace' },
  { label: 'Premium', value: 'premium' },
]

export type PhaseValue = 'all' | ExpiryPhase

export default function PhaseFilters({
  value,
  onChange,
}: {
  value: PhaseValue
  onChange: (value: PhaseValue) => void
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-medium text-terminal-muted">Filter by phase</h2>
      <div className="flex gap-2">
        {PHASES.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={`rounded px-3 py-1 text-sm transition-colors ${
              value === p.value
                ? 'bg-terminal-accent text-white'
                : 'bg-terminal-surface text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
