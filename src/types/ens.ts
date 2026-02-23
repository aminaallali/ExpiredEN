// Raw data from The Graph subgraph
export interface SubgraphRegistration {
  id: string                   // registration ID — needed for cursor pagination
  expiryDate: string           // Unix timestamp as string e.g. "1714752524"
  domain: {
    name: string | null        // e.g. "vitalik.eth" (null for some domains)
    labelName: string | null   // e.g. "vitalik"
    labelhash: string
  }
  registrant: {
    id: string                 // owner wallet address
  } | null
}

export interface SubgraphResponse {
  data: {
    registrations: SubgraphRegistration[]
  }
  errors?: { message: string }[]
}

// Processed domain used in UI
export interface ExpiringDomain {
  id: string                   // registration ID for keying + cursor
  name: string                 // "vitalik.eth"
  labelName: string            // "vitalik"
  labelhash: string
  owner: string                // "0x..."
  expiryDate: number           // Unix timestamp (number)
  phase: ExpiryPhase
  daysUntilAvailable: number
  characterCount: number
  hasNumbers: boolean
  hasEmoji: boolean
}

export type ExpiryPhase = 'grace' | 'premium' | 'available'

export interface PhaseWindow {
  gt: string   // expiryDate_gt param
  lt: string   // expiryDate_lt param
}

export interface FetchExpiringOptions {
  phase: ExpiryPhase
  cursor?: {
    expiryDate: string
    id: string
  }
  minLength?: number
  maxLength?: number
  expiresWithinDays?: number
  englishOnly?: boolean
  hideEmojiDomains?: boolean
}

// Cursor returned from each page for pagination
export interface PageCursor {
  expiryDate: string
  id: string
}
