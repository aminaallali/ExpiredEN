'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ExpiryPhase, SortOption } from '@/types/ens'
import DomainsTable from './DomainsTable'

interface Props {
  activePhase: ExpiryPhase
  minLength?: number
  maxLength?: number
  maxDaysLeft?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
  sort?: SortOption
}

const TABS: { label: string; value: ExpiryPhase }[] = [
  { label: 'Grace Period', value: 'grace' },
  { label: 'Premium Auction', value: 'premium' },
  { label: 'Available', value: 'available' },
]

export function PhaseTabs({
  activePhase,
  minLength,
  maxLength,
  maxDaysLeft,
  englishOnly,
  hideEmojiDomains,
  sort = 'ending-soon',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localMinLen, setLocalMinLen] = useState(minLength?.toString() ?? '')
  const [localMaxLen, setLocalMaxLen] = useState(maxLength?.toString() ?? '')
  const [localMaxDays, setLocalMaxDays] = useState(maxDaysLeft?.toString() ?? '')
  const [localEnglish, setLocalEnglish] = useState(englishOnly ?? false)
  const [localHideEmoji, setLocalHideEmoji] = useState(hideEmojiDomains ?? false)
  const [localSort, setLocalSort] = useState<SortOption>(sort)

  function setPhase(phase: ExpiryPhase) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('phase', phase)
    router.push(`${pathname}?${params.toString()}`)
  }

  function applyFilters() {
    const params = new URLSearchParams()
    params.set('phase', activePhase)

    if (localMinLen) params.set('minLen', localMinLen)
    if (localMaxLen) params.set('maxLen', localMaxLen)
    if (localMaxDays) params.set('maxDays', localMaxDays)
    if (localEnglish) params.set('englishOnly', '1')
    if (localHideEmoji) params.set('hideEmoji', '1')
    if (localSort !== 'ending-soon') params.set('sort', localSort)

    router.push(`${pathname}?${params.toString()}`)
  }

  function clearFilters() {
    setLocalMinLen('')
    setLocalMaxLen('')
    setLocalMaxDays('')
    setLocalEnglish(false)
    setLocalHideEmoji(false)
    setLocalSort('ending-soon')

    const params = new URLSearchParams()
    params.set('phase', activePhase)
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasActiveFilters =
    localMinLen || localMaxLen || localMaxDays || localEnglish || localHideEmoji || localSort !== 'ending-soon'

  const sortDirection = sort === 'most-time' ? 'desc' : 'asc'

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPhase(tab.value)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activePhase === tab.value
                ? 'bg-brand-surface-light text-brand-text'
                : 'bg-transparent text-brand-muted hover:text-brand-text hover:bg-brand-surface/50'
            }`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs text-brand-muted mb-1 ml-2">Min length</label>
          <input
            type="number"
            min={1}
            max={255}
            placeholder="e.g. 3"
            value={localMinLen}
            onChange={(e) => setLocalMinLen(e.target.value)}
            className="bg-brand-surface border border-brand-surface-light rounded-full px-4 py-2 text-sm text-brand-text focus:border-brand-yellow outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1 ml-2">Max length</label>
          <input
            type="number"
            min={1}
            max={255}
            placeholder="e.g. 5"
            value={localMaxLen}
            onChange={(e) => setLocalMaxLen(e.target.value)}
            className="bg-brand-surface border border-brand-surface-light rounded-full px-4 py-2 text-sm text-brand-text focus:border-brand-yellow outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1 ml-2">
            {activePhase === 'grace'
              ? 'Grace ends within (days)'
              : activePhase === 'premium'
              ? 'Available within (days)'
              : 'Days filter'}
          </label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 30"
            value={localMaxDays}
            onChange={(e) => setLocalMaxDays(e.target.value)}
            disabled={activePhase === 'available'}
            className="bg-brand-surface border border-brand-surface-light rounded-full px-4 py-2 text-sm text-brand-text focus:border-brand-yellow outline-none disabled:opacity-40"
          />
        </div>

        <div>
          <label className="block text-xs text-brand-muted mb-1 ml-2">Sort order</label>
          <select
            value={localSort}
            onChange={(e) => setLocalSort(e.target.value as SortOption)}
            className="bg-brand-surface border border-brand-surface-light rounded-full px-4 py-2 text-sm text-brand-text focus:border-brand-yellow outline-none"
          >
            <option value="ending-soon">Ending Soon First</option>
            <option value="most-time">Most Time Left First</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-brand-muted self-end pb-2">
          <input
            type="checkbox"
            checked={localEnglish}
            onChange={(e) => setLocalEnglish(e.target.checked)}
            className="accent-brand-yellow"
          />
          English words only
        </label>

        <label className="flex items-center gap-2 text-sm text-brand-muted self-end pb-2">
          <input
            type="checkbox"
            checked={localHideEmoji}
            onChange={(e) => setLocalHideEmoji(e.target.checked)}
            className="accent-brand-yellow"
          />
          Hide emoji domains
        </label>

        <div className="flex gap-2 self-end pb-1">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full border border-brand-surface-light text-brand-muted hover:text-brand-text"
            >
              Clear
            </button>
          )}
          <button
            onClick={applyFilters}
            className="px-4 py-2 rounded-full bg-brand-yellow text-brand-dark font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <DomainsTable
        phase={activePhase}
        minLength={minLength}
        maxLength={maxLength}
        maxDaysLeft={maxDaysLeft}
        englishOnly={englishOnly}
        hideEmojiDomains={hideEmojiDomains}
        sortDirection={sortDirection as 'asc' | 'desc'}
      />
    </div>
  )
}
