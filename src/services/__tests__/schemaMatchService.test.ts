import api from '../api';
import { submitFeedback, fetchSchemaMatches, runMatching } from '../schemaMatchService';

jest.mock('../api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('schemaMatchService', () => {
  describe('submitFeedback', () => {
    it('should POST feedback and return response', async () => {
      const feedback = { matchId: 1, userApproved: true, reviewedBy: 1 };
      const response = {
        feedback: { id: 1, matchId: 1, userApproved: true, actualTarget: null, createdAt: '2024-01-01' },
        schemaMatch: { id: 1, integrationId: 1, sourceField: 'a', targetField: 'b', confidence: 0.95, status: 'ACCEPTED' as const, transformation: null, reviewedBy: 1, reviewedAt: '2024-01-01', createdAt: '2024-01-01' },
      };
      mockedApi.post.mockResolvedValueOnce({ data: response });

      const result = await submitFeedback(feedback);

      expect(mockedApi.post).toHaveBeenCalledWith('/api/schema-matches/feedback', feedback);
      expect(result).toEqual(response);
    });
  });

  describe('fetchSchemaMatches', () => {
    it('should GET schema matches by integration id', async () => {
      const matches = [
        { id: 1, integrationId: 1, sourceField: 'a', targetField: 'b', confidence: 0.9, status: 'PENDING' as const, transformation: null, reviewedBy: null, reviewedAt: null, createdAt: '2024-01-01' },
      ];
      mockedApi.get.mockResolvedValueOnce({ data: matches });

      const result = await fetchSchemaMatches(1);

      expect(mockedApi.get).toHaveBeenCalledWith('/api/schema-matches/integration/1');
      expect(result).toEqual(matches);
    });
  });

  describe('runMatching', () => {
    it('should POST to run matching for integration', async () => {
      mockedApi.post.mockResolvedValueOnce({ data: { status: 'completed' } });

      const result = await runMatching(1);

      expect(mockedApi.post).toHaveBeenCalledWith('/api/integrations/connections/1/run-matching');
      expect(result).toEqual({ status: 'completed' });
    });
  });
});
