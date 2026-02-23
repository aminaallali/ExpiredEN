export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title skeleton */}
      <div className="mb-8">
        <div className="h-3 bg-brand-surface rounded w-20 mb-4 animate-pulse" />
        <div className="h-10 bg-brand-surface rounded w-80 mb-2 animate-pulse" />
        <div className="h-4 bg-brand-surface rounded w-96 animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-brand-surface border border-brand-surface-light rounded-4xl animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-32 bg-brand-surface border border-brand-surface-light rounded-full animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-brand-surface border border-brand-surface-light rounded-[24px] animate-pulse"
            style={{
              animationDelay: `${i * 50}ms`,
              opacity: 1 - i * 0.05,
            }}
          />
        ))}
      </div>
    </div>
  )
}
