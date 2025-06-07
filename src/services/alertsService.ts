// src/services/alertsService.ts
import { Alert } from '../types/data';

let mockAlerts: Alert[] = [
  {
    id: '1',
    location: 'Rua das Palmeiras, 123',
    level: 'Alto',
    timestamp: Date.now() - 3600000,
    description: 'Água subindo rapidamente.',
  },
  {
    id: '2',
    location: 'Av. Central, 456',
    level: 'Médio',
    timestamp: Date.now() - 1800000,
    description: 'Acúmulo de água em bueiros.',
  },
  {
    id: '3',
    location: 'Praça da Sé, 789',
    level: 'Baixo',
    timestamp: Date.now() - 600000,
    description: 'Risco mínimo de alagamento.',
  },
];

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAlerts = async (): Promise<Alert[]> => {
  await simulateDelay(500);
  return [...mockAlerts].sort((a, b) => b.timestamp - a.timestamp);
};

export const addAlert = async (data: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> => {
  await simulateDelay(300);
  const newAlert: Alert = {
    ...data,
    id: `${Date.now()}`,
    timestamp: Date.now(),
  };
  mockAlerts.push(newAlert);
  return newAlert;
};

export const updateAlert = async (
  id: string,
  data: Partial<Omit<Alert, 'id' | 'timestamp'>>
): Promise<Alert | null> => {
  await simulateDelay(300);
  const index = mockAlerts.findIndex(alert => alert.id === id);
  if (index === -1) return null;
  mockAlerts[index] = { ...mockAlerts[index], ...data };
  return mockAlerts[index];
};

export const deleteAlert = async (id: string): Promise<boolean> => {
  await simulateDelay(300);
  const originalLength = mockAlerts.length;
  mockAlerts = mockAlerts.filter(alert => alert.id !== id);
  return mockAlerts.length < originalLength;
};
