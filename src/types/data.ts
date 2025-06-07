export interface Alert {
  id: string;
  location: string;
  level: 'Baixo' | 'Médio' | 'Alto' | 'Crítico'; // Define specific levels
  description?: string; // Optional description
  timestamp: number; // Use timestamp for sorting/filtering
  image?: string;
}

export interface Sensor {
  id: string;
  location: string;
  status: 'Online' | 'Offline' | 'Manutenção';
  battery: number; // Battery percentage as number
  lastReadingTimestamp: number;
  waterLevel?: number; // Example sensor reading
}

