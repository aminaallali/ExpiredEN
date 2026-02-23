export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-900 p-6 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
    </div>
  );
}
