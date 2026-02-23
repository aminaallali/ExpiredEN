'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to your error tracking service in production
    console.error('Expiring page error:', error)
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-terminal-premium/10 border border-terminal-premium/30 flex items-center justify-center mb-6">
          <span className="text-2xl">⚠</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-terminal-text mb-3">
          Something went wrong
        </h2>

        <p className="text-terminal-muted text-sm max-w-md mb-2">
          Could not load expiring domains. This usually means the ENS subgraph
          is temporarily unavailable.
        </p>

        {/* Show error detail in dev */}
        {process.env.NODE_ENV === 'development' && (
          <pre className="text-xs text-terminal-premium bg-terminal-surface border border-terminal-border rounded-lg p-4 mt-4 mb-6 max-w-lg overflow-auto text-left">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={reset}
            className="px-6 py-2 text-sm bg-terminal-accent text-white rounded hover:bg-terminal-accent/80 transition-colors"
          >
            Try again
          </button>

          <a
            href="https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-sm border border-terminal-border text-terminal-muted rounded hover:text-terminal-text hover:border-terminal-accent transition-colors"
          >
            Check subgraph status ↗
          </a>
        </div>
      </div>
    </div>
  )
}
