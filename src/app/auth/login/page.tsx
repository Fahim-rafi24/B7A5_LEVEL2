'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, DEMO_ACCOUNTS } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { Mail, Lock, AlertCircle, Loader2, KeyRound, Zap } from 'lucide-react';
import { toast } from 'sonner';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const { login, loginDemo } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

    const redirectAfter = (role: string) => {
        if (callbackUrl?.startsWith('/')) {
            router.push(callbackUrl);
        } else {
            router.push(`/dashboard/${role}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const u = await login({ email, password });
            toast.success(`Welcome back, ${u.name}!`);
            redirectAfter(u.role);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to sign in.');
        } finally {
            setLoading(false);
        }
    };

    const handleDemo = async (role: UserRole) => {
        setDemoLoading(role);
        setError(null);
        try {
            const u = await loginDemo(role);
            toast.success(`Signed in as ${u.name} (${role})`);
            redirectAfter(role);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Demo login failed');
        } finally {
            setDemoLoading(null);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="card p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                            <KeyRound className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your RentNest account</p>
                    </div>

                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="form-label">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="form-input pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        <div>
                            <label className="form-label">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="form-input pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Quick demo login
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(DEMO_ACCOUNTS) as UserRole[]).map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleDemo(role)}
                                    disabled={demoLoading !== null}
                                    className="px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-50 capitalize"
                                >
                                    {demoLoading === role ? '…' : role}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                            Admin: admin@rentnest.com / admin123 · Landlord: rahim@rentnest.com / password123 · Tenant: aarif@gmail.com / password123
                        </p>
                    </div>
                </div>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
