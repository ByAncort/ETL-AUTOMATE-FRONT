import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, User, LogOut, X, Shield, ShieldOff, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { cn } from '../lib/utils';

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
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userData, isAdmin, viewAdmin, setViewAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside =
        menuRef.current && !menuRef.current.contains(target) &&
        userMenuRef.current && !userMenuRef.current.contains(target);
      if (isOutside) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    if (!showUserMenu && userMenuRef.current) {
      const rect = userMenuRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setShowUserMenu(!showUserMenu);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-slate-200/70" role="banner">
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
              isSearchFocused ? 'text-[--accent]' : 'text-slate-400'
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
              'rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder-slate-400',
              'w-40 lg:w-48 transition-all duration-200',
              'focus:outline-none focus:border-[--accent] focus:bg-white focus:ring-1 focus:ring-[--accent]/20',
            )}
            aria-label="Buscar"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[--accent] text-white text-sm font-medium hover:brightness-110 transition-all active:scale-[0.97]"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Nueva</span>
            <span className="sr-only lg:not-sr-only">Integración</span>
          </button>
        )}

        <div ref={userMenuRef} className="relative">
          <button
            onClick={toggleMenu}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors',
              'focus:outline-none focus:ring-1 focus:ring-[--accent]/20',
            )}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            aria-label="Menú de usuario"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[--accent] text-white text-xs font-semibold">
              {(userData?.name || userData?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={12} className={cn(
              'text-slate-500 transition-transform duration-200',
              showUserMenu && 'rotate-180'
            )} />
          </button>

          {showUserMenu && createPortal(
            <div
              ref={menuRef}
              className="fixed w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-[9999] overflow-hidden"
              style={{ top: menuPos.top, right: menuPos.right }}
              role="menu"
            >
              <div className="px-3 py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 truncate">{userData?.name || userData?.username || 'Usuario'}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{userData?.email || ''}</p>
              </div>
              <div className="py-1">
                {isAdmin && (
                  <button
                    onClick={() => setViewAdmin(!viewAdmin)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                      viewAdmin ? 'text-[--accent] bg-[--accent]/5' : 'text-slate-600 hover:bg-slate-50'
                    )}
                    role="menuitem"
                  >
                    {viewAdmin ? <ShieldOff size={14} className="flex-shrink-0" /> : <Shield size={14} className="flex-shrink-0" />}
                    <span>{viewAdmin ? 'Modo Usuario' : 'Modo Admin'}</span>
                  </button>
                )}
                <button
                  onClick={() => { setShowUserMenu(false); navigate('/dashboard/profile'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  role="menuitem"
                >
                  <User size={14} className="flex-shrink-0" />
                  <span>Editar Perfil</span>
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  role="menuitem"
                >
                  <LogOut size={14} className="flex-shrink-0" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>
    </header>
  );
}
