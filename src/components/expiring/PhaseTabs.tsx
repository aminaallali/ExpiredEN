'use client';

type Props = {
  value: 'all' | 'grace' | 'pending';
  onChange: (value: 'all' | 'grace' | 'pending') => void;
};

export default function PhaseTabs({ value, onChange }: Props) {
  const tabs: Props['value'][] = ['all', 'grace', 'pending'];
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`rounded px-3 py-1 text-sm ${value === tab ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
