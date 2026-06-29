import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, PhoneCall, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0A0712] px-4 py-12 text-white">
      {/* Background glowing gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-950/30 blur-[150px]" />

      <div className="relative w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand logo & header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/20">
            <PhoneCall className="h-7 w-7 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Antigravity Call
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Intelligent Phone Call Reminders for Google Calendar
          </p>
        </div>

        {/* Feature quick checklist */}
        <div className="mt-8 space-y-4 rounded-xl bg-white/[0.01] p-4 border border-white/[0.02]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-purple-500/10 p-1.5 text-purple-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Two-Way Sync</h3>
              <p className="text-xs text-gray-400">Syncs calendar events instantly with your phone dashboard.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-indigo-500/10 p-1.5 text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Secure OAuth2</h3>
              <p className="text-xs text-gray-400">Tokens are protected backend-to-backend without browser access.</p>
            </div>
          </div>
        </div>

        {/* Submit action button */}
        <div className="mt-8">
          <button
            onClick={login}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {/* Google SVG Icon */}
            <svg className="h-5 w-5 fill-white transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.177-2.767-6.177-6.177S10.58 6.16 13.99 6.16c1.614 0 3.018.615 4.103 1.637l3.14-3.14C19.33 2.822 16.9 1.6 13.99 1.6 8.252 1.6 3.6 6.252 3.6 12s4.652 10.4 10.39 10.4c5.738 0 10.39-4.652 10.39-10.4 0-.615-.053-1.229-.164-1.715H12.24z" />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-gray-500">
          By continuing, you link your Google Calendar with Antigravity Call.
        </p>
      </div>
    </div>
  );
};
