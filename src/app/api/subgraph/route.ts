import { NextRequest, NextResponse } from 'next/server'

const SUBGRAPH_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`

export async function POST(req: NextRequest) {
  // Validate API key exists
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

  // Only allow read queries
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

  // Rate limit: basic protection via size cap
  if (body.query.length > 2000) {
    return NextResponse.json(
      { error: 'Query too large' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(SUBGRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: body.query }),
      // Cache at edge for 60 seconds
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Subgraph returned ${response.status}` },
        { status: 502 }
      )
    }

    const data = await response.json()

    // Pass through subgraph errors
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
    console.error('Subgraph fetch failed:', err)
    return NextResponse.json(
      { error: 'Failed to reach subgraph' },
      { status: 502 }
    )
  }
}
