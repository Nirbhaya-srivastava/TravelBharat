import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@travelbharat.gov.in');
  const [password, setPassword] = useState('AdminPassword123!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@travelbharat.gov.in');
    setPassword('AdminPassword123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg shadow-amber-950/5">
        {/* Brand & Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Curator Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            TravelBharat Administrative & Editorial Dashboard
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/70 text-xs text-amber-950 space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Default Admin Credentials:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-amber-800 hover:text-amber-900 underline font-bold"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono bg-white/70 p-2 rounded-lg text-[11px] space-y-0.5 border border-amber-200/50">
            <div><strong className="text-slate-600">Email:</strong> admin@travelbharat.gov.in</div>
            <div><strong className="text-slate-600">Password:</strong> AdminPassword123!</div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travelbharat.gov.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition">
            ← Return to Public Encyclopedia
          </Link>
        </div>
      </div>
    </div>
  );
}
