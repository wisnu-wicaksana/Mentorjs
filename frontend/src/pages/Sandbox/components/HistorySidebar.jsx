import { Plus, Trash2, LogOut, MessageSquare, BookOpen } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

export const HistorySidebar = ({ 
  sessions = [], 
  activeSessionId, 
  onSelectSession, 
  onCreateSession, 
  onDeleteSession 
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-950 border-r border-gray-900 flex flex-col justify-between h-full shrink-0 select-none font-sans">
      
      {/* Bagian Atas: Header Sidebar */}
      <div>
        <div className="p-4 border-b border-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-violet-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-gray-200">Riwayat Belajar</span>
          </div>
          
          {/* Tombol Buat Sesi Baru */}
          <button
            type="button"
            onClick={onCreateSession}
            title="Mulai Sesi Baru"
            className="p-1.5 rounded-lg border border-gray-800 bg-slate-900/60 hover:bg-slate-900 hover:border-violet-500/40 text-violet-400 hover:text-violet-300 transition-all cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Daftar Sesi Belajar */}
        <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
          {sessions.length === 0 ? (
            <div className="py-8 text-center text-[10px] text-gray-600 italic">
              Belum ada riwayat sesi.
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-violet-950/40 border border-violet-800/40 text-violet-300' 
                      : 'hover:bg-slate-900/50 border border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <div className="flex items-center gap-2 truncate max-w-[80%]">
                    <MessageSquare size={13} className={isActive ? 'text-violet-400' : 'text-gray-600'} />
                    <span className="truncate">{session.title}</span>
                  </div>

                  {/* Tombol Hapus Sesi (Muncul saat hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Mencegah memicu klik pada div pembungkus
                      onDeleteSession(session.id);
                    }}
                    title="Hapus Sesi"
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-950/40 hover:text-red-400 text-gray-600 rounded transition-all cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bagian Bawah: Informasi Akun & Logout */}
      <div className="p-3 border-t border-gray-900 bg-slate-950/80 flex items-center justify-between">
        <div className="flex flex-col truncate max-w-[70%]">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Pengguna</span>
          <span className="text-xs text-gray-300 truncate font-semibold">{user?.username || 'Guest'}</span>
        </div>

        {/* Tombol Logout */}
        <button
          type="button"
          onClick={logout}
          title="Keluar Akun"
          className="p-1.5 hover:bg-red-950/40 text-gray-500 hover:text-red-400 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-900/30"
        >
          <LogOut size={14} />
        </button>
      </div>

    </div>
  );
};
