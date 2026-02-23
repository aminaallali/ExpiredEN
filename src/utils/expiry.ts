import {
  ExpiryPhase,
  PhaseWindow,
  SubgraphRegistration,
  ExpiringDomain,
} from '@/types/ens'

export const GRACE_PERIOD_SECONDS = 90 * 24 * 60 * 60
export const PREMIUM_PERIOD_SECONDS = 21 * 24 * 60 * 60

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
        gt: String(
          now -
            GRACE_PERIOD_SECONDS -
            PREMIUM_PERIOD_SECONDS -
            30 * 24 * 60 * 60
        ),
        lt: String(now - GRACE_PERIOD_SECONDS - PREMIUM_PERIOD_SECONDS),
      }
  }
}

export function getPhaseFromExpiry(expiryTimestamp: number): ExpiryPhase {
  const now = Math.floor(Date.now() / 1000)
  const graceEnds = expiryTimestamp + GRACE_PERIOD_SECONDS
  const availableAt = graceEnds + PREMIUM_PERIOD_SECONDS

  if (now < graceEnds) return 'grace'
  if (now < availableAt) return 'premium'
  return 'available'
}

export function getDaysUntilAvailable(expiryTimestamp: number): number {
  const availableAt =
    expiryTimestamp + GRACE_PERIOD_SECONDS + PREMIUM_PERIOD_SECONDS
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, Math.ceil((availableAt - now) / 86400))
}

export function getDaysInGrace(expiryTimestamp: number): number {
  const graceEnds = expiryTimestamp + GRACE_PERIOD_SECONDS
  const now = Math.floor(Date.now() / 1000)
  return Math.max(0, Math.ceil((graceEnds - now) / 86400))
}

// Calculate days remaining in the current phase
export function getDaysLeftInPhase(
  expiryTimestamp: number,
  phase: ExpiryPhase
): number {
  const now = Math.floor(Date.now() / 1000)

  switch (phase) {
    case 'grace': {
      const graceEnds = expiryTimestamp + GRACE_PERIOD_SECONDS
      return Math.max(0, Math.ceil((graceEnds - now) / 86400))
    }
    case 'premium': {
      const availableAt =
        expiryTimestamp + GRACE_PERIOD_SECONDS + PREMIUM_PERIOD_SECONDS
      return Math.max(0, Math.ceil((availableAt - now) / 86400))
    }
    case 'available':
      return 0
  }
}

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

// FIX: Use Extended_Pictographic instead of Emoji
// The old regex /\p{Emoji}/u matches digits 0-9 which is wrong
function containsEmoji(str: string): boolean {
  return /\p{Extended_Pictographic}/u.test(str)
}

export function transformRegistration(
  reg: SubgraphRegistration
): ExpiringDomain | null {
  const labelName = reg.domain.labelName
  const name = reg.domain.name

  if (!labelName || !name) return null

  const expiryDate = parseInt(reg.expiryDate)
  const phase = getPhaseFromExpiry(expiryDate)
  const daysUntilAvailable = getDaysUntilAvailable(expiryDate)
  const daysLeftInPhase = getDaysLeftInPhase(expiryDate, phase)

  const hasNumbers = /\d/.test(labelName)
  const hasEmoji = containsEmoji(labelName)

  return {
    id: reg.id,
    name,
    labelName,
    labelhash: reg.domain.labelhash,
    owner:
      reg.registrant?.id ??
      '0x0000000000000000000000000000000000000000',
    expiryDate,
    phase,
    daysUntilAvailable,
    daysLeftInPhase,
    characterCount: [...labelName].length,
    hasNumbers,
    hasEmoji,
  }
}
