import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface UserData {
  id: number;
  username: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  isAdmin: boolean;
  viewAdmin: boolean;
  username: string | null;
  userData: UserData | null;
  login: (token: string) => void;
  logout: () => void;
  setViewAdmin: (value: boolean) => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): { roles?: string[]; sub?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')));
    return decoded;
  } catch (e) {
    console.error('Token decode error:', e);
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const storedUsername = localStorage.getItem('username');
  const storedViewAdmin = localStorage.getItem('viewAdmin') === 'true';
  const initialAdmin = storedToken ? (decodeToken(storedToken)?.roles?.includes('ROLE_ADMIN') || false) : false;
  
  const [token, setToken] = useState<string | null>(storedToken);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storedToken);
  const [isAdmin, setIsAdmin] = useState<boolean>(initialAdmin);
  const [viewAdmin, setViewAdmin] = useState<boolean>(storedViewAdmin);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = async (username: string, authToken: string) => {
    try {
      const response = await api.get(`/api/users/username/${username}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      setUserData(response.data);
    } catch (e) {
      console.error('Error fetching user data:', e);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      console.log('Token decoded:', decoded);
      const adminRole = decoded?.roles?.includes('ROLE_ADMIN') || false;
      console.log('Is admin:', adminRole, 'roles:', decoded?.roles);
      setIsAdmin(adminRole);
      
      const username = decoded?.sub as string;
      if (username) {
        localStorage.setItem('username', username);
        fetchUserData(username, token);
      }
    } else if (storedUsername) {
      fetchUserData(storedUsername, storedToken || '');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('viewAdmin', String(viewAdmin));
  }, [viewAdmin]);

  const handleSetViewAdmin = (value: boolean) => {
    if (isAdmin || !value) {
      setViewAdmin(value);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    const decoded = decodeToken(newToken);
    const adminRole = decoded?.roles?.includes('ROLE_ADMIN') || false;
    setIsAdmin(adminRole);
    setViewAdmin(false);
    
    const username = decoded?.sub as string;
    if (username) {
      localStorage.setItem('username', username);
      fetchUserData(username, newToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setViewAdmin(false);
    setUserData(null);
  };

  const refetchUser = async () => {
    const activeToken = token || localStorage.getItem('token');
    const activeUsername = localStorage.getItem('username') || storedUsername;
    if (activeUsername && activeToken) {
      await fetchUserData(activeUsername, activeToken);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, isAdmin, viewAdmin, username: storedUsername, userData, login, logout, setViewAdmin: handleSetViewAdmin, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
