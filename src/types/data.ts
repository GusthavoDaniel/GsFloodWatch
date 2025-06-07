export interface Alert {
  id: string;
  location: string;
  level: 'Baixo' | 'Médio' | 'Alto' | 'Crítico'; 
  description?: string; 
  timestamp: number; 
  image?: string;
}

export interface Sensor {
  id: string;
  location: string;
  status: 'Online' | 'Offline' | 'Manutenção';
  battery: number; 
  lastReadingTimestamp: number;
  waterLevel?: number; 
}

