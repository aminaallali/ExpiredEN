import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-terminal-border bg-terminal-surface/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-lg text-terminal-text hover:text-terminal-accent transition-colors"
        >
          ENS<span className="text-terminal-accent">expiring</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-terminal-muted">
          <Link
            href="/expiring?phase=grace"
            className="hover:text-terminal-grace transition-colors"
          >
            Grace
          </Link>
          <Link
            href="/expiring?phase=premium"
            className="hover:text-terminal-premium transition-colors"
          >
            Premium
          </Link>
          <Link
            href="/expiring?phase=available"
            className="hover:text-terminal-available transition-colors"
          >
            Available
          </Link>
          <a
            href="https://app.ens.domains"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terminal-text transition-colors"
          >
            ENS App ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
