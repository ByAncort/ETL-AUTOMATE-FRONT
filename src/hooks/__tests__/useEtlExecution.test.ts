import { renderHook, waitFor, act } from '@testing-library/react';
import { useEtlExecution } from '../useEtlExecution';
import { runEtlById } from '../../services/etlService';

jest.mock('../../services/etlService');

const mockedRunEtlById = runEtlById as jest.MockedFunction<typeof runEtlById>;

describe('useEtlExecution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with idle phase', () => {
    const { result } = renderHook(() => useEtlExecution());

    expect(result.current.phase).toBe('idle');
    expect(result.current.progress).toBe(0);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should execute ETL successfully', async () => {
    const etlResponse = {
      integrationId: 1, sourceApiId: 1, targetApiId: 2,
      totalRecords: 100, transformedRecords: 100, loadedRecords: 100, errors: [],
    };
    mockedRunEtlById.mockResolvedValueOnce(etlResponse);

    const { result } = renderHook(() => useEtlExecution());

    act(() => { result.current.execute(1); });

    await waitFor(() => expect(result.current.phase).not.toBe('idle'));

    await waitFor(() => expect(result.current.phase).toBe('done'));

    expect(result.current.progress).toBe(100);
    expect(result.current.result).toEqual(etlResponse);
    expect(result.current.error).toBeNull();
    expect(mockedRunEtlById).toHaveBeenCalledWith(1);
  });

  it('should handle ETL with errors', async () => {
    const etlResponse = {
      integrationId: 1, sourceApiId: 1, targetApiId: 2,
      totalRecords: 100, transformedRecords: 80, loadedRecords: 80, errors: ['Some errors'],
    };
    mockedRunEtlById.mockResolvedValueOnce(etlResponse);

    const { result } = renderHook(() => useEtlExecution());

    act(() => { result.current.execute(1); });

    await waitFor(() => expect(result.current.phase).toBe('error'));

    expect(result.current.error).toBe('Se cargaron 80 de 100 registros');
    expect(result.current.result).toEqual(etlResponse);
  });

  it('should handle exception during execution', async () => {
    mockedRunEtlById.mockRejectedValueOnce(new Error('Connection refused'));

    const { result } = renderHook(() => useEtlExecution());

    act(() => { result.current.execute(1); });

    await waitFor(() => expect(result.current.phase).toBe('error'));

    expect(result.current.error).toBe('Connection refused');
    expect(result.current.result).toBeNull();
  });

  it('should handle unknown error type', async () => {
    mockedRunEtlById.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useEtlExecution());

    act(() => { result.current.execute(1); });

    await waitFor(() => expect(result.current.phase).toBe('error'));

    expect(result.current.error).toBe('Error desconocido al ejecutar ETL');
  });

  it('should reset state', async () => {
    const etlResponse = {
      integrationId: 1, sourceApiId: 1, targetApiId: 2,
      totalRecords: 10, transformedRecords: 10, loadedRecords: 10, errors: [],
    };
    mockedRunEtlById.mockResolvedValueOnce(etlResponse);

    const { result } = renderHook(() => useEtlExecution());

    act(() => { result.current.execute(1); });
    await waitFor(() => expect(result.current.phase).toBe('done'));

    act(() => { result.current.reset(); });

    expect(result.current.phase).toBe('idle');
    expect(result.current.progress).toBe(0);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
