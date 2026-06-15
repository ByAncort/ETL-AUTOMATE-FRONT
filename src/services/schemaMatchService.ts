/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import type { FeedbackRequest, FeedbackResponse, SchemaMatch } from '../types';

export async function submitFeedback(data: FeedbackRequest): Promise<FeedbackResponse> {
  const res = await api.post('/api/schema-matches/feedback', data);
  return res.data;
}

export async function fetchSchemaMatches(integrationId: number): Promise<SchemaMatch[]> {
  const res = await api.get(`/api/schema-matches/integration/${integrationId}`);
  return res.data;
}

export async function runMatching(integrationId: number): Promise<any> {
  const res = await api.post(`/api/integrations/connections/${integrationId}/run-matching`);
  return res.data;
}
