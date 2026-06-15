import { runEtl, runEtlById } from '../etlService';

jest.mock('axios');

import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('etlService', () => {
  describe('runEtl', () => {
    it('should POST to /api/etl/run with data', async () => {
      const etlRequest = { integrationId: 1 };
      const etlResponse = {
        integrationId: 1, sourceApiId: 1, targetApiId: 2,
        totalRecords: 100, transformedRecords: 95, loadedRecords: 95, errors: [],
      };
      const axiosInstance = mockedAxios.create();
      axiosInstance.post.mockResolvedValueOnce({ data: etlResponse });

      const result = await runEtl(etlRequest);

      expect(axiosInstance.post).toHaveBeenCalledWith('/api/etl/run', etlRequest);
      expect(result).toEqual(etlResponse);
    });

    it('should propagate errors', async () => {
      const axiosInstance = mockedAxios.create();
      axiosInstance.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(runEtl({ integrationId: 1 })).rejects.toThrow('Network error');
    });
  });

  describe('runEtlById', () => {
    it('should POST to /api/etl/run/{id}', async () => {
      const etlResponse = {
        integrationId: 1, sourceApiId: 1, targetApiId: 2,
        totalRecords: 50, transformedRecords: 50, loadedRecords: 50, errors: [],
      };
      const axiosInstance = mockedAxios.create();
      axiosInstance.post.mockResolvedValueOnce({ data: etlResponse });

      const result = await runEtlById(1);

      expect(axiosInstance.post).toHaveBeenCalledWith('/api/etl/run/1');
      expect(result).toEqual(etlResponse);
    });
  });
});
