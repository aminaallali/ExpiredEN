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
        <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-surface-light flex items-center justify-center mb-6">
          <span className="text-2xl">⚠</span>
        </div>

        <h2 className="text-2xl font-bold text-brand-text mb-3">
          Failed to load domains
        </h2>
        
        <p className="text-brand-muted max-w-md mb-6">
          We had trouble fetching the latest expiring domains from the ENS subgraph.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <pre className="text-left bg-[#0a0a0f] text-red-400 p-4 rounded text-xs overflow-auto max-w-2xl w-full mb-6">
            {error.message}
          </pre>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={reset}
            className="px-6 py-2 text-sm bg-brand-yellow text-brand-dark rounded-full font-medium hover:bg-opacity-90 transition-colors"
          >
            Try again
          </button>

          <a
            href="https://thegraph.com/explorer/subgraphs/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 text-sm border border-brand-surface-light text-brand-muted rounded-full hover:text-brand-text hover:border-brand-yellow transition-colors"
          >
            Check subgraph status ↗
          </a>
        </div>
      </div>
    </div>
  )
}
