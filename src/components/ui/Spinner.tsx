export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="w-5 h-5 border-2 border-terminal-border border-t-terminal-accent rounded-full animate-spin" />
      {label && <span className="text-sm text-terminal-muted">{label}</span>}
    </div>
  )
}
