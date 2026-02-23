import type { ExpiringDomain } from '@/types/ens'
import ExpiryBadge from './ExpiryBadge'

export default function DomainRow({ domain }: { domain: ExpiringDomain }) {
  return (
    <div className="bg-brand-surface border border-brand-surface-light rounded-[24px] p-5 flex items-center justify-between hover:border-brand-yellow/50 transition-colors gap-4">
      <div className="min-w-0">
         <div className="bg-brand-yellow text-brand-dark text-[10px] font-bold px-2 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">
           {domain.phase}
         </div>
         <div className="text-xl font-medium text-brand-text break-all">{domain.name}</div>
      </div>
      <div className="text-right flex flex-col items-end">
        <ExpiryBadge expiryDate={domain.expiryDate} />
        <div className="mt-2 text-xs text-brand-muted truncate max-w-[100px]">
          Owner: {domain.owner.slice(0,6)}...
        </div>
      </div>
    </div>
  )
}
