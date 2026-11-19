'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid administrator credentials');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@khair.in');
    setPassword('KhairAdmin2026!');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#021811] via-[#073D2C] to-[#03231A] p-4 sm:p-6 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-khair-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-khair-botanical/25 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[28px] p-7 sm:p-10 shadow-2xl border border-khair-gold/30 space-y-6">
        
        {/* Brand Logo & Portal Header */}
        <div className="text-center space-y-3">
          <div className="py-1">
            <img
              src="/images/branding/khair-logotext.png"
              alt="KHAIR International"
              className="h-10 sm:h-12 w-auto mx-auto object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-khair-warmIvory/80 border border-khair-gold/30">
            <span className="w-1.5 h-1.5 rounded-full bg-khair-gold animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-khair-botanical">
              ADMINISTRATION CMS
            </span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Secure portal to manage departments, doctors, media, and incoming patient appointments.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 shadow-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Administrator Email *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@khair.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-xs rounded-xl border border-khair-softBeige bg-gray-50/50 focus:bg-white focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all placeholder:text-gray-400"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Password *
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-10 text-xs rounded-xl border border-khair-softBeige bg-gray-50/50 focus:bg-white focus:border-khair-gold focus:ring-1 focus:ring-khair-gold outline-none transition-all placeholder:text-gray-400"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-khair-deepForest focus:ring-khair-gold"
              />
              <span>Remember this session</span>
            </label>

            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-khair-botanical hover:text-khair-deepForest inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <KeyRound className="w-3 h-3" />
              <span>Fill Demo</span>
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs font-bold text-white bg-khair-deepForest hover:bg-khair-darkGreen rounded-xl shadow-lg shadow-khair-deepForest/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Return Link Footer */}
        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <a
            href="/en"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-khair-deepForest font-medium transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Website</span>
          </a>

          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-khair-botanical" />
            <span>256-Bit SSL Protected</span>
          </div>
        </div>

      </div>
    </div>
  );
}
