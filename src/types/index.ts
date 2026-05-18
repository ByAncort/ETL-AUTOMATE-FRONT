export type IntegrationStatus = 'active' | 'pending' | 'error' | 'inactive';

export interface MLBadge {
  label: string;
  score: number;
}

export interface Integration {
  id: string;
  name: string;
  source: string;
  status: IntegrationStatus;
  lastRun: string;
  recordsProcessed: string;
  mlBadge?: MLBadge;
  jsonPreview?: string;
}

export interface IntegrationResponse {
  id: number;
  apiA: number;
  apiB: number;
  description: string;
  status: 'pending' | 'active' | 'inactive' | 'error';
  createdAt: string;
}

export interface UnifiedRecord {
  unifiedId: string;
  entityName: string;
  originA: string;
  originB: string;
  confidence: number;
  highlight?: boolean;
}

export interface SchemaField {
  key: string;
  type: string;
}

export interface ApiField {
  name: string;
  type: string;
}

export type SchemaMatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface SchemaMatch {
  id: number;
  integrationId: number;
  sourceField: string;
  targetField: string;
  confidence: number;
  status: SchemaMatchStatus;
  transformation: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface FeedbackRequest {
  matchId: number;
  userApproved: boolean;
  actualTarget?: string;
  reviewedBy: number;
}

export interface FeedbackResponse {
  feedback: {
    id: number;
    matchId: number;
    userApproved: boolean;
    actualTarget: string | null;
    createdAt: string;
  };
  schemaMatch: SchemaMatch;
}

export interface EtlRequest {
  integrationId: number;
}

export interface EtlResponse {
  integrationId: number;
  sourceApiId: number;
  targetApiId: number;
  totalRecords: number;
  transformedRecords: number;
  loadedRecords: number;
  errors: string[];
}

export interface LlmConfigRequest {
  name: string;
  provider: string;
  apiKey: string;
  baseUrl: string;
  modelName: string;
  isDefault: boolean;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export interface LlmConfigResponse {
  id: number;
  name: string;
  provider: string;
  apiKey: string;
  baseUrl: string;
  modelName: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
