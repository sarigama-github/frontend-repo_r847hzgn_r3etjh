import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/mwBbOy4jrazr59EO/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full w-full flex items-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h1 className="text-3xl md:text-5xl font-semibold text-slate-100 drop-shadow-lg">
            Criminal Database Management System
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300/80">
            Secure, data‑intensive tracking for suspects and cases. Built for law enforcement with modern search and reporting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-amber-300 ring-1 ring-amber-400/30">
              End‑to‑end security
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 ring-1 ring-emerald-400/30">
              MongoDB powered
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-blue-300 ring-1 ring-blue-400/30">
              Realtime search
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
