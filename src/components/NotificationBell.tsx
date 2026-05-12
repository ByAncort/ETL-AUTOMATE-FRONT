import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCheck, GitMerge, Plug, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { subscribe, markAsRead, markAllAsRead, Notification } from '../services/notificationService';
import { cn } from '../lib/utils';

const typeConfig: Record<Notification['type'], { icon: typeof Plug; color: string }> = {
  integration: { icon: GitMerge, color: 'text-blue-600' },
  connection: { icon: Plug, color: 'text-emerald-600' },
  system: { icon: Info, color: 'text-violet-600' },
  success: { icon: CheckCircle, color: 'text-emerald-600' },
  error: { icon: AlertCircle, color: 'text-red-500' },
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'ahora';
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return 'hace 1 min';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return 'hace 1 hora';
  if (hours < 24) return `hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return `hace ${days} día${days > 1 ? 's' : ''}`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = subscribe(setNotifications);
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-lg',
          'bg-white border border-slate-200 text-slate-500',
          'hover:text-slate-700 hover:border-slate-300 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/30'
        )}
        aria-label="Notificaciones"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 animate-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-500"
              >
                <CheckCheck size={14} />
                Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <Bell size={24} className="text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Sin notificaciones</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0',
                      'hover:bg-slate-50 transition-colors cursor-pointer',
                      !n.read && 'bg-blue-50/50'
                    )}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon size={16} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.timestamp)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(n.id);
                      }}
                      className="flex-shrink-0 p-0.5 rounded text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
