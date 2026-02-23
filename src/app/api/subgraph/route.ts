import { NextRequest, NextResponse } from 'next/server'

const SUBGRAPH_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`

const TIMEOUT_MS = 10_000

export async function POST(req: NextRequest) {
  if (!process.env.GRAPH_API_KEY) {
    return NextResponse.json(
      { error: 'GRAPH_API_KEY not configured' },
      { status: 500 }
    )
  }

  let body: { query?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  if (
    typeof body.query !== 'string' ||
    body.query.includes('mutation') ||
    body.query.includes('subscription')
  ) {
    return NextResponse.json(
      { error: 'Only read queries allowed' },
      { status: 400 }
    )
  }

  if (body.query.length > 2000) {
    return NextResponse.json(
      { error: 'Query too large' },
      { status: 400 }
    )
  }

  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: body.query }),
        signal: controller.signal,
        next: { revalidate: 60 },
      })

      clearTimeout(timeout)

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          return NextResponse.json(
            { error: `Subgraph returned ${response.status}` },
            { status: 502 }
          )
        }
        throw new Error(`Subgraph returned ${response.status}`)
      }

      const data = await response.json()

      if (data.errors?.length) {
        return NextResponse.json(
          { error: data.errors[0].message, errors: data.errors },
          { status: 422 }
        )
      }

      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      })
    } catch (err) {
      lastError = err
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 200))
      }
    }
  }

  console.error('Subgraph fetch failed after 3 attempts:', lastError)
  return NextResponse.json(
    { error: 'Failed to reach subgraph after retries' },
    { status: 502 }
  )
}
