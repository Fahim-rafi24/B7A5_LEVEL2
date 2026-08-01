'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { X, Mail, Lock, User as UserIcon, Phone, AlertCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('tenant');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === 'login') {
        await login({ email, password });
      } else {
        await register({ name, email, password, role, phone });
      }
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-modal-in relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${tab === 'login' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition ${tab === 'register' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'
              }`}
            onClick={() => setTab('register')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="form-label">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="form-input pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

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

          {tab === 'register' && (
            <>
              <div>
                <label className="form-label">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+8801700000000"
                    className="form-input pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="form-label">I am a</label>
                <select className="form-input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                  <option value="tenant">Tenant — Looking for a home</option>
                  <option value="landlord">Landlord — Listing properties</option>
                  {/* <option value="admin">Admin — Platform moderator</option> */}
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {tab === 'register' && (
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Password must be at least 8 characters, include 2 numbers and 1 special character
            (e.g. <code className="bg-slate-100 px-1 rounded">Secure@123</code>).
          </p>
        )}
      </div>
    </div>
  );
}
