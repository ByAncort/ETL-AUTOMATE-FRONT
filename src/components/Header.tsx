import { useState, useRef, useEffect } from 'react';
import { Plus, Search, User, LogOut, X, Shield, ShieldOff, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { cn } from '../lib/utils';
import ChangePasswordModal from './ChangePasswordModal';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNewIntegration?: () => void;
  onLogout?: () => void;
}

export default function Header({ title = 'ETL Automate', subtitle = 'Plataforma de Integración', onNewIntegration, onLogout }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { userData, isAdmin, viewAdmin, setViewAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 lg:px-6 h-14 bg-white border-b border-slate-200" role="banner">
      <div className="min-w-0">
        <h1 className="text-base lg:text-lg font-bold text-slate-900 tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search
            size={14}
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
              isSearchFocused ? 'text-blue-500' : 'text-slate-400'
            )}
          />
          <input
            ref={searchRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Buscar..."
            className={cn(
              'bg-slate-50 border rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400',
              'w-40 lg:w-48 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500',
              'border-slate-200 hover:border-slate-300'
            )}
            aria-label="Buscar"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              aria-label="Limpiar búsqueda"
            >
              <X size={12} />
            </button>
          )}
        </form>

        <NotificationBell />

        {onNewIntegration && (
          <button
            onClick={onNewIntegration}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva</span>
            <span className="sr-only lg:not-sr-only">Integración</span>
          </button>
        )}

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              'bg-blue-600 text-white text-sm font-medium',
              'hover:bg-blue-500 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/30'
            )}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            aria-label="Menú de usuario"
          >
            <User size={16} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 animate-in" role="menu">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 truncate">{userData?.name || userData?.username || 'Usuario'}</p>
                <p className="text-xs text-slate-500 truncate">{userData?.email || ''}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setViewAdmin(!viewAdmin)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors',
                    viewAdmin ? 'text-violet-600 bg-violet-50' : 'text-slate-600 hover:bg-slate-50'
                  )}
                  role="menuitem"
                >
                  {viewAdmin ? <ShieldOff size={14} /> : <Shield size={14} />}
                  <span>{viewAdmin ? 'Modo Usuario' : 'Modo Admin'}</span>
                </button>
              )}
              <button
                onClick={() => { setShowUserMenu(false); setShowPasswordModal(true); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                role="menuitem"
              >
                <KeyRound size={14} />
                <span>Cambiar Contraseña</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                role="menuitem"
              >
                <LogOut size={14} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </header>
  );
}
