export default function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-4xl mb-4">∅</div>
      <h3 className="text-terminal-text font-display font-semibold mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-terminal-muted text-sm max-w-sm">{description}</p>
      )}
    </div>
  )
}
