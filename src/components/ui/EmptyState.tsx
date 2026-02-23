export default function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-brand-surface rounded-4xl border border-brand-surface-light">
      <div className="text-4xl mb-4 text-brand-yellow">∅</div>
      <h3 className="text-brand-text text-xl font-medium mb-2">{title}</h3>
      {description && (
        <p className="text-brand-muted text-sm max-w-sm">{description}</p>
      )}
    </div>
  )
}
