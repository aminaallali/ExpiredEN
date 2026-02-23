'use client'
import { useQuery } from '@tanstack/react-query'
import { fetchPhaseCounts } from '@/lib/subgraph'
import { ExpiryPhase } from '@/types/ens'

const STATS: { label: string; phase: ExpiryPhase }[] = [
  { label: 'Grace Period', phase: 'grace' },
  { label: 'Premium Auction', phase: 'premium' },
  { label: 'Available', phase: 'available' },
]

export function StatsBar({ activePhase }: { activePhase: ExpiryPhase }) {
  const { data } = useQuery({ queryKey: ['phase-counts'], queryFn: fetchPhaseCounts })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {STATS.map((stat) => {
        const isActive = activePhase === stat.phase
        const count = data ? (data[stat.phase] >= 1000 ? '1000+' : data[stat.phase]) : '—'

        if (isActive) {
          return (
            <div key={stat.phase} className="bg-brand-yellow rounded-4xl p-6 relative text-brand-dark flex flex-col justify-between h-64">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium opacity-60 uppercase tracking-wide mb-1">Active Phase</div>
                  <div className="text-3xl font-bold leading-tight">{stat.label}</div>
                </div>
                {/* Circular Arrow Button */}
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="bg-brand-cream rounded-[24px] p-4 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium opacity-60 mb-1">Domains</span>
                  <span className="text-3xl font-bold">{count}</span>
                </div>
                <div className="bg-brand-cream rounded-[24px] p-4 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium opacity-60 mb-1">Status</span>
                  <span className="text-xl font-bold">Live</span>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={stat.phase} className="bg-brand-surface rounded-4xl p-6 relative text-brand-text flex flex-col justify-between h-64 border border-brand-surface-light">
             <div>
                <div className="text-sm font-medium text-brand-muted mb-1">{stat.label}</div>
                <div className="text-4xl font-light">{count} <span className="text-lg text-brand-muted">names</span></div>
             </div>
             <div className="mt-auto flex items-end gap-2 h-20 opacity-30">
                {/* Decorative Chart Bars */}
                {[40, 70, 45, 90, 60, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-brand-surface-light rounded-t-md" style={{ height: `${h}%` }} />
                ))}
             </div>
          </div>
        )
      })}
    </div>
  )
}
