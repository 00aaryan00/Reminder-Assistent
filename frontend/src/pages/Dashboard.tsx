import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Settings as SettingsIcon, PhoneCall, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#06040A] text-gray-100">
      {/* Header bar */}
      <header className="border-b border-white/5 bg-[#09070F] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-md shadow-purple-500/10">
              <PhoneCall className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Antigravity Call</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-200">{user?.name || 'User Account'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] hover:text-white transition-all cursor-pointer"
              title="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Welcome Card & Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to your dashboard, {user?.name || 'Scheduler'}!</h2>
              <p className="text-sm text-gray-400">
                Your AI Reminder Assistant is fully connected to your Google account. We are monitoring your calendar events to trigger Exotel reminder phone calls automatically.
              </p>
            </div>

            {/* Upcoming meetings card template */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <Calendar className="h-5 w-5 text-purple-400" />
                Upcoming Calendars Sync
              </h3>
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.005]">
                <p className="text-sm text-gray-500">No synchronized meetings found.</p>
                <p className="text-xs text-gray-600 mt-1">Create an event on Google Calendar to see it appear here.</p>
              </div>
            </div>
          </div>

          {/* Quick Settings widget */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                <SettingsIcon className="h-5 w-5 text-indigo-400" />
                Quick Configuration
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Display Timezone
                  </label>
                  <select 
                    value={user?.settings?.displayTimezone || 'Asia/Kolkata'} 
                    disabled 
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-200 outline-none cursor-not-allowed"
                  >
                    <option value="Asia/Kolkata">India (IST - GMT+5:30)</option>
                    <option value="America/New_York">New York (EST - GMT-5:00)</option>
                    <option value="Europe/London">London (GMT - GMT+0:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Reminder Timings
                  </label>
                  <select 
                    value={user?.settings?.reminderTiming || 30} 
                    disabled 
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-200 outline-none cursor-not-allowed"
                  >
                    <option value="5">5 minutes before</option>
                    <option value="10">10 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                  </select>
                </div>

                <div className="rounded-xl bg-purple-500/10 p-4 border border-purple-500/10 mt-6 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-purple-300">Connection Valid</h4>
                    <p className="text-[11px] text-purple-400/80 mt-0.5">Google OAuth credentials are linked. Refresh token exists in system.</p>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
