import { runEtl, runEtlById } from '../etlService';

jest.mock('axios');

import axios from 'axios';

beforeEach(() => {
  jest.clearAllMocks();
});

function mockAxiosPost() {
  const instance = (axios.create as jest.Mock)();
  return instance.post as jest.Mock;
}

describe('etlService', () => {
  describe('runEtl', () => {
    it('should POST to /api/etl/run with data', async () => {
      const etlRequest = { integrationId: 1 };
      const etlResponse = {
        integrationId: 1, sourceApiId: 1, targetApiId: 2,
        totalRecords: 100, transformedRecords: 95, loadedRecords: 95, errors: [],
      };
      const mockPost = mockAxiosPost();
      mockPost.mockResolvedValueOnce({ data: etlResponse });

      const result = await runEtl(etlRequest);

      expect(mockPost).toHaveBeenCalledWith('/api/etl/run', etlRequest);
      expect(result).toEqual(etlResponse);
    });

    it('should propagate errors', async () => {
      const mockPost = mockAxiosPost();
      mockPost.mockRejectedValueOnce(new Error('Network error'));

      await expect(runEtl({ integrationId: 1 })).rejects.toThrow('Network error');
    });
  });

  describe('runEtlById', () => {
    it('should POST to /api/etl/run/{id}', async () => {
      const etlResponse = {
        integrationId: 1, sourceApiId: 1, targetApiId: 2,
        totalRecords: 50, transformedRecords: 50, loadedRecords: 50, errors: [],
      };
      const mockPost = mockAxiosPost();
      mockPost.mockResolvedValueOnce({ data: etlResponse });

      const result = await runEtlById(1);

      expect(mockPost).toHaveBeenCalledWith('/api/etl/run/1');
      expect(result).toEqual(etlResponse);
    });
  });
});
