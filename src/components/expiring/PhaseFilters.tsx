'use client';

import PhaseTabs from './PhaseTabs';

export type PhaseValue = 'all' | 'grace' | 'pending';

export default function PhaseFilters({ value, onChange }: { value: PhaseValue; onChange: (value: PhaseValue) => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium text-slate-300">Filter by phase</h2>
      <PhaseTabs value={value} onChange={onChange} />
    </div>
  );
}
