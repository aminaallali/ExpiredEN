'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ExpiryPhase } from '@/types/ens'
import DomainsTable from './DomainsTable'

interface Props {
  activePhase: ExpiryPhase
  minLength?: number
  maxLength?: number
  expiresWithinDays?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
}

const TABS: { label: string; value: ExpiryPhase }[] = [
  { label: 'Grace Period', value: 'grace' },
  { label: 'Premium Auction', value: 'premium' },
  { label: 'Available', value: 'available' },
]

function useDebouncedParam(
  key: string,
  initialValue: string,
  updateParam: (key: string, value?: string) => void,
  delay = 400
) {
  const [local, setLocal] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    setLocal(initialValue)
  }, [initialValue])

  const onChange = useCallback(
    (value: string) => {
      setLocal(value)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        updateParam(key, value || undefined)
      }, delay)
    },
    [key, updateParam, delay]
  )

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return [local, onChange] as const
}

export function PhaseTabs({
  activePhase,
  minLength,
  maxLength,
  expiresWithinDays,
  englishOnly,
  hideEmojiDomains,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setPhase(phase: ExpiryPhase) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('phase', phase)
    router.push(`${pathname}?${params.toString()}`)
  }

  const updateParam = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (!value) params.delete(key)
      else params.set(key, value)
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const [localMin, setLocalMin] = useDebouncedParam(
    'minLen',
    minLength?.toString() ?? '',
    updateParam
  )
  const [localMax, setLocalMax] = useDebouncedParam(
    'maxLen',
    maxLength?.toString() ?? '',
    updateParam
  )
  const [localExpires, setLocalExpires] = useDebouncedParam(
    'expiresIn',
    expiresWithinDays?.toString() ?? '',
    updateParam
  )

  return (
    <div>
      <div className="mb-6 flex flex-wrap border-b border-terminal-border">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPhase(tab.value)}
            aria-selected={activePhase === tab.value}
            role="tab"
            className={`px-4 py-3 text-sm transition-colors sm:px-6 ${
              activePhase === tab.value
                ? 'border-b-2 border-terminal-accent text-terminal-accent'
                : 'text-terminal-muted hover:text-terminal-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-terminal-border bg-terminal-surface/40 p-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs text-terminal-muted">
          Min length
          <input
            type="number"
            min={1}
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-2 py-2 text-sm text-terminal-text"
          />
        </label>

        <label className="text-xs text-terminal-muted">
          Max length
          <input
            type="number"
            min={1}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-2 py-2 text-sm text-terminal-text"
          />
        </label>

        <label className="text-xs text-terminal-muted">
          Expires within (days)
          <input
            type="number"
            min={1}
            value={localExpires}
            onChange={(e) => setLocalExpires(e.target.value)}
            className="mt-1 w-full rounded border border-terminal-border bg-terminal-bg px-2 py-2 text-sm text-terminal-text"
          />
        </label>

        <label className="flex items-center gap-2 rounded border border-terminal-border px-3 py-2 text-sm text-terminal-muted">
          <input
            type="checkbox"
            checked={englishOnly ?? false}
            onChange={(e) => updateParam('englishOnly', e.target.checked ? '1' : undefined)}
          />
          English dictionary words
        </label>

        <label className="flex items-center gap-2 rounded border border-terminal-border px-3 py-2 text-sm text-terminal-muted">
          <input
            type="checkbox"
            checked={hideEmojiDomains ?? false}
            onChange={(e) => updateParam('hideEmoji', e.target.checked ? '1' : undefined)}
          />
          Hide emoji domains
        </label>
      </div>

      <DomainsTable
        phase={activePhase}
        minLength={minLength}
        maxLength={maxLength}
        expiresWithinDays={expiresWithinDays}
        englishOnly={englishOnly}
        hideEmojiDomains={hideEmojiDomains}
      />
    </div>
  )
}
