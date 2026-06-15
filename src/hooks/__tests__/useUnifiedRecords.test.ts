import { renderHook, waitFor, act } from '@testing-library/react';
import { useUnifiedRecords } from '../useUnifiedRecords';
import api from '../../services/api';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('useUnifiedRecords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSchemaMatch = {
    id: 1,
    sourceField: 'firstName',
    targetField: 'nombre',
    confidence: '0.95',
    status: 'PENDING',
  };

  it('should fetch and map records on mount', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockSchemaMatch] });

    const { result } = renderHook(() => useUnifiedRecords());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.records).toHaveLength(1);
    expect(result.current.records[0].unifiedId).toBe('UNI-1');
    expect(result.current.records[0].entityName).toBe('firstName a nombre');
    expect(result.current.records[0].originA).toBe('firstName');
    expect(result.current.records[0].originB).toBe('nombre');
    expect(result.current.records[0].confidence).toBe(95);
    expect(result.current.records[0].highlight).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle empty response', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useUnifiedRecords());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.records).toEqual([]);
  });

  it('should handle fetch error', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useUnifiedRecords());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.records).toEqual([]);
    expect(result.current.error).toBe('No se pudieron cargar los registros unificados');
    consoleSpy.mockRestore();
  });

  it('should handle confidence as string parseFloat', async () => {
    const matchWithStringConfidence = { ...mockSchemaMatch, confidence: '0.5', id: 2 };
    mockedApi.get.mockResolvedValueOnce({ data: [matchWithStringConfidence] });

    const { result } = renderHook(() => useUnifiedRecords());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.records[0].confidence).toBe(50);
  });

  it('should refetch records', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: [mockSchemaMatch] });

    const { result } = renderHook(() => useUnifiedRecords());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.records).toHaveLength(1);

    mockedApi.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.records).toHaveLength(0);
  });
});
