import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface MapMarkerProps {
  color: string;
  type: 'alert' | 'sensor';
  onPress?: () => void;
}

/**
 * Componente de marcador personalizado para o mapa
 * 
 * @param color Cor do marcador
 * @param type Tipo do marcador ('alert' ou 'sensor')
 * @param onPress Função de callback ao pressionar o marcador
 */
const MapMarker: React.FC<MapMarkerProps> = ({ color, type, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.markerContainer, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons 
        name={type === 'alert' ? 'warning' : 'sensors'} 
        size={16} 
        color="white" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.elevation[2],
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default MapMarker;

