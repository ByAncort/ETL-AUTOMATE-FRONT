import { fetchLogs } from '../logService';

jest.mock('axios');

import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('logService', () => {
  describe('fetchLogs', () => {
    it('should GET /api/integrations/logs and return log entries', async () => {
      const logs = [
        { timestamp: '2024-01-01T00:00:00Z', level: 'INFO', message: 'Test log' },
      ];
      const axiosInstance = mockedAxios.create();
      axiosInstance.get.mockResolvedValueOnce({ data: logs });

      const result = await fetchLogs();

      expect(axiosInstance.get).toHaveBeenCalledWith('/api/integrations/logs');
      expect(result).toEqual(logs);
    });

    it('should propagate errors', async () => {
      const axiosInstance = mockedAxios.create();
      axiosInstance.get.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(fetchLogs()).rejects.toThrow('Failed to fetch');
    });
  });
});
