import React, { useState } from 'react';

interface LoginScreenProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (activeTab === 'signin') {
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Required field missing.');
        return;
      }
      setIsSubmitting(true);
      
      // Artificial delay to simulate processing but immediately bypass external API
      setTimeout(() => {
        setIsSubmitting(false);
        localStorage.setItem('auth_token', 'bypass_token_12345');
        const displayUser = 'Workspace Expert';
        onLoginSuccess(email.trim().toLowerCase(), displayUser);
      }, 400);
    } else {
      if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !mobile.trim()) {
        setErrorMessage('All registration fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (password.length < 8 || password.length > 15) {
        setErrorMessage('Password must be between 8 and 15 characters.');
        return;
      }
      if (!/^\d{10}$/.test(mobile.trim())) {
        setErrorMessage('Mobile number must be a valid 10-digit format.');
        return;
      }
      setIsSubmitting(true);

      const parts = fullName.trim().split(/\s+/);
      const first_name = parts[0] || 'Architect';
      const last_name = parts.slice(1).join(' ') || 'Expert';

      // Bypass registration and login the user immediately
      setTimeout(() => {
        setIsSubmitting(false);
        localStorage.setItem('auth_token', 'bypass_token_12345');
        const displayUser = fullName.trim() || 'Workspace Expert';
        onLoginSuccess(email.trim().toLowerCase(), displayUser);
      }, 450);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background radial glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-700/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Subtle branding title */}
        <div className="text-center mb-6">
          <span className="text-white text-3xl font-extrabold tracking-tight select-none">AssessMax</span>
        </div>

        {/* Primary Auth Card */}
        <div className="bg-[#0f1021] border border-slate-800/80 rounded-2xl shadow-2xl shadow-black/80 p-8 relative">
          
          {/* Circular Security Seal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-[#1b1c35] border border-slate-700/60 flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Interactive Navigation Tab List */}
          <div className="flex bg-[#07080f] p-1 rounded-lg border border-slate-800/50 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
              }}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-white text-xl font-semibold tracking-tight">
              {activeTab === 'signin' ? 'Welcome back' : 'Get started today'}
            </h1>
            <p className="text-slate-400/80 text-xs mt-1">
              {activeTab === 'signin' 
                ? 'Enter your credentials to access your estimation panel' 
                : 'Setup your standard engineering workspace workspace'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-950/40 border border-red-800/55 rounded-lg p-3 text-red-300 text-xs text-center font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-950/45 border border-emerald-800/55 rounded-lg p-3 text-emerald-300 text-xs text-center font-medium">
                {successMessage}
              </div>
            )}

            {activeTab === 'signup' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-350 text-[10px] font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0c0d1c] border border-slate-800 focus:border-violet-600 rounded-lg py-2.5 px-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                    placeholder="e.g. Srinivasan G"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-350 text-[10px] font-bold uppercase tracking-wider mb-1.5">Mobile Number</label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full bg-[#0c0d1c] border border-slate-800 focus:border-violet-600 rounded-lg py-2.5 px-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                    placeholder="e.g. 9876543120"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-350 text-[10px] font-bold uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0c0d1c] border border-slate-800 focus:border-violet-600 rounded-lg py-2.5 px-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-slate-350 text-[10px] font-bold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0c0d1c] border border-slate-800 focus:border-violet-600 rounded-lg py-2.5 px-4 pr-11 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.138-4.755m2.796-1.583A10.018 10.018 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-2.03 3.523m-2.705-2.705a3 3 0 11-4.242-4.242" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-slate-350 text-[10px] font-bold uppercase tracking-wider mb-1.5">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0c0d1c] border border-slate-800 focus:border-violet-600 rounded-lg py-2.5 px-4 text-white text-xs placeholder-slate-600 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-orange-500/10 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : activeTab === 'signin' ? (
                'Sign In'
              ) : (
                'Register'
              )}
            </button>
          </form>


          {/* Bottom helper footer message */}
          <div className="mt-6 text-center border-t border-slate-900 pt-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Independent Quantities Estimator workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
