'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>

            {pages.map((p) => (
                <button
                    type="button"
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition ${p === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
        </nav>
    );
}
