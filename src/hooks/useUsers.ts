import { useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  status: string;
  roles: string[];
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching users', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      console.error('Error deleting user', err);
    }
  };

  return { users, loading, error, refetch: fetchUsers, deleteUser };
}
