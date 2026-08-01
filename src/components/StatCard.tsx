import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'slate';
}

const accentMap = {
  blue: 'text-blue-600',
  green: 'text-emerald-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
  slate: 'text-slate-900',
};

export default function StatCard({ label, value, icon: Icon, accent = 'slate' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400">{label}</div>
          <div className={`text-2xl font-extrabold mt-1 ${accentMap[accent]}`}>{value}</div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 ${accentMap[accent]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
