/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useLlmConfigs } from '../useLlmConfigs';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

const mockConfig = {
  id: 1,
  name: 'GPT-4',
  provider: 'openai',
  apiKey: 'sk-xxxx',
  baseUrl: 'https://api.openai.com',
  modelName: 'gpt-4',
  isDefault: true,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('useLlmConfigs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch configs on mount', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConfig] });

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.configs).toEqual([mockConfig]);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    mockedApi.get.mockRejectedValueOnce({ response: { data: { message: 'Server error' } } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Server error');
    consoleSpy.mockRestore();
  });

  it('should create config', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });
    mockedApi.post.mockResolvedValueOnce({ data: mockConfig });

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let res: any;
    await act(async () => {
      res = await result.current.createConfig({
        name: 'GPT-4', provider: 'openai', apiKey: 'sk-xxxx', baseUrl: 'https://api.openai.com', modelName: 'gpt-4', isDefault: true,
      });
    });

    expect(res.success).toBe(true);
    expect(result.current.configs).toHaveLength(1);
    expect(mockedApi.post).toHaveBeenCalledWith('/api/llm-configs', expect.any(Object));
  });

  it('should update config', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConfig] });
    const updatedConfig = { ...mockConfig, name: 'GPT-4 Turbo' };
    mockedApi.put.mockResolvedValueOnce({ data: updatedConfig });

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateConfig(1, {
        name: 'GPT-4 Turbo', provider: 'openai', apiKey: 'sk-xxxx', baseUrl: 'https://api.openai.com', modelName: 'gpt-4', isDefault: true,
      });
    });

    expect(result.current.configs[0].name).toBe('GPT-4 Turbo');
    expect(mockedApi.put).toHaveBeenCalledWith('/api/llm-configs/1', expect.any(Object));
  });

  it('should delete config', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockConfig] });
    mockedApi.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.configs).toHaveLength(1);

    await act(async () => {
      await result.current.deleteConfig(1);
    });

    expect(result.current.configs).toHaveLength(0);
    expect(mockedApi.delete).toHaveBeenCalledWith('/api/llm-configs/1');
  });

  it('should set default config', async () => {
    const config2 = { ...mockConfig, id: 2, isDefault: false };
    mockedApi.get.mockResolvedValueOnce({ data: [mockConfig, config2] });
    mockedApi.patch.mockResolvedValueOnce({ data: { ...config2, isDefault: true } });

    const { result } = renderHook(() => useLlmConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.setDefault(2);
    });

    expect(mockedApi.patch).toHaveBeenCalledWith('/api/llm-configs/2/default');
    expect(result.current.configs.find(c => c.id === 2)?.isDefault).toBe(true);
    expect(result.current.configs.find(c => c.id === 1)?.isDefault).toBe(false);
  });
});
