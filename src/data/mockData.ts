import { Integration, UnifiedRecord } from '../types';

export const integrations: Integration[] = [
  {
    id: '1',
    name: 'CRM Clientes',
    source: 'HubSpot API',
    status: 'active',
    lastRun: 'Hace 2 horas',
    recordsProcessed: '1,245',
    jsonPreview: '{"id":"hs_001","full_name":"Ana García","user_email":"ana@corp.com","phone":"+52-55-1234","created_at":"2024-01-15"}',
  },
  {
    id: '2',
    name: 'ERP Ventas',
    source: 'MockAPI',
    status: 'pending',
    lastRun: 'Ayer',
    recordsProcessed: '8,902',
    mlBadge: { label: 'Schema Matching', score: 94 },
    jsonPreview: '{"order_id":"erp_778","nombre":"Ana G.","correo":"ana@corp.com","monto":4500.00,"fecha":"2024-01-14"}',
  },
  {
    id: '3',
    name: 'Inventario',
    source: 'SAP REST API',
    status: 'active',
    lastRun: 'Hace 45 min',
    recordsProcessed: '23,410',
    mlBadge: { label: 'Schema Matching', score: 87 },
    jsonPreview: '{"sku":"PRD-9921","producto":"Laptop Pro X","stock":142,"precio_unitario":18999,"almacen":"CDMX-01"}',
  },
  {
    id: '4',
    name: 'Soporte Tickets',
    source: 'Zendesk API',
    status: 'error',
    lastRun: 'Hace 3 días',
    recordsProcessed: '312',
    jsonPreview: '{"ticket_id":"ZD-4412","subject":"Error en pago","status":"open","priority":"high","requester_email":"cli@test.mx"}',
  },
];

export const unifiedRecords: UnifiedRecord[] = [
  {
    unifiedId: 'UNI-0041',
    entityName: 'Ana García (CRM + ERP)',
    originA: 'HubSpot: hs_001',
    originB: 'MockAPI: erp_778',
    confidence: 98.4,
    highlight: true,
  },
  {
    unifiedId: 'UNI-0042',
    entityName: 'Distribuciones Norte S.A.',
    originA: 'HubSpot: hs_002',
    originB: 'SAP: cust_0091',
    confidence: 91.2,
  },
  {
    unifiedId: 'UNI-0043',
    entityName: 'Carlos Mendoza Reyes',
    originA: 'HubSpot: hs_019',
    originB: 'MockAPI: erp_834',
    confidence: 85.7,
  },
  {
    unifiedId: 'UNI-0044',
    entityName: 'Tech Solutions MX',
    originA: 'HubSpot: hs_031',
    originB: 'SAP: cust_0205',
    confidence: 76.3,
  },
];
