import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur border-b border-brand-surface-light/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-brand-text text-xl font-semibold tracking-tight">
          ENS <span className="text-brand-yellow">Expiring</span>
        </Link>
        <a
          href="https://app.ens.domains"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full bg-brand-surface text-brand-cream text-sm hover:bg-brand-surface-light transition-colors"
        >
          ENS App
        </a>
      </div>
    </header>
  )
}
