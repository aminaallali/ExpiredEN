export function Footer() {
  return (
    <footer className="border-t border-terminal-border py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-terminal-muted">
        <span>
          Data from{' '}
          <a
            href="https://thegraph.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terminal-text transition-colors"
          >
            The Graph ↗
          </a>
        </span>
        <span>Not affiliated with ENS Labs</span>
      </div>
    </footer>
  )
}
