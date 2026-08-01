import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card p-12 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <p className="text-slate-600 font-semibold text-base mb-1">{title}</p>
      {description && <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  );
}
