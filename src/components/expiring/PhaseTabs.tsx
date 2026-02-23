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

const TABS: { label: string; value: ExpiryPhase; color: string }[] = [
  { label: 'Grace Period', value: 'grace', color: 'border-terminal-grace text-terminal-grace' },
  { label: 'Premium Auction', value: 'premium', color: 'border-terminal-premium text-terminal-premium' },
  { label: 'Available', value: 'available', color: 'border-terminal-available text-terminal-available' },
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

  // Local filter state — only pushed to URL on Apply
  const [localMinLen, setLocalMinLen] = useState(minLength?.toString() ?? '')
  const [localMaxLen, setLocalMaxLen] = useState(maxLength?.toString() ?? '')
  const [localMaxDays, setLocalMaxDays] = useState(maxDaysLeft?.toString() ?? '')
  const [localEnglish, setLocalEnglish] = useState(englishOnly ?? false)
  const [localHideEmoji, setLocalHideEmoji] = useState(hideEmojiDomains ?? false)
  const [localSort, setLocalSort] = useState<SortOption>(sort)

  // Phase tab click — navigate immediately
  function setPhase(phase: ExpiryPhase) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('phase', phase)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Apply all filters at once
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

  // Clear all filters
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

  // Convert sort option to subgraph direction
  const sortDirection = sort === 'most-time' ? 'desc' : 'asc'

  return (
    <div>
      {/* Phase tabs */}
      <div className="flex flex-wrap border-b border-terminal-border mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPhase(tab.value)}
            className={`px-4 py-3 text-sm font-mono transition-all border-b-2 -mb-px sm:px-6 ${
              activePhase === tab.value
                ? `${tab.color} bg-terminal-surface/50`
                : 'text-terminal-muted border-transparent hover:text-terminal-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      <div className="rounded-lg border border-terminal-border bg-terminal-surface/40 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-terminal-muted uppercase tracking-wider font-bold">
            Filters
          </span>
        </div>

        {/* Row 1: Number inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Min length */}
          <div>
            <label className="block text-xs text-terminal-muted mb-1">
              Min length
            </label>
            <input
              type="number"
              min={1}
              max={255}
              placeholder="e.g. 3"
              value={localMinLen}
              onChange={(e) => setLocalMinLen(e.target.value)}
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text outline-none focus:border-terminal-accent"
            />
          </div>

          {/* Max length */}
          <div>
            <label className="block text-xs text-terminal-muted mb-1">
              Max length
            </label>
            <input
              type="number"
              min={1}
              max={255}
              placeholder="e.g. 5"
              value={localMaxLen}
              onChange={(e) => setLocalMaxLen(e.target.value)}
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text outline-none focus:border-terminal-accent"
            />
          </div>

          {/* Max days left */}
          <div>
            <label className="block text-xs text-terminal-muted mb-1">
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
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text outline-none focus:border-terminal-accent disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs text-terminal-muted mb-1">
              Sort order
            </label>
            <select
              value={localSort}
              onChange={(e) => setLocalSort(e.target.value as SortOption)}
              className="w-full rounded border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text outline-none focus:border-terminal-accent"
            >
              <option value="ending-soon">Ending Soon First</option>
              <option value="most-time">Most Time Left First</option>
            </select>
          </div>
        </div>

        {/* Row 2: Checkboxes + buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-terminal-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={localEnglish}
              onChange={(e) => setLocalEnglish(e.target.checked)}
              className="accent-terminal-accent"
            />
            English words only
          </label>

          <label className="flex items-center gap-2 text-sm text-terminal-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={localHideEmoji}
              onChange={(e) => setLocalHideEmoji(e.target.checked)}
              className="accent-terminal-accent"
            />
            Hide emoji domains
          </label>

          {/* Spacer pushes buttons right on desktop */}
          <div className="flex-1" />

          <div className="flex gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs text-terminal-muted hover:text-terminal-text border border-terminal-border rounded transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-xs bg-terminal-accent/20 border border-terminal-accent/40 text-terminal-accent rounded hover:bg-terminal-accent/30 transition-colors font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Domains table */}
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
