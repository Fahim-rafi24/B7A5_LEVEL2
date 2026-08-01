'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-custom py-20 max-w-md mx-auto text-center">
      <div className="card p-10 shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Something went wrong</h1>
        <p className="text-sm text-slate-500">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <button onClick={reset} className="btn-primary justify-center text-sm mx-auto">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
