import {
  SubgraphResponse,
  SubgraphRegistration,
  FetchExpiringOptions,
  PageCursor,
} from '@/types/ens'
import { getPhaseWindow } from '@/utils/expiry'
import { ENGLISH_WORDS } from '@/data/englishWords'

const PAGE_SIZE = 100

// All queries go through our own API route — API key stays server-side
async function querySubgraph(query: string): Promise<SubgraphResponse> {
  const response = await fetch('/api/subgraph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Request failed: ${response.status}`)
  }

  return response.json()
}

// Use Extended_Pictographic to avoid matching ASCII digits/symbols.
const EMOJI_REGEX = /\p{Extended_Pictographic}/u

export async function fetchExpiringRegistrations({
  phase,
  cursor,
  minLength,
  maxLength,
  expiresWithinDays,
  englishOnly,
  hideEmojiDomains,
}: FetchExpiringOptions): Promise<{
  registrations: SubgraphRegistration[]
  nextCursor: PageCursor | null
}> {
  const window = getPhaseWindow(phase)

  // Cursor-based pagination using expiryDate_gte + id_gt
  // This avoids skipping domains with duplicate timestamps
  const cursorFilter = cursor
    ? `expiryDate_gte: "${cursor.expiryDate}", id_gt: "${cursor.id}"`
    : `expiryDate_gt: "${window.gt}"`

  const query = `{
    registrations(
      first: ${PAGE_SIZE}
      orderBy: expiryDate
      orderDirection: asc
      where: {
        ${cursorFilter}
        expiryDate_lt: "${window.lt}"
      }
    ) {
      id
      expiryDate
      domain {
        name
        labelName
        labelhash
      }
      registrant {
        id
      }
    }
  }`

  const json = await querySubgraph(query)

  let results = json.data.registrations

  // Client-side filtering (subgraph can't filter by label-derived fields)
  if (
    minLength !== undefined ||
    maxLength !== undefined ||
    expiresWithinDays !== undefined ||
    englishOnly ||
    hideEmojiDomains
  ) {
    const now = Math.floor(Date.now() / 1000)
    const maxExpiry =
      expiresWithinDays !== undefined
        ? now + expiresWithinDays * 24 * 60 * 60
        : undefined

    results = results.filter((reg) => {
      const label = reg.domain.labelName?.toLowerCase() ?? ''
      const len = label ? [...label].length : 0

      if (minLength && len < minLength) return false
      if (maxLength && len > maxLength) return false
      if (maxExpiry && Number(reg.expiryDate) > maxExpiry) return false

      if (hideEmojiDomains && EMOJI_REGEX.test(label)) return false

      if (englishOnly) {
        if (!ENGLISH_WORDS.has(label)) return false
      }

      return true
    })
  }

  // Build cursor from the last raw item (before filtering)
  // We use the unfiltered last item so pagination doesn't miss pages
  const rawLast = json.data.registrations[json.data.registrations.length - 1]
  const nextCursor: PageCursor | null =
    json.data.registrations.length === PAGE_SIZE && rawLast
      ? { expiryDate: rawLast.expiryDate, id: rawLast.id }
      : null

  return { registrations: results, nextCursor }
}

async function countPhaseRegistrations(gt: string, lt: string): Promise<number> {
  let total = 0
  let lastId = ''

  while (true) {
    const idFilter = lastId ? `id_gt: "${lastId}",` : ''

    const query = `{
      registrations(
        first: 1000
        orderBy: id
        orderDirection: asc
        where: {
          ${idFilter}
          expiryDate_gt: "${gt}"
          expiryDate_lt: "${lt}"
        }
      ) { id }
    }`

    const json = await querySubgraph(query)
    const batch = json.data.registrations

    total += batch.length

    if (batch.length < 1000) break

    lastId = batch[batch.length - 1].id

    // Safety: cap at 50 iterations (50,000 domains) to prevent infinite loops
    if (total >= 50000) break
  }

  return total
}

export async function fetchPhaseCounts(): Promise<{
  grace: number
  premium: number
  available: number
}> {
  const now = Math.floor(Date.now() / 1000)
  const graceStart = String(now - 90 * 24 * 60 * 60)
  const premiumStart = String(Number(graceStart) - 21 * 24 * 60 * 60)
  const availableStart = String(Number(premiumStart) - 30 * 24 * 60 * 60)
  const nowStr = String(now)

  const [grace, premium, available] = await Promise.all([
    countPhaseRegistrations(graceStart, nowStr),
    countPhaseRegistrations(premiumStart, graceStart),
    countPhaseRegistrations(availableStart, premiumStart),
  ])

  return { grace, premium, available }
}
