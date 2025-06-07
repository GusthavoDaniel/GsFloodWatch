import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MapFiltersProps {
  showAlerts: boolean;
  showSensors: boolean;
  onToggleAlerts: () => void;
  onToggleSensors: () => void;
  theme: any;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  showAlerts,
  showSensors,
  onToggleAlerts,
  onToggleSensors,
  theme,
}) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.filterButton, 
          showAlerts && styles.filterButtonActive
        ]}
        onPress={onToggleAlerts}
      >
        <MaterialIcons 
          name="warning" 
          size={20} 
          color={showAlerts ? theme.colors.onPrimary : theme.colors.primary} 
        />
        <Text style={[
          styles.filterText,
          showAlerts && styles.filterTextActive
        ]}>
          Alertas
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[
          styles.filterButton, 
          showSensors && styles.filterButtonActive
        ]}
        onPress={onToggleSensors}
      >
        <MaterialIcons 
          name="sensors" 
          size={20} 
          color={showSensors ? theme.colors.onPrimary : theme.colors.primary} 
        />
        <Text style={[
          styles.filterText,
          showSensors && styles.filterTextActive
        ]}>
          Sensores
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      gap: theme.spacing.sm,
      ...theme.elevation[1],
      zIndex: 1,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    filterText: {
      ...theme.typography.button,
      color: theme.colors.primary,
      marginLeft: theme.spacing.xs,
      textTransform: 'none',
    },
    filterTextActive: {
      color: theme.colors.onPrimary,
    },
  });

export default MapFilters;
