export async function fetchSubgraph<T>(query: string, variables: Record<string, unknown>) {
  const response = await fetch('/api/subgraph', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch subgraph data');
  }

  return (await response.json()) as T;
}
