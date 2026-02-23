import { Suspense } from 'react';
import Spinner from '@/components/ui/Spinner';
import DomainsTable from '@/components/expiring/DomainsTable';
import StatsBar from '@/components/expiring/StatsBar';

export default function ExpiringPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Expiring ENS Domains</h1>
      <Suspense fallback={<Spinner label="Loading stats..." />}>
        <StatsBar />
      </Suspense>
      <Suspense fallback={<Spinner label="Loading domains..." />}>
        <DomainsTable />
      </Suspense>
    </section>
  );
}
