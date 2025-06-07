import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import Header from '../components/Header';
import MapLegend from '../components/MapLegend';
import MapFilters from '../components/MapFilters';

interface MapScreenProps extends BottomTabScreenProps<RootTabParamList, 'MapTab'> {
  theme: any; 
}

const MapScreen: React.FC<MapScreenProps> = ({ theme }) => {
  return (
    <View style={styles(theme).container}>
      <Header title="Mapa" theme={theme} />

      {/* Botões de filtro (mantido se quiser usar futuramente) */}
      <MapFilters
        showAlerts={true}
        showSensors={true}
        onToggleAlerts={() => {}}
        onToggleSensors={() => {}}
        theme={theme}

      />

      {/* Apenas imagem do mapa */}
      <View style={styles(theme).mapContainer}>
        <Image
          source={require('../assets/mapa-sp.png')} 
          style={styles(theme).staticMap}
          resizeMode="cover"
        />
      </View>

      <MapLegend theme={theme} />
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.md,
  },
  staticMap: {
    width: '90%',
    height: 300,
    borderRadius: theme.borderRadius.lg,
  },
});

export default MapScreen;


