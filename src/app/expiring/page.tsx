import { Suspense } from 'react'
import { PhaseTabs } from '@/components/expiring/PhaseTabs'
import { StatsBar } from '@/components/expiring/StatsBar'
import { ExpiryPhase, SortOption } from '@/types/ens'

interface PageProps {
  searchParams: Promise<{
    phase?: string
    minLen?: string
    maxLen?: string
    maxDays?: string
    expiresWithinDays?: string
    englishOnly?: string
    hideEmoji?: string
    sort?: string
  }>
}

export default async function ExpiringPage({ searchParams }: PageProps) {
  const params = await searchParams

  const phase = (
    ['grace', 'premium', 'available'].includes(params.phase ?? '')
      ? params.phase
      : 'grace'
  ) as ExpiryPhase

  const minLength = params.minLen ? parseInt(params.minLen) : undefined
  const maxLength = params.maxLen ? parseInt(params.maxLen) : undefined
  const maxDaysLeft = params.maxDays
    ? parseInt(params.maxDays)
    : params.expiresWithinDays
    ? parseInt(params.expiresWithinDays)
    : undefined
  const englishOnly = params.englishOnly === '1'
  const hideEmojiDomains = params.hideEmoji === '1'

  const sort = (
    ['ending-soon', 'most-time'].includes(params.sort ?? '')
      ? params.sort
      : 'ending-soon'
  ) as SortOption

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page title */}
      <div className="mb-8 pl-2">
        <h1 className="text-5xl font-light tracking-tight text-brand-text mb-2">
          Growing with <br/><span className="font-medium">Knowledge</span>
        </h1>
        <p className="text-brand-muted text-lg">
          Track expiring .eth domains in real-time.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-4xl bg-brand-surface border border-brand-surface-light animate-pulse" />
            ))}
          </div>
        }
      >
        <StatsBar activePhase={phase} />
      </Suspense>

      <Suspense
        fallback={<div className="h-64 rounded-4xl bg-brand-surface border border-brand-surface-light animate-pulse" />}
      >
        <PhaseTabs
          activePhase={phase}
          minLength={minLength}
          maxLength={maxLength}
          maxDaysLeft={maxDaysLeft}
          englishOnly={englishOnly}
          hideEmojiDomains={hideEmojiDomains}
          sort={sort}
        />
      </Suspense>
    </div>
  )
}
