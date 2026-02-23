import { Suspense } from 'react'
import { PhaseTabs } from '@/components/expiring/PhaseTabs'
import { StatsBar } from '@/components/expiring/StatsBar'
import { ExpiryPhase } from '@/types/ens'

interface PageProps {
  searchParams: {
    phase?: string
    minLen?: string
    maxLen?: string
    expiresIn?: string
    englishOnly?: string
    hideEmoji?: string
  }
}

export default function ExpiringPage({ searchParams }: PageProps) {
  const phase = (['grace', 'premium', 'available'].includes(searchParams.phase ?? '')
    ? searchParams.phase
    : 'grace') as ExpiryPhase

  const minLength = searchParams.minLen ? parseInt(searchParams.minLen) : undefined
  const maxLength = searchParams.maxLen ? parseInt(searchParams.maxLen) : undefined
  const expiresWithinDays = searchParams.expiresIn
    ? parseInt(searchParams.expiresIn)
    : undefined
  const englishOnly = searchParams.englishOnly === '1'
  const hideEmojiDomains = searchParams.hideEmoji === '1'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="live-dot w-2 h-2 rounded-full bg-terminal-available inline-block" />
          <span className="text-xs text-terminal-muted uppercase tracking-widest">
            Live Data
          </span>
        </div>
        <h1 className="font-display text-4xl font-bold text-terminal-text">
          Expiring <span className="text-terminal-accent">.eth</span> Domains
        </h1>
        <p className="mt-2 text-terminal-muted text-sm">
          Track domains in grace period, premium auction, and newly available.
        </p>
      </div>

      {/* Stats bar — wrapped in Suspense because it fetches data client-side */}
      <Suspense
        fallback={
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-terminal-surface border border-terminal-border rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <StatsBar activePhase={phase} />
      </Suspense>

      {/* Phase tabs + filters + table — Suspense required for useSearchParams */}
      <Suspense
        fallback={
          <div>
            <div className="flex gap-0 border-b border-terminal-border mb-6">
              {['Grace Period', 'Premium Auction', 'Available'].map((label) => (
                <div
                  key={label}
                  className="px-6 py-3 text-sm text-terminal-muted"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-terminal-surface rounded animate-pulse"
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          </div>
        }
      >
        <PhaseTabs
          activePhase={phase}
          minLength={minLength}
          maxLength={maxLength}
          expiresWithinDays={expiresWithinDays}
          englishOnly={englishOnly}
          hideEmojiDomains={hideEmojiDomains}
        />
      </Suspense>
    </div>
  )
}
