'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ExpiryPhase } from '@/types/ens'
import DomainsTable from './DomainsTable'

interface Props {
  activePhase: ExpiryPhase
  minLength?: number
  maxLength?: number
}

const TABS: { label: string; value: ExpiryPhase }[] = [
  { label: 'Grace Period', value: 'grace' },
  { label: 'Premium Auction', value: 'premium' },
  { label: 'Available', value: 'available' },
]

export function PhaseTabs({ activePhase, minLength, maxLength }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setPhase(phase: ExpiryPhase) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('phase', phase)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex border-b border-terminal-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPhase(tab.value)}
            className={`px-6 py-3 text-sm transition-colors ${
              activePhase === tab.value
                ? 'border-b-2 border-terminal-accent text-terminal-accent'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <DomainsTable phase={activePhase} minLength={minLength} maxLength={maxLength} />
    </div>
  )
}
