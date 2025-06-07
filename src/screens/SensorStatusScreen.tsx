import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import Header from '../components/Header';


interface SensorStatusScreenProps extends BottomTabScreenProps<RootTabParamList, 'SensorStatusTab'> {
  theme: any; 
}

const SensorStatusScreen: React.FC<SensorStatusScreenProps> = ({ theme }) => {
  
  const sensors = [
    { id: 1, name: 'Sensor Rio Tietê', location: 'Ponte das Bandeiras', status: 'Online', lastUpdate: '10/06/2023 14:30', batteryLevel: 85, waterLevel: 'Normal' },
    { id: 2, name: 'Sensor Rio Pinheiros', location: 'Ponte Cidade Jardim', status: 'Online', lastUpdate: '10/06/2023 14:25', batteryLevel: 92, waterLevel: 'Normal' },
    { id: 3, name: 'Sensor Córrego Ipiranga', location: 'Parque da Independência', status: 'Offline', lastUpdate: '09/06/2023 18:45', batteryLevel: 12, waterLevel: 'Desconhecido' },
    { id: 4, name: 'Sensor Represa Billings', location: 'São Bernardo do Campo', status: 'Online', lastUpdate: '10/06/2023 14:15', batteryLevel: 76, waterLevel: 'Elevado' },
    { id: 5, name: 'Sensor Represa Guarapiranga', location: 'Zona Sul', status: 'Online', lastUpdate: '10/06/2023 14:10', batteryLevel: 81, waterLevel: 'Normal' },
  ];

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return theme.colors.success;
      case 'Offline': return theme.colors.error;
      default: return theme.colors.warning;
    }
  };

  
  const getWaterLevelColor = (level: string) => {
    switch (level) {
      case 'Normal': return theme.colors.success;
      case 'Elevado': return theme.colors.warning;
      case 'Crítico': return theme.colors.error;
      default: return theme.colors.textDisabled;
    }
  };

  return (
    <View style={styles(theme).container}>
      <Header title="Status dos Sensores" theme={theme} />
      
      <ScrollView style={styles(theme).scrollView}>
        <View style={styles(theme).content}>
          <Text style={styles(theme).title}>Monitoramento de Sensores</Text>
          <Text style={styles(theme).description}>
            Acompanhe o status em tempo real dos sensores de nível de água instalados em rios e córregos da região.
          </Text>
          
          {sensors.map(sensor => (
            <View key={sensor.id} style={styles(theme).sensorCard}>
              <View style={styles(theme).sensorHeader}>
                <Text style={styles(theme).sensorName}>{sensor.name}</Text>
                <View style={[styles(theme).statusIndicator, { backgroundColor: getStatusColor(sensor.status) }]} />
              </View>
              
              <Text style={styles(theme).sensorLocation}>{sensor.location}</Text>
              
              <View style={styles(theme).sensorDetails}>
                <View style={styles(theme).detailItem}>
                  <Text style={styles(theme).detailLabel}>Status:</Text>
                  <Text style={[styles(theme).detailValue, { color: getStatusColor(sensor.status) }]}>{sensor.status}</Text>
                </View>
                
                <View style={styles(theme).detailItem}>
                  <Text style={styles(theme).detailLabel}>Última atualização:</Text>
                  <Text style={styles(theme).detailValue}>{sensor.lastUpdate}</Text>
                </View>
                
                <View style={styles(theme).detailItem}>
                  <Text style={styles(theme).detailLabel}>Bateria:</Text>
                  <Text style={styles(theme).detailValue}>{sensor.batteryLevel}%</Text>
                </View>
                
                <View style={styles(theme).detailItem}>
                  <Text style={styles(theme).detailLabel}>Nível da água:</Text>
                  <Text style={[styles(theme).detailValue, { color: getWaterLevelColor(sensor.waterLevel) }]}>
                    {sensor.waterLevel}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  sensorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation[2],
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sensorName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sensorLocation: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  sensorDetails: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
});

export default SensorStatusScreen;


