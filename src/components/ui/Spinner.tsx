export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="w-5 h-5 border-2 border-brand-surface-light border-t-brand-yellow rounded-full animate-spin" />
      {label && <span className="text-sm text-brand-muted">{label}</span>}
    </div>
  )
}
