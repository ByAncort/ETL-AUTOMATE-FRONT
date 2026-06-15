/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApiConnections } from '../useApiConnections';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

const mockConnection = {
  id: 1,
  method: 'GET',
  url: 'https://api.example.com/data',
  description: 'Test connection',
  pathParams: null,
  queryParams: null,
  body: null,
  createdAt: '2024-01-01',
  authType: 'none',
  authHeader: '',
  authHeaderValue: null,
  authApiId: null,
  authApiUrl: null,
  authValue: null,
};

describe('useApiConnections', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch connections on mount', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConnection] });

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.connections).toEqual([mockConnection]);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    mockedApi.get.mockRejectedValueOnce({ response: { data: { message: 'Connection error' } } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Connection error');
    consoleSpy.mockRestore();
  });

  it('should handle fetch error without response', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('No se pudieron cargar las conexiones');
    consoleSpy.mockRestore();
  });

  it('should create connection', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({ data: mockConnection });

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createConnection({
        method: 'GET', url: 'https://api.example.com/data', pathParams: '', description: 'Test', authType: 'none', authHeader: '', body: '', authValue: '',
      });
    });

    expect(result.current.connections).toHaveLength(1);
    expect(mockedApi.post).toHaveBeenCalledWith('/api-registry', expect.any(Object));
  });

  it('should delete connection', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConnection] });
    mockedApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.connections).toHaveLength(1);

    await act(async () => {
      await result.current.deleteConnection(1);
    });

    expect(result.current.connections).toHaveLength(0);
    expect(mockedApi.delete).toHaveBeenCalledWith('/api-registry/1');
  });

  it('should test connection successfully', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConnection] });
    mockedApi.post.mockResolvedValueOnce({ data: { status: 'ok' }, status: 200 });

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let testResult: any;
    await act(async () => {
      testResult = await result.current.testConnection(mockConnection);
    });

    expect(testResult.success).toBe(true);
    expect(testResult.status).toBe(200);
    expect(testResult.data).toEqual({ status: 'ok' });
  });

  it('should test connection with failure', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConnection] });
    const error = new Error('Connection failed');
    (error as any).response = { data: 'Server error', status: 500 };
    mockedApi.post.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useApiConnections());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let testResult: any;
    await act(async () => {
      testResult = await result.current.testConnection(mockConnection);
    });

    expect(testResult.success).toBe(false);
    expect(testResult.error).toBe('Connection failed');
    expect(testResult.status).toBe(500);
  });
});
