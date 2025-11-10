import React, { useState } from 'react';

export default function SuspectForm({ onCreated, baseUrl }) {
  const [form, setForm] = useState({ full_name: '', aliases: '', dob: '', last_known_location: '', risk_level: 'medium', status: 'active', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        full_name: form.full_name,
        aliases: form.aliases ? form.aliases.split(',').map(a => a.trim()).filter(Boolean) : [],
        dob: form.dob || null,
        last_known_location: form.last_known_location || null,
        risk_level: form.risk_level,
        status: form.status,
        notes: form.notes || null,
        tags: []
      };
      const res = await fetch(`${baseUrl}/api/suspects`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create suspect');
      const data = await res.json();
      onCreated?.(data);
      setForm({ full_name: '', aliases: '', dob: '', last_known_location: '', risk_level: 'medium', status: 'active', notes: '' });
    } catch (err) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-slate-100 font-medium">Add Suspect</h3>
      <form onSubmit={submit} className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input name="full_name" value={form.full_name} onChange={update} required placeholder="Full name" className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <input name="aliases" value={form.aliases} onChange={update} placeholder="Aliases (comma separated)" className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <input type="date" name="dob" value={form.dob} onChange={update} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <input name="last_known_location" value={form.last_known_location} onChange={update} placeholder="Last known location" className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500 md:col-span-2" />
        <select name="risk_level" value={form.risk_level} onChange={update} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select name="status" value={form.status} onChange={update} className="rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-amber-500">
          <option value="active">Active</option>
          <option value="detained">Detained</option>
          <option value="cleared">Cleared</option>
        </select>
        <textarea name="notes" value={form.notes} onChange={update} placeholder="Notes" className="md:col-span-3 rounded-md bg-slate-800/70 px-3 py-2 text-slate-100 placeholder-slate-400 outline-none ring-1 ring-slate-700 focus:ring-amber-500" />
        <button disabled={loading} className="md:col-span-3 inline-flex justify-center rounded-md bg-amber-500 px-4 py-2 text-slate-900 font-medium hover:bg-amber-400 transition disabled:opacity-60">{loading ? 'Saving...' : 'Save Suspect'}</button>
      </form>
      {error && <p className="mt-2 text-sm text-amber-300">{error}</p>}
    </div>
  );
}
