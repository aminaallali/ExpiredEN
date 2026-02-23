import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 py-4">
      <Link href="/" className="text-xl font-bold">ExpiredEN</Link>
      <nav>
        <Link href="/expiring" className="text-slate-300 hover:text-white">Expiring</Link>
      </nav>
    </header>
  );
}
