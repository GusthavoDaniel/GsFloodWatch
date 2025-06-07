import { Alert, Sensor } from '../types/data';


export interface Coordinates {
  latitude: number;
  longitude: number;
}


export interface MapItem {
  id: string;
  coordinates: Coordinates;
  data: Alert | Sensor;
  type: 'alert' | 'sensor';
}

/**
 * 
 * 
 * 
 * @param location 
 * @returns 
 */
export const getCoordinatesFromLocation = (location: string): Coordinates => {
  
  const baseLat = -23.55;
  const baseLng = -46.63;
  
  
  const getOffset = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return (hash % 200) / 1000; 
  };
  
  return {
    latitude: baseLat + getOffset(location),
    longitude: baseLng + getOffset(location.split('').reverse().join('')),
  };
};

/**
 * 
 * 
 * @param alerts 
 * @returns 
 */
export const alertsToMapItems = (alerts: Alert[]): MapItem[] => {
  return alerts.map(alert => ({
    id: `alert-${alert.id}`,
    coordinates: getCoordinatesFromLocation(alert.location),
    data: alert,
    type: 'alert'
  }));
};

/**
 * 
 * 
 * @param sensors 
 * @returns 
 */
export const sensorsToMapItems = (sensors: Sensor[]): MapItem[] => {
  return sensors.map(sensor => ({
    id: `sensor-${sensor.id}`,
    coordinates: getCoordinatesFromLocation(sensor.location),
    data: sensor,
    type: 'sensor'
  }));
};

/**
 * 
 * 
 * @param coord1 
 * @param coord2 
 * @returns 
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; 
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 *
 * 
 * @param items 
 * @param coordinates 
 * @param maxDistance 
 * @returns 
 */
export const findNearbyItems = (
  items: MapItem[], 
  coordinates: Coordinates, 
  maxDistance: number
): MapItem[] => {
  return items.filter(item => 
    calculateDistance(item.coordinates, coordinates) <= maxDistance
  );
};

/**
 * 
 * 
 * @param level 
 * @returns 
 */
export const getAlertColor = (level: Alert['level']): string => {
  switch (level) {
    case 'Crítico': return '#DC3545'; 
    case 'Alto': return '#FFC107';    
    case 'Médio': return '#00BFFF';   
    case 'Baixo': return '#28A745';   
    default: return '#0052FF';       
  }
};

/**
 * 
 * 
 * @param sensor 
 * @returns 
 */
export const getSensorColor = (sensor: Sensor): string => {
  if (sensor.status === 'Offline') return '#ADB5BD'; 
  if (sensor.waterLevel && sensor.waterLevel > 1.0) return '#FFC107'; 
  return '#00BFFF'; 
};

