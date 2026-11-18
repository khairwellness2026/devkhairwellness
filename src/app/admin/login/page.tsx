'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@khair.in');
  const [password, setPassword] = useState('KhairAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-khair-darkGreen via-khair-deepForest to-khair-charcoal p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-khair-gold/30 space-y-6">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-khair-warmIvory border border-khair-gold/40 flex items-center justify-center mx-auto p-2 shadow-sm text-khair-deepForest">
            <ShieldCheck className="w-8 h-8 text-khair-botanical" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-khair-deepForest">
            KHAIR CMS Portal
          </h1>
          <p className="text-xs text-gray-500">
            Sign in to manage departments, doctors, media, and patient enquiries
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none pl-10"
                placeholder="admin@khair.in"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-xs rounded-xl border border-khair-softBeige focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none pl-10"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-xl bg-khair-warmIvory/70 border border-khair-gold/30 text-[11px] text-gray-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-khair-deepForest">
            <ShieldCheck className="w-3.5 h-3.5 text-khair-goldDark" />
            <span>Administrator Credentials</span>
          </div>
          <p>Email: <span className="font-mono font-semibold">admin@khair.in</span></p>
          <p>Password: <span className="font-mono font-semibold">KhairAdmin2026!</span></p>
        </div>

      </div>
    </div>
  );
}

