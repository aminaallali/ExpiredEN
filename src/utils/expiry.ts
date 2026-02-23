import { ExpiryPhase, PhaseWindow, SubgraphRegistration, ExpiringDomain } from '@/types/ens'

export const GRACE_PERIOD_SECONDS = 90 * 24 * 60 * 60   // 90 days
export const PREMIUM_PERIOD_SECONDS = 21 * 24 * 60 * 60  // 21 days

// Get the time window for a phase to pass to the subgraph
export function getPhaseWindow(phase: ExpiryPhase): PhaseWindow {
  const now = Math.floor(Date.now() / 1000)

  switch (phase) {
    case 'grace':
      return {
        gt: String(now - GRACE_PERIOD_SECONDS),
        lt: String(now),
      }
    case 'premium':
      return {
        gt: String(now - GRACE_PERIOD_SECONDS - PREMIUM_PERIOD_SECONDS),
        lt: String(now - GRACE_PERIOD_SECONDS),
      }
    case 'available':
      return {
        gt: String(now - GRACE_PERIOD_SECONDS - PREMIUM_PERIOD_SECONDS - 30 * 24 * 60 * 60),
        lt: String(now - GRACE_PERIOD_SECONDS - PREMIUM_PERIOD_SECONDS),
      }
  }
}

// Calculate what phase a domain is in from its raw expiry timestamp
export function getPhaseFromExpiry(expiryTimestamp: number): ExpiryPhase {
  const now = Math.floor(Date.now() / 1000)
  const graceEnds = expiryTimestamp + GRACE_PERIOD_SECONDS
  const availableAt = graceEnds + PREMIUM_PERIOD_SECONDS

  if (now < graceEnds) return 'grace'
  if (now < availableAt) return 'premium'
  return 'available'
}

// Days until a domain is freely registerable
export function getDaysUntilAvailable(expiryTimestamp: number): number {
  const availableAt = expiryTimestamp + GRACE_PERIOD_SECONDS + PREMIUM_PERIOD_SECONDS
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, Math.ceil((availableAt - now) / 86400))
}

// Days remaining in grace period
export function getDaysInGrace(expiryTimestamp: number): number {
  const graceEnds = expiryTimestamp + GRACE_PERIOD_SECONDS
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, Math.ceil((graceEnds - now) / 86400))
}

// Human readable time format
export function formatTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function formatExpiryDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Transform raw subgraph registration into UI-ready ExpiringDomain
export function transformRegistration(reg: SubgraphRegistration): ExpiringDomain | null {
  const labelName = reg.domain.labelName
  const name = reg.domain.name

  if (!labelName || !name) return null

  const expiryDate = parseInt(reg.expiryDate)
  const phase = getPhaseFromExpiry(expiryDate)
  const daysUntilAvailable = getDaysUntilAvailable(expiryDate)

  const hasNumbers = /\d/.test(labelName)
  const hasEmoji = /\p{Emoji}/u.test(labelName)

  return {
    id: reg.id,
    name,
    labelName,
    labelhash: reg.domain.labelhash,
    owner: reg.registrant?.id ?? '0x0000000000000000000000000000000000000000',
    expiryDate,
    phase,
    daysUntilAvailable,
    characterCount: [...labelName].length,
    hasNumbers,
    hasEmoji,
  }
}
