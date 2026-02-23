import { NextRequest, NextResponse } from 'next/server';

const SUBGRAPH_URL = process.env.SUBGRAPH_URL;
const SUBGRAPH_API_KEY = process.env.SUBGRAPH_API_KEY;

export async function POST(req: NextRequest) {
  if (!SUBGRAPH_URL) {
    return NextResponse.json({ error: 'SUBGRAPH_URL is not configured' }, { status: 500 });
  }

  const body = await req.json();

  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(SUBGRAPH_API_KEY ? { authorization: `Bearer ${SUBGRAPH_API_KEY}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
