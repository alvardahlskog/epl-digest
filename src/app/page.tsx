import { Suspense } from 'react';
import { getPremierLeagueRundown } from '@/lib/rundownService';
import { RundownDashboard } from '@/components/RundownDashboard';

async function DashboardContent() {
  const data = await getPremierLeagueRundown();
  return <RundownDashboard initialData={data} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-neutral-400">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading Premier League Rundown...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
