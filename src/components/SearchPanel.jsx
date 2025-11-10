import React, { useEffect, useMemo, useState } from 'react';

export default function SearchPanel() {
  const [collection, setCollection] = useState('suspect');
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState('');
  const [risk, setRisk] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const q = {};
    if (term) {
      if (collection === 'suspect') {
        q['full_name'] = { '$regex': term, '$options': 'i' };
      } else {
        q['title'] = { '$regex': term, '$options': 'i' };
      }
    }
    if (collection === 'suspect' && risk) q['risk_level'] = risk;
    if (status) q['status'] = status;
    return q;
  }, [term, status, risk, collection]);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection, query, limit: 50 })
      });
      const data = await res.json();
      setResults(data.items || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, [collection]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs text-slate-400">Collection</label>
          <select value={collection} onChange={e => setCollection(e.target.value)} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
            <option value="suspect">Suspects</option>
            <option value="case">Cases</option>
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-slate-400">Search</label>
          <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Type to search..." className="w-full rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        </div>
        {collection === 'suspect' && (
          <div>
            <label className="block text-xs text-slate-400">Risk</label>
            <select value={risk} onChange={e => setRisk(e.target.value)} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
              <option value="">Any</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-xs text-slate-400">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
            <option value="">Any</option>
            <option value="active">Active</option>
            <option value="detained">Detained</option>
            <option value="cleared">Cleared</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button onClick={search} className="inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-slate-900 font-medium hover:bg-amber-400 transition">{loading ? 'Searching...' : 'Search'}</button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {results.map((r) => (
          <div key={r._id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            {collection === 'suspect' ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-100 font-medium">{r.full_name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.risk_level === 'high' ? 'bg-red-500/20 text-red-300' : r.risk_level === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{r.risk_level}</span>
                </div>
                <p className="mt-1 text-slate-400 text-sm">{r.last_known_location || 'Unknown location'}</p>
                <p className="mt-2 text-slate-300/80 text-sm line-clamp-3">{r.notes || 'No notes'}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-100 font-medium">{r.title}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">{r.status}</span>
                </div>
                <p className="mt-1 text-slate-400 text-sm">Priority: {r.priority}</p>
                <p className="mt-2 text-slate-300/80 text-sm line-clamp-3">{r.description || 'No description'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
