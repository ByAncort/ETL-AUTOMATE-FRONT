import { useState, useRef, useEffect } from 'react';
import { Bell, Plus, Search, User, LogOut, X, Loader2, Sun, Moon, Shield, ShieldOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNewIntegration?: () => void;
  onLogout?: () => void;
}

export default function Header({ title = 'ETL Automate', subtitle = 'Plataforma de Integración', onNewIntegration, onLogout }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
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
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header 
      className="flex items-center justify-between px-4 lg:px-6 py-3 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]"
      role="banner"
    >
      <div className="min-w-0">
        <h1 className="text-lg lg:text-xl font-bold text-[var(--text-primary)] tracking-tight truncate">
          {title}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 hidden sm:block">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search 
            size={14} 
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
              isSearchFocused ? 'text-blue-400' : 'text-[var(--text-muted)]'
            )} 
            aria-hidden="true"
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
              'bg-[var(--bg-tertiary)] border rounded-lg pl-9 pr-8 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]',
              'w-40 lg:w-52 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
              'border-[var(--border-color)] hover:border-[var(--border-hover)]',
              isSearchFocused && 'border-blue-500/50 bg-[var(--bg-tertiary)]'
            )}
            aria-label="Buscar integraciones"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                searchRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-0.5"
              aria-label="Limpiar búsqueda"
            >
              <X size={12} />
            </button>
          )}
          {isSearching && (
            <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" aria-hidden="true" />
          )}
        </form>

        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg',
            'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)]',
            'hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]'
          )}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
        </button>

        <button
          className={cn(
            'relative flex items-center justify-center w-9 h-9 rounded-lg',
            'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)]',
            'hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]'
          )}
          aria-label="Notificaciones"
        >
          <Bell size={16} aria-hidden="true" />
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" 
            aria-hidden="true"
          />
        </button>

        <button
          onClick={onNewIntegration}
          className={cn(
            'flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg',
            'bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold',
            'transition-all duration-200 shadow-lg shadow-blue-900/30',
            'hover:shadow-blue-700/40 hover:scale-[1.02] active:scale-95',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#0d1117]'
          )}
        >
          <Plus size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Nueva</span>
          <span className="sr-only lg:not-sr-only">Integración</span>
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'flex items-center gap-2 p-1 rounded-lg',
              'hover:bg-[var(--bg-tertiary)] transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
            )}
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            aria-label="Menú de usuario"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
              <User size={16} aria-hidden="true" />
            </div>
          </button>

          {showUserMenu && (
            <div 
              className={cn(
                'absolute right-0 top-full mt-2 w-48 rounded-lg',
                'bg-[var(--card-bg)] border border-[var(--border-color)] shadow-xl shadow-black/30',
                'overflow-hidden z-50'
              )}
              role="menu"
              aria-label="Menú de usuario"
            >
              <div className="px-3 py-2.5 border-b border-[var(--border-color)]">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{userData?.name || userData?.username || 'Usuario'}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{userData?.email || 'usuario@etlautomate.com'}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setViewAdmin(!viewAdmin)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2.5 text-sm',
                    viewAdmin 
                      ? 'text-purple-400 bg-purple-500/10' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                    'transition-colors duration-200',
                    'focus:outline-none focus:bg-[var(--bg-tertiary)]'
                  )}
                  role="menuitem"
                >
                  {viewAdmin ? <ShieldOff size={14} aria-hidden="true" /> : <Shield size={14} aria-hidden="true" />}
                  <span>{viewAdmin ? 'Cambiar a Usuario' : 'Cambiar a Admin'}</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)]',
                  'hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200',
                  'focus:outline-none focus:bg-[var(--bg-tertiary)]'
                )}
                role="menuitem"
              >
                {isLoggingOut ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <LogOut size={14} aria-hidden="true" />
                )}
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-spin { animation: none; }
          .animate-pulse { animation: none; }
          .transition-all, .transition-colors { transition: none; }
          .scale-[1.02], .scale-95 { transform: none; }
        }
        @media (max-width: 640px) {
          input[type="search"]::-webkit-search-decoration,
          input[type="search"]::-webkit-search-cancel-button,
          input[type="search"]::-webkit-search-results-button,
          input[type="search"]::-webkit-search-results-decoration {
            -webkit-appearance: none;
          }
        }
      `}</style>
    </header>
  );
}
