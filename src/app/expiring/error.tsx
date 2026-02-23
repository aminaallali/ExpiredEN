'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded border border-red-500/40 bg-red-950/40 p-4 text-red-200">
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm">{error.message}</p>
      <button className="mt-3 rounded bg-red-700 px-3 py-2 text-sm" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
