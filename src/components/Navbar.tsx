'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Building2, LayoutDashboard, ChevronDown, User, LogOut, Zap, X } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { toast } from 'sonner';
import AuthModal from './AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeRole, setActiveRole, logout, loginDemo, isLoading } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

  const handleDemoLogin = async (role: UserRole) => {
    setDemoLoading(role);
    try {
      const u = await loginDemo(role);
      toast.success(`Signed in as ${u.name} (${role})`);
      setDemoOpen(false);
      router.push(`/dashboard/${role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Demo login failed');
    } finally {
      setDemoLoading(null);
    }
  };

  const handleRoleNav = (role: UserRole) => {
    setActiveRole(role);
    if (pathname.startsWith('/dashboard')) router.push(`/dashboard/${role}`);
  };

  const navLink = (href: string, label: string, icon?: React.ReactNode, active?: boolean) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'hover:bg-slate-100 text-slate-700'
        }`}
    >
      {icon}
      {label}
    </Link>
  );

  return (
    <>
      <nav className="glass fixed top-0 left-0 right-0 z-50">
        <div className="container-custom flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="text-gradient">RentNest</span>
            <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              🏠
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLink('/', 'Home', <Home className="w-4 h-4" />, pathname === '/')}
            {navLink('/properties', 'Properties', <Building2 className="w-4 h-4" />, pathname.startsWith('/properties'))}
            {user &&
              navLink(
                `/dashboard/${user.role}`,
                'Dashboard',
                <LayoutDashboard className="w-4 h-4" />,
                pathname.startsWith('/dashboard')
              )}
          </div>

          <div className="flex items-center gap-3">


            {!isLoading && !user && (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary text-sm px-5 py-2"
              >
                <User className="w-4 h-4" /> Sign In
              </button>
            )}

            {!isLoading && user && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/${user.role}`}
                  className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-200 px-3 py-2 rounded-full hover:border-blue-600 text-slate-800 transition capitalize"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {user.name.charAt(0)}
                  </span>
                  {user.role}
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    router.push('/');
                  }}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setDemoOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-900 text-white px-3.5 py-2 rounded-full hover:bg-slate-800 transition"
              >
                <Zap className="w-3.5 h-3.5" /> Demo
                <ChevronDown className="w-3 h-3" />
              </button>
              {demoOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  <p className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Quick login as
                  </p>
                  {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      disabled={demoLoading === role}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition disabled:opacity-60"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-800 capitalize">
                          {DEMO_ACCOUNTS[role].label}
                        </div>
                        <div className="text-[11px] text-slate-400">{DEMO_ACCOUNTS[role].email}</div>
                      </div>
                      {demoLoading === role ? (
                        <span className="skeleton h-4 w-4 rounded-full" />
                      ) : (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                          {role}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 space-y-1">
            {navLink('/', 'Home')}
            {navLink('/properties', 'Properties')}
            {user && navLink(`/dashboard/${user.role}`, 'Dashboard')}
            {!user && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
