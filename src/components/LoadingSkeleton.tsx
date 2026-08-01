export function PropertyCardSkeleton() {
    return (
        <div className="card">
            <div className="skeleton h-48 w-full rounded-none" />
            <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-8 w-full" />
                <div className="skeleton h-4 w-2/3" />
            </div>
        </div>
    );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="skeleton h-12 w-full" />
            ))}
        </div>
    );
}

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="stat-card space-y-3">
                    <div className="skeleton h-3 w-1/2" />
                    <div className="skeleton h-7 w-1/3" />
                </div>
            ))}
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="skeleton h-96 w-full" />
            <div className="skeleton h-6 w-1/2" />
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-40 w-full" />
        </div>
    );
}

export default function LoadingSkeleton({ count = 6, variant = 'grid' }: { count?: number; variant?: 'grid' | 'table' | 'detail' | 'stats' }) {
    if (variant === 'table') return <TableSkeleton rows={count} />;
    if (variant === 'detail') return <DetailSkeleton />;
    if (variant === 'stats') return <StatCardSkeleton count={count} />;
    return <PropertyGridSkeleton count={count} />;
}
