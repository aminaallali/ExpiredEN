import Link from 'next/link'

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-terminal-border px-6 py-4">
      <Link href="/" className="font-display text-xl font-bold text-terminal-text">
        ExpiredEN
      </Link>
      <nav>
        <Link href="/expiring" className="text-sm text-terminal-muted hover:text-terminal-text transition-colors">
          Expiring
        </Link>
      </nav>
    </header>
  )
}
