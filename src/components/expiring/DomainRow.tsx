import type { Domain } from '@/types/ens';
import ExpiryBadge from './ExpiryBadge';

export default function DomainRow({ domain }: { domain: Domain }) {
  return (
    <tr className="border-b border-slate-800">
      <td className="p-2">{domain.name}</td>
      <td className="p-2 capitalize">{domain.phase}</td>
      <td className="p-2"><ExpiryBadge expiryDate={domain.expiryDate} /></td>
    </tr>
  );
}
