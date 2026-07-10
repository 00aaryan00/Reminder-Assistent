import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Settings as SettingsIcon, PhoneCall, CheckCircle, Save, Loader2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

export const Dashboard: React.FC = () => {
  const { user, logout, checkAuth } = useAuth();
  
  const [displayTimezone, setDisplayTimezone] = useState(user?.settings?.displayTimezone || 'Asia/Kolkata');
  const [reminderTiming, setReminderTiming] = useState(user?.settings?.reminderTiming || 30);
  const [userPhone, setUserPhone] = useState(user?.settings?.userPhone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch upcoming calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/calendar/upcoming`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };
    
    if (user) {
      fetchEvents();
    }
  }, [user]);

  // Update local state if user settings load later
  useEffect(() => {
    if (user?.settings) {
      setDisplayTimezone(user.settings.displayTimezone || 'Asia/Kolkata');
      setReminderTiming(user.settings.reminderTiming || 30);
      setUserPhone(user.settings.userPhone || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ displayTimezone, reminderTiming: Number(reminderTiming), userPhone }),
      });
      
      if (response.ok) {
        setMessage('Settings saved successfully!');
        await checkAuth(); // Refresh the context to show new values globally
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      setMessage('Network error. Failed to save.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    }
  };

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
              <div className="space-y-3">
                {loadingEvents ? (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.005]">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400 mb-2" />
                    <p className="text-sm text-gray-500">Loading your upcoming meetings...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 border border-dashed border-white/10 rounded-xl bg-white/[0.005]">
                    <p className="text-sm text-gray-500">No upcoming meetings found.</p>
                    <p className="text-xs text-gray-600 mt-1">Create an event on Google Calendar to see it appear here.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {events.map((event) => {
                      const startTime = event.start?.dateTime ? new Date(event.start.dateTime) : new Date(event.start?.date);
                      return (
                        <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.015] hover:bg-white/[0.03] transition-colors">
                          <div>
                            <h4 className="text-sm font-semibold text-white">{event.summary || 'Busy'}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{startTime.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-purple-500/10 text-xs font-medium text-purple-400 border border-purple-500/10">
                              <PhoneCall className="h-3 w-3 mr-1" />
                              Scheduled
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Your Phone Number (For Calls)
                  </label>
                  <input 
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g. 09876543210"
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Display Timezone
                  </label>
                  <select 
                    value={displayTimezone}
                    onChange={(e) => setDisplayTimezone(e.target.value)}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
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
                    value={reminderTiming}
                    onChange={(e) => setReminderTiming(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                  >
                    <option value="5">5 minutes before</option>
                    <option value="10">10 minutes before</option>
                    <option value="30">30 minutes before</option>
                    <option value="60">1 hour before</option>
                  </select>
                </div>

                {message && (
                  <div className={`text-xs p-2 rounded-lg ${message.includes('successfully') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600/20 py-2.5 px-4 text-sm font-semibold text-indigo-400 hover:bg-indigo-600/30 hover:text-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>

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
