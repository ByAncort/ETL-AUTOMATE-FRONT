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
