import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';

export default function EmptyState({
  title = 'No Destinations Found',
  message = 'We couldn’t find any places matching your current search or filter criteria.',
  onReset,
  actionText = 'Reset Filters',
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center max-w-lg mx-auto shadow-sm my-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-4">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-medium transition shadow-sm hover:shadow active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
