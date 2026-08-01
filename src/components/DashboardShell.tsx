'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    PlusCircle,
    Inbox,
    LogOut,
    ArrowLeft,
    Users,
    Building2,
    ShieldCheck,
    FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { classNames } from '@/lib/utils';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const links: { href: string; label: string; icon: React.ReactNode }[] = [];
    if (user?.role === 'tenant') {
        links.push({ href: '/dashboard/tenant', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> });
    } else if (user?.role === 'landlord') {
        links.push({ href: '/dashboard/landlord', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> });
        links.push({ href: '/dashboard/landlord/properties/new', label: 'Add Property', icon: <PlusCircle className="w-4 h-4" /> });
        links.push({ href: '/dashboard/landlord/requests', label: 'Rental Requests', icon: <Inbox className="w-4 h-4" /> });
    } else if (user?.role === 'admin') {
        links.push({ href: '/dashboard/admin', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> });
    }

    const handleLogout = async () => {
        await logout();
        toast.info('You have been logged out');
        router.push('/');
    };

    return (
        <div className="container-custom py-8 md:py-10">
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="card p-4 lg:sticky lg:top-24">
                        <div className="flex items-center gap-3 p-2 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-sm text-slate-900 truncate">{user?.name}</div>
                                <div className="text-[11px] text-slate-400 capitalize">{user?.role} account</div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={classNames(
                                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition',
                                        isActive(link.href)
                                            ? 'bg-blue-50 text-blue-700 font-semibold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    )}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-1">
                            <Link
                                href="/"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Site
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>

                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                            <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Role access
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Users className="w-3 h-3" /> Users
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Building2 className="w-3 h-3" /> Properties
                            </p>
                            <p className="flex items-center gap-1.5">
                                <FileText className="w-3 h-3" /> Rentals
                            </p>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
