import { classNames } from '@/lib/utils';

export type BadgeTone = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'neutral';

const toneStyles: Record<BadgeTone, string> = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    active: 'badge-active',
    completed: 'badge-completed',
    neutral: 'bg-slate-100 text-slate-600',
};

const dotStyles: Record<BadgeTone, string> = {
    pending: 'status-dot yellow',
    approved: 'status-dot blue',
    rejected: 'status-dot red',
    active: 'status-dot green',
    completed: 'status-dot gray',
    neutral: 'status-dot gray',
};

export function rentalTone(status: string): BadgeTone {
    switch (status?.toLowerCase()) {
        case 'pending':
            return 'pending';
        case 'approved':
            return 'approved';
        case 'rejected':
        case 'cancelled':
            return 'rejected';
        case 'active':
            return 'active';
        case 'completed':
            return 'completed';
        default:
            return 'neutral';
    }
}

export function statusLabel(status: string): string {
    const s = status?.toLowerCase();
    switch (s) {
        case 'pending':
            return 'Pending';
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        case 'active':
            return 'Active';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
        case 'available':
            return 'Available';
        case 'rented':
            return 'Rented';
        case 'banned':
            return 'Banned';
        case 'paid':
            return 'Paid';
        default:
            return status || 'Unknown';
    }
}

export default function StatusBadge({
    status,
    tone,
    dot = true,
}: {
    status: string;
    tone?: BadgeTone;
    dot?: boolean;
}) {
    const resolvedTone = tone || rentalTone(status);
    return (
        <span className={classNames('badge', toneStyles[resolvedTone])}>
            {dot && <span className={classNames('status-dot', dotStyles[resolvedTone])} />}
            {statusLabel(status)}
        </span>
    );
}
