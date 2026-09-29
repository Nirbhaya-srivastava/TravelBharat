import React from 'react';

export default function LoadingSpinner({ text = 'Loading encyclopedia...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-30"></div>
        <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-amber-600 border-r-indigo-900 animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-amber-50 flex items-center justify-center">
          <span className="text-amber-800 text-xs font-serif font-bold">TB</span>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide">{text}</p>
    </div>
  );
}

export function DestinationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm animate-pulse flex flex-col h-full">
      <div className="h-56 bg-slate-200 w-full"></div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
