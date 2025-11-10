import React, { useEffect, useState } from 'react';
import Hero3D from './components/Hero3D';
import SuspectForm from './components/SuspectForm';
import CaseForm from './components/CaseForm';
import SearchPanel from './components/SearchPanel';

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
      <div className="text-3xl font-semibold text-amber-400">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

export default function App() {
  const [overview, setOverview] = useState({ suspects_sample: 0, cases_sample: 0, recent_suspects: [], recent_cases: [] });
  const [refreshKey, setRefreshKey] = useState(0);

  const baseUrl = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin.replace(':3000', ':8000') : '');

  const loadOverview = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/reports/overview?limit=6`);
      const data = await res.json();
      setOverview(data);
    } catch (e) {
      // ignore for now
    }
  };

  useEffect(() => { loadOverview(); }, [refreshKey]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-8">
        <Hero3D />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Recent suspects" value={overview.suspects_sample} />
          <Stat label="Recent cases" value={overview.cases_sample} />
          <Stat label="Open cases" value={overview.recent_cases?.filter(c => c.status !== 'closed').length || 0} />
          <Stat label="High‑risk suspects" value={overview.recent_suspects?.filter(s => s.risk_level === 'high').length || 0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SuspectForm baseUrl={baseUrl} onCreated={() => setRefreshKey(k => k + 1)} />
          <CaseForm baseUrl={baseUrl} onCreated={() => setRefreshKey(k => k + 1)} />
        </div>

        <SearchPanel baseUrl={baseUrl} />

        <footer className="pt-6 text-center text-slate-500 text-sm">
          Secure dark theme with deep blues and grays, accented with amber.
        </footer>
      </div>
    </div>
  );
}
