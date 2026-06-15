import { renderHook, waitFor, act } from '@testing-library/react';
import { useUsers } from '../useUsers';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('useUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users on mount', async () => {
    const users = [
      { id: 1, username: 'admin', email: 'admin@test.com', emailVerified: true, status: 'ACTIVE', roles: ['ROLE_ADMIN'] },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: users });

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual(users);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe('No se pudieron cargar los usuarios');
    consoleSpy.mockRestore();
  });

  it('should delete user and remove from list', async () => {
    const users = [
      { id: 1, username: 'user1', email: 'u1@test.com', emailVerified: true, status: 'ACTIVE', roles: ['USER'] as string[] },
      { id: 2, username: 'user2', email: 'u2@test.com', emailVerified: true, status: 'ACTIVE', roles: ['USER'] as string[] },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: users });
    mockedApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toHaveLength(2);

    await act(async () => {
      await result.current.deleteUser(1);
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].id).toBe(2);
    expect(mockedApi.delete).toHaveBeenCalledWith('/api/users/1');
  });

  it('should refetch users', async () => {
    const initialUsers = [{ id: 1, username: 'u1', email: 'u1@test.com', emailVerified: true, status: 'ACTIVE', roles: ['USER'] }];
    const updatedUsers = [
      { id: 1, username: 'u1', email: 'u1@test.com', emailVerified: true, status: 'ACTIVE', roles: ['USER'] },
      { id: 2, username: 'u2', email: 'u2@test.com', emailVerified: true, status: 'ACTIVE', roles: ['USER'] },
    ];
    mockedApi.get.mockResolvedValueOnce({ data: initialUsers });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toHaveLength(1);

    mockedApi.get.mockResolvedValueOnce({ data: updatedUsers });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.users).toHaveLength(2);
  });
});
