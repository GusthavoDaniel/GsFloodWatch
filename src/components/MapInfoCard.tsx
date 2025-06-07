import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Alert, Sensor } from '../types/data';

interface MapInfoCardProps {
  item: Alert | Sensor;
  onClose: () => void;
}

/**
 * Componente para exibir informações detalhadas de um alerta ou sensor selecionado no mapa
 * 
 * @param item 
 * @param onClose 
 */
const MapInfoCard: React.FC<MapInfoCardProps> = ({ item, onClose }) => {

  const isAlert = 'level' in item;
  
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  
  const getAlertColor = (level: Alert['level']) => {
    switch (level) {
      case 'Crítico': return theme.colors.error;
      case 'Alto': return theme.colors.warning;
      case 'Médio': return theme.colors.secondary;
      case 'Baixo': return theme.colors.success;
      default: return theme.colors.primary;
    }
  };
  
  
  const getSensorStatusColor = (status: Sensor['status']) => {
    switch (status) {
      case 'Online': return theme.colors.success;
      case 'Offline': return theme.colors.error;
      case 'Manutenção': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <MaterialIcons name="close" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      {isAlert ? (
        
        <>
          <Text style={styles.title}>Alerta: {(item as Alert).location}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nível:</Text>
            <View style={[
              styles.badge, 
              { backgroundColor: getAlertColor((item as Alert).level) }
            ]}>
              <Text style={styles.badgeText}>{(item as Alert).level}</Text>
            </View>
          </View>
          {(item as Alert).description && (
            <View style={styles.row}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.value}>{(item as Alert).description}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{formatDate((item as Alert).timestamp)}</Text>
          </View>
        </>
      ) : (
       
        <>
          <Text style={styles.title}>Sensor: {(item as Sensor).location}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <View style={[
              styles.badge, 
              { backgroundColor: getSensorStatusColor((item as Sensor).status) }
            ]}>
              <Text style={styles.badgeText}>{(item as Sensor).status}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bateria:</Text>
            <Text style={styles.value}>{(item as Sensor).battery}%</Text>
          </View>
          {(item as Sensor).waterLevel !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label}>Nível da água:</Text>
              <Text style={styles.value}>{(item as Sensor).waterLevel} metros</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Última leitura:</Text>
            <Text style={styles.value}>{formatDate((item as Sensor).lastReadingTimestamp)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.elevation[3],
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    padding: theme.spacing.xs,
    zIndex: 1,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.subtitle2,
    color: theme.colors.textSecondary,
    width: 100,
  },
  value: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});

export default MapInfoCard;

