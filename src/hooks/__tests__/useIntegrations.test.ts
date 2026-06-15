/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useIntegrations } from '../useIntegrations';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

const mockIntegration = {
  id: 1,
  apiA: 1,
  apiB: 2,
  description: 'Test Integration',
  status: 'active' as const,
  createdAt: '2024-01-01',
};

describe('useIntegrations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch integrations on mount', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockIntegration] });

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.integrations).toEqual([mockIntegration]);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error with response message', async () => {
    mockedApi.get.mockRejectedValueOnce({ response: { data: { message: 'API Error' } } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('API Error');
    consoleSpy.mockRestore();
  });

  it('should handle fetch error without response message', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('No se pudieron cargar las integraciones');
    consoleSpy.mockRestore();
  });

  it('should create integration', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({ data: mockIntegration });

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createIntegration({ apiA: 1, apiB: 2, description: 'Test' });
    });

    expect(result.current.integrations).toHaveLength(1);
    expect(mockedApi.post).toHaveBeenCalledWith('/api/integrations/connections', expect.any(Object));
  });

  it('should update integration', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockIntegration] });
    const updated = { ...mockIntegration, description: 'Updated' };
    mockedApi.post.mockResolvedValueOnce({ data: updated });

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateIntegration(1, { description: 'Updated' });
    });

    expect(result.current.integrations[0].description).toBe('Updated');
  });

  it('should delete integration', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockIntegration] });
    mockedApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.integrations).toHaveLength(1);

    await act(async () => {
      await result.current.deleteIntegration(1);
    });

    expect(result.current.integrations).toHaveLength(0);
    expect(mockedApi.delete).toHaveBeenCalledWith('/api/integrations/connections/1');
  });

  it('should handle create error', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockRejectedValueOnce({ response: { data: { message: 'Creation failed' } } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useIntegrations());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let res: any;
    await act(async () => {
      res = await result.current.createIntegration({ apiA: 1, apiB: 2, description: 'Test' });
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('Creation failed');
    consoleSpy.mockRestore();
  });
});
