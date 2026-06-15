import { fetchLogs } from '../logService';

jest.mock('axios');

import axios from 'axios';

beforeEach(() => {
  jest.clearAllMocks();
});

function mockAxiosGet() {
  const instance = (axios.create as jest.Mock)();
  return instance.get as jest.Mock;
}

describe('logService', () => {
  describe('fetchLogs', () => {
    it('should GET /api/integrations/logs and return log entries', async () => {
      const logs = [
        { timestamp: '2024-01-01T00:00:00Z', level: 'INFO', message: 'Test log' },
      ];
      const mockGet = mockAxiosGet();
      mockGet.mockResolvedValueOnce({ data: logs });

      const result = await fetchLogs();

      expect(mockGet).toHaveBeenCalledWith('/api/integrations/logs');
      expect(result).toEqual(logs);
    });

    it('should propagate errors', async () => {
      const mockGet = mockAxiosGet();
      mockGet.mockRejectedValueOnce(new Error('Failed to fetch'));

      await expect(fetchLogs()).rejects.toThrow('Failed to fetch');
    });
  });
});
