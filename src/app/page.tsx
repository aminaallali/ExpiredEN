import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">ExpiredEN</h1>
      <p className="text-slate-300">Browse ENS names in grace period and pending expiration phases.</p>
      <Link href="/expiring" className="inline-flex rounded bg-indigo-500 px-4 py-2 font-medium text-white hover:bg-indigo-400">
        View Expiring Domains
      </Link>
    </section>
  );
}
