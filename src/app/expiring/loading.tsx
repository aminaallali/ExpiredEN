export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title skeleton */}
      <div className="mb-8">
        <div className="h-3 bg-terminal-surface rounded w-20 mb-4 animate-pulse" />
        <div className="h-10 bg-terminal-surface rounded w-80 mb-2 animate-pulse" />
        <div className="h-4 bg-terminal-surface rounded w-96 animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-terminal-surface border border-terminal-border rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-0 border-b border-terminal-border mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-32 bg-terminal-surface animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="border border-terminal-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="h-10 bg-terminal-surface border-b border-terminal-border animate-pulse" />

        {/* Rows */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-terminal-border animate-pulse"
            style={{
              animationDelay: `${i * 50}ms`,
              opacity: 1 - i * 0.04,
            }}
          />
        ))}
      </div>
    </div>
  )
}
