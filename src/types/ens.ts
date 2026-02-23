// Raw data from The Graph subgraph
export interface SubgraphRegistration {
  id: string
  expiryDate: string
  domain: {
    name: string | null
    labelName: string | null
    labelhash: string
  }
  registrant: {
    id: string
  } | null
}

export interface SubgraphResponse {
  data: {
    registrations: SubgraphRegistration[]
    [key: string]: SubgraphRegistration[] | undefined
  }
  errors?: { message: string }[]
}

// Processed domain used in UI
export interface ExpiringDomain {
  id: string
  name: string
  labelName: string
  labelhash: string
  owner: string
  expiryDate: number
  phase: ExpiryPhase
  daysUntilAvailable: number
  daysLeftInPhase: number
  characterCount: number
  hasNumbers: boolean
  hasEmoji: boolean
}

export type ExpiryPhase = 'grace' | 'premium' | 'available'

export type SortOption = 'ending-soon' | 'most-time'

export interface PhaseWindow {
  gt: string
  lt: string
}

export interface FetchExpiringOptions {
  phase: ExpiryPhase
  cursor?: PageCursor
  minLength?: number
  maxLength?: number
  maxDaysLeft?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
  sortDirection?: 'asc' | 'desc'
}

export interface PageCursor {
  expiryDate: string
  id: string
}
