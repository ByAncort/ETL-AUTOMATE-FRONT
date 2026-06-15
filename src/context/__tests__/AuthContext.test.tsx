import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function createToken(payload: Record<string, any>): string {
  const encoded = btoa(JSON.stringify(payload));
  return `header.${encoded}.signature`;
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('should not be authenticated initially without token', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.viewAdmin).toBe(false);
  });

  it('should authenticate user on login', async () => {
    const token = createToken({ sub: 'testuser', roles: ['ROLE_USER'] });
    mockedApi.get.mockResolvedValueOnce({ data: { id: 1, username: 'testuser', email: 'test@test.com', name: 'Test' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      result.current.login(token);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(token);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.username).toBe('testuser');
  });

  it('should set admin role from token', async () => {
    const token = createToken({ sub: 'admin', roles: ['ROLE_ADMIN'] });
    mockedApi.get.mockResolvedValueOnce({ data: { id: 1, username: 'admin', email: 'admin@test.com', name: 'Admin' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      result.current.login(token);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  it('should logout and clear state', async () => {
    const token = createToken({ sub: 'testuser', roles: ['ROLE_USER'] });
    mockedApi.get.mockResolvedValueOnce({ data: { id: 1, username: 'testuser', email: 'test@test.com', name: 'Test' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      result.current.login(token);
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.viewAdmin).toBe(false);
    expect(localStorageMock.getItem('token')).toBeNull();
    expect(localStorageMock.getItem('username')).toBeNull();
  });

  it('should handle setViewAdmin for admin users', async () => {
    const token = createToken({ sub: 'admin', roles: ['ROLE_ADMIN'] });
    mockedApi.get.mockResolvedValueOnce({ data: { id: 1, username: 'admin', email: 'admin@test.com', name: 'Admin' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      result.current.login(token);
    });

    act(() => {
      result.current.setViewAdmin(true);
    });

    expect(result.current.viewAdmin).toBe(true);

    act(() => {
      result.current.setViewAdmin(false);
    });

    expect(result.current.viewAdmin).toBe(false);
  });

  it('should not set viewAdmin for non-admin', async () => {
    const token = createToken({ sub: 'user', roles: ['ROLE_USER'] });
    mockedApi.get.mockResolvedValueOnce({ data: { id: 2, username: 'user', email: 'user@test.com', name: 'User' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      result.current.login(token);
    });

    act(() => {
      result.current.setViewAdmin(true);
    });

    expect(result.current.viewAdmin).toBe(false);
  });

  it('should throw error when useAuth is used outside provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider');
  });

  it('should restore session from localStorage', () => {
    const token = createToken({ sub: 'storeduser', roles: ['ROLE_USER'] });
    localStorageMock.setItem('token', token);
    localStorageMock.setItem('username', 'storeduser');
    localStorageMock.setItem('viewAdmin', 'false');

    mockedApi.get.mockResolvedValueOnce({ data: { id: 3, username: 'storeduser', email: 's@test.com', name: 'Stored' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(token);
    expect(result.current.username).toBe('storeduser');
  });

  it('should initialize admin from stored token', () => {
    const token = createToken({ sub: 'admin', roles: ['ROLE_ADMIN'] });
    localStorageMock.setItem('token', token);
    localStorageMock.setItem('username', 'admin');

    mockedApi.get.mockResolvedValueOnce({ data: { id: 1, username: 'admin', email: 'a@test.com', name: 'Admin' } });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    expect(result.current.isAdmin).toBe(true);
  });
});
