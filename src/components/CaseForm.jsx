import React, { useState } from 'react';

export default function CaseForm({ onCreated, baseUrl }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'open', priority: 'medium', suspects: '', evidence: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const suspects = form.suspects ? form.suspects.split(',').map(s => s.trim()).filter(Boolean) : [];
      const evidence = form.evidence ? form.evidence.split('\n').map(line => {
        const [type, ...rest] = line.split(':');
        return { type: type?.trim() || 'document', description: rest.join(':').trim() };
      }).filter(i => i.description) : [];

      const payload = { title: form.title, description: form.description || null, status: form.status, priority: form.priority, suspects, evidence, tags: [] };
      const res = await fetch(`${baseUrl}/api/cases`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to create case');
      const data = await res.json();
      onCreated?.(data);
      setForm({ title: '', description: '', status: 'open', priority: 'medium', suspects: '', evidence: '' });
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-slate-100 font-medium">Create Case</h3>
      <form onSubmit={submit} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="title" value={form.title} onChange={update} required placeholder="Case title" className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500 md:col-span-2" />
        <select name="status" value={form.status} onChange={update} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <textarea name="description" value={form.description} onChange={update} placeholder="Description" className="md:col-span-3 rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <select name="priority" value={form.priority} onChange={update} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input name="suspects" value={form.suspects} onChange={update} placeholder="Linked suspect IDs (comma separated)" className="md:col-span-2 rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <textarea name="evidence" value={form.evidence} onChange={update} placeholder={"Evidence (one per line)\nFormat: type: description"} className="md:col-span-3 rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500 min-h-[90px]" />
        <button disabled={loading} className="md:col-span-3 inline-flex justify-center rounded-md bg-amber-500 px-4 py-2 text-slate-900 font-medium hover:bg-amber-400 transition disabled:opacity-60">{loading ? 'Saving...' : 'Save Case'}</button>
      </form>
      {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
    </div>
  );
}
