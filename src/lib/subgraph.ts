import {
  SubgraphResponse,
  SubgraphRegistration,
  FetchExpiringOptions,
  PageCursor,
} from '@/types/ens'
import { getPhaseWindow } from '@/utils/expiry'

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

export async function fetchExpiringRegistrations({
  phase,
  cursor,
  minLength,
  maxLength,
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

  // Client-side length filtering (subgraph can't filter by name length)
  if (minLength !== undefined || maxLength !== undefined) {
    results = results.filter((reg) => {
      const len = reg.domain.labelName ? [...reg.domain.labelName].length : 0
      if (minLength && len < minLength) return false
      if (maxLength && len > maxLength) return false
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

export async function fetchPhaseCounts(): Promise<{
  grace: number
  premium: number
  available: number
}> {
  const now = Math.floor(Date.now() / 1000)
  const graceStart = now - 90 * 24 * 60 * 60
  const premiumStart = graceStart - 21 * 24 * 60 * 60
  const availableStart = premiumStart - 30 * 24 * 60 * 60

  // Use first: 1000 to get better count estimates
  // Still capped — UI will show "1000+" if maxed
  const query = `{
    grace: registrations(
      first: 1000
      where: { expiryDate_gt: "${graceStart}", expiryDate_lt: "${now}" }
    ) { id }
    
    premium: registrations(
      first: 1000
      where: { expiryDate_gt: "${premiumStart}", expiryDate_lt: "${graceStart}" }
    ) { id }
    
    available: registrations(
      first: 1000
      where: { expiryDate_gt: "${availableStart}", expiryDate_lt: "${premiumStart}" }
    ) { id }
  }`

  const json = await querySubgraph(query)

  return {
    grace: json.data?.grace?.length ?? 0,
    premium: json.data?.premium?.length ?? 0,
    available: json.data?.available?.length ?? 0,
  }
}
