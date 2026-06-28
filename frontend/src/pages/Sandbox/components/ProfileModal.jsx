import { useState } from 'react';
import { X, Sparkles, User, Key, BarChart3, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { authAPI } from '../../../services/api';

export const ProfileModal = ({ isOpen, onClose, user, sessionsCount, onGoToAuth, onProfileUpdated }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Retrieve local runs count
  const runsCount = localStorage.getItem('mentorjs_run_count') || '0';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (password && password.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.updateProfile(
        username !== user?.username ? username : undefined, 
        password || undefined
      );

      if (response.status === 'success') {
        setSuccessMsg(response.message || 'Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
        if (onProfileUpdated && response.data) {
          onProfileUpdated(response.data);
        }
      } else {
        setErrorMsg(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content Card */}
      <div className="relative w-full max-w-md bg-slate-950/95 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-slate-900 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-violet-950/40 border border-violet-800/40 text-violet-400">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">Profile & Statistics</h2>
            <p className="text-[10px] text-gray-500">Manage account and monitor learning analytics</p>
          </div>
        </div>

        {/* Error/Success Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-start gap-2 mb-4 leading-relaxed">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-xs text-emerald-400 flex items-start gap-2 mb-4 leading-relaxed">
            <Sparkles size={14} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SECTION 1: LEARNING STATS */}
        <div className="space-y-3 mb-6">
          <h3 className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1.5">
            <BarChart3 size={12} />
            <span>Learning Analytics</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Stat Card 1: Sessions */}
            <div className="bg-slate-900/60 border border-gray-900 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sessions</span>
              <span className="text-2xl font-black text-violet-400 mt-1">{sessionsCount}</span>
            </div>

            {/* Stat Card 2: Code Runs */}
            <div className="bg-slate-900/60 border border-gray-900 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Code Runs</span>
              <span className="text-2xl font-black text-fuchsia-400 mt-1">{runsCount}</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-gray-900/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
            <span className="text-gray-500">Account Type:</span>
            <span className="font-semibold text-gray-300">{user ? 'Registered User' : 'Guest Student'}</span>
          </div>

          {user?.createdAt && (
            <div className="bg-slate-900/40 border border-gray-900/50 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
              <span className="text-gray-500">Member Since:</span>
              <span className="font-semibold text-gray-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* SECTION 2: EDIT ACCOUNT OR SIGN UP CARD */}
        {user ? (
          /* EDIT ACCOUNT FORM FOR REGISTERED USER */
          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-gray-900">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1.5 mb-1">
              <Key size={12} />
              <span>Update Credentials</span>
            </h3>

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <User size={13} />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-9 pr-4 py-2 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400">New Password (Optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Key size={13} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (Leave blank to keep current)"
                  className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-9 pr-4 py-2 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            {password && (
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Key size={13} />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-gray-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 pl-9 pr-4 py-2 rounded-lg text-xs text-white placeholder-gray-600 transition-all outline-none font-sans"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-2"
              size="sm"
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        ) : (
          /* UPGRADE ACCOUNT CARD FOR GUESTS */
          <div className="pt-5 border-t border-gray-900 text-center">
            <div className="bg-gradient-to-br from-violet-950/20 to-fuchsia-950/20 border border-violet-900/30 rounded-xl p-4 mb-2">
              <span className="inline-flex items-center gap-1 bg-violet-950/50 border border-violet-800/40 text-[9px] font-bold text-violet-400 px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                <Sparkles size={10} />
                <span>Keep your progress</span>
              </span>
              <h4 className="text-xs font-bold text-gray-200">Sync & Save Your History</h4>
              <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                Sign in or register to persist all code runs, keep your Socratic conversations synced, and access your workspace on any device.
              </p>
            </div>
            
            <button
              onClick={() => {
                onClose();
                if (onGoToAuth) onGoToAuth();
              }}
              className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-2 rounded-lg text-xs transition-all active:scale-98 shadow-lg hover:shadow-violet-600/20 select-none cursor-pointer"
            >
              Log In / Register
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
