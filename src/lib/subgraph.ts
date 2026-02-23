import {
  SubgraphResponse,
  SubgraphRegistration,
  FetchExpiringOptions,
  PageCursor,
} from '@/types/ens'
import {
  getPhaseWindow,
  GRACE_PERIOD_SECONDS,
  PREMIUM_PERIOD_SECONDS,
} from '@/utils/expiry'
import { ENGLISH_WORDS } from '@/data/englishWords'

const PAGE_SIZE = 100

async function querySubgraph(query: string): Promise<SubgraphResponse> {
  const response = await fetch('/api/subgraph', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchExpiringRegistrations({
  phase,
  cursor,
  minLength,
  maxLength,
  maxDaysLeft,
  englishOnly,
  hideEmojiDomains,
  sortDirection = 'asc',
}: FetchExpiringOptions): Promise<{
  registrations: SubgraphRegistration[]
  nextCursor: PageCursor | null
}> {
  const window = getPhaseWindow(phase)
  const isAsc = sortDirection === 'asc'

  let whereClause: string

  if (!cursor) {
    whereClause = `expiryDate_gt: "${window.gt}", expiryDate_lt: "${window.lt}"`
  } else if (isAsc) {
    whereClause = `expiryDate_gte: "${cursor.expiryDate}", id_gt: "${cursor.id}", expiryDate_lt: "${window.lt}"`
  } else {
    whereClause = `expiryDate_gt: "${window.gt}", expiryDate_lte: "${cursor.expiryDate}", id_lt: "${cursor.id}"`
  }

  const query = `{
    registrations(
      first: ${PAGE_SIZE}
      orderBy: expiryDate
      orderDirection: ${sortDirection}
      where: { ${whereClause} }
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

  const rawResults = json.data.registrations
  let results = [...rawResults]

  const now = Math.floor(Date.now() / 1000)

  results = results.filter((reg) => {
    const label = reg.domain.labelName ?? ''
    const len = label ? [...label].length : 0

    if (minLength !== undefined && len < minLength) return false
    if (maxLength !== undefined && len > maxLength) return false

    if (hideEmojiDomains && /\p{Extended_Pictographic}/u.test(label)) {
      return false
    }

    if (englishOnly && !ENGLISH_WORDS.has(label.toLowerCase())) {
      return false
    }

    if (maxDaysLeft !== undefined) {
      const expiry = Number(reg.expiryDate)

      if (phase === 'grace') {
        const graceEnds = expiry + GRACE_PERIOD_SECONDS
        const daysLeft = Math.ceil((graceEnds - now) / 86400)
        if (daysLeft > maxDaysLeft) return false
      } else if (phase === 'premium') {
        const availableAt =
          expiry + GRACE_PERIOD_SECONDS + PREMIUM_PERIOD_SECONDS
        const daysLeft = Math.ceil((availableAt - now) / 86400)
        if (daysLeft > maxDaysLeft) return false
      }
    }

    return true
  })

  const rawLast = rawResults[rawResults.length - 1]
  const nextCursor: PageCursor | null =
    rawResults.length === PAGE_SIZE && rawLast
      ? { expiryDate: rawLast.expiryDate, id: rawLast.id }
      : null

  return { registrations: results, nextCursor }
}

async function countPhaseRegistrations(
  gt: string,
  lt: string
): Promise<number> {
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