import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, Map } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl border border-slate-200/80 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Error 404</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Destination Not Found</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            The page or catalog entry you are looking for has been moved, re-indexed, or does not exist in the digital encyclopedia.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/destinations"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold hover:bg-slate-200 transition"
          >
            <Map className="w-4 h-4 text-amber-700" />
            <span>Browse All Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
