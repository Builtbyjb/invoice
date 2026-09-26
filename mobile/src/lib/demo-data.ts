// Port of ios/invoice/invoice/Models/DemoData.swift.
import type { Client } from '@/schemas/client';
import type { Invoice } from '@/schemas/invoice';
import type { AppNotification } from '@/schemas/notification';

import { toApiDate } from './format';

const at = (seconds: number) => new Date(seconds * 1000);

export const DEMO_CLIENT_ID = 'demo-client-1';
export const DEMO_INVOICE_ID = 'demo-invoice-1';

export const demoClient: Client = {
  id: DEMO_CLIENT_ID,
  organizationID: 1,
  name: 'Acme Corp',
  email: 'billing@acme.com',
  phone: '+1 555 1234',
  address: '123 Main St',
  city: 'New York',
  country: 'US',
  note: 'Created a website. Almost done with the design. Waiting for client feedback.',
  createdAt: toApiDate(at(1_704_067_200)),
};

export const demoClients: Client[] = [
  demoClient,
  {
    id: 'demo-client-2',
    organizationID: 1,
    name: 'Globex Inc',
    email: 'accounts@globex.com',
    phone: '+1 555 5678',
    address: '456 Oak Ave',
    city: 'Chicago',
    country: 'US',
    note: 'Done with the design. Ready to start development.',
    createdAt: toApiDate(at(1_704_153_600)),
  },
  {
    id: 'demo-client-3',
    organizationID: 1,
    name: 'Soylent Corp',
    email: 'hello@soylent.com',
    phone: '+1 555 9012',
    address: '789 Green St',
    city: 'San Francisco',
    country: 'US',
    note: 'Project completed.',
    createdAt: toApiDate(at(1_704_240_000)),
  },
  {
    id: 'demo-client-4',
    organizationID: 1,
    name: 'Initech',
    email: 'finance@initech.com',
    phone: '+1 555 3456',
    address: '100 Corporate Blvd',
    city: 'Austin',
    country: 'US',
    note: 'Project on hold. Need more resources.',
    createdAt: toApiDate(at(1_704_326_400)),
  },
];

/** Raw JSON as the backend would return it (dates as strings). */
export const demoInvoiceJson = {
  id: DEMO_INVOICE_ID,
  invoiceNumber: 'INV-001',
  clientID: DEMO_CLIENT_ID,
  clientName: demoClient.name,
  clientInfo: {
    email: demoClient.email,
    phone: demoClient.phone,
    address: demoClient.address,
    city: demoClient.city,
    country: demoClient.country,
  },
  items: [
    { id: '7C9E6679-7425-40DE-944B-E07FC1F90AE7', description: 'Consulting', quantity: 10, unit: 'hr', price: 150 },
  ],
  taxRate: 10,
  discount: 0,
  status: 'sent',
  signature: null,
  issueDate: toApiDate(at(1_704_067_200)),
  dueDate: toApiDate(at(1_706_745_600)),
  createdAt: toApiDate(at(1_704_067_200)),
  currency: 'USD',
  notes: 'Demo invoice for preview and deep-link testing.',
} as const;

export const demoInvoice: Invoice = {
  ...demoInvoiceJson,
  items: demoInvoiceJson.items.map((i) => ({ ...i })),
  clientInfo: { ...demoInvoiceJson.clientInfo },
  issueDate: at(1_704_067_200),
  dueDate: at(1_706_745_600),
  createdAt: at(1_704_067_200),
};

const NOTIFICATION_BASE = 1_752_883_200; // 2026-07-19 00:00:00 UTC (per the Swift comment)

export const demoNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New invoice paid',
    body: 'Invoice INV-001 has been marked as paid.',
    kind: 'invoice',
    targetId: DEMO_INVOICE_ID,
    isRead: false,
    createdAt: at(NOTIFICATION_BASE - 3600),
  },
  {
    id: 'notif-2',
    title: 'Client updated',
    body: "Acme Corp's profile was updated.",
    kind: 'client',
    targetId: DEMO_CLIENT_ID,
    isRead: false,
    createdAt: at(NOTIFICATION_BASE - 7200),
  },
  {
    id: 'notif-3',
    title: 'Welcome',
    body: 'Thanks for using Acorp Invoice.',
    kind: 'system',
    targetId: null,
    isRead: true,
    createdAt: at(NOTIFICATION_BASE - 86400),
  },
];
