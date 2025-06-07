import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MapLegendProps {
  theme: any;
}

/**
 * Componente para exibir a legenda do mapa
 */
const MapLegend: React.FC<MapLegendProps> = ({ theme }) => {
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legenda:</Text>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
        <Text style={styles.text}>Alerta Crítico</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.warning }]} />
        <Text style={styles.text}>Alerta Alto</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.secondary }]} />
        <Text style={styles.text}>Alerta Médio / Sensor Normal</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
        <Text style={styles.text}>Alerta Baixo</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: theme.colors.textDisabled }]} />
        <Text style={styles.text}>Sensor Offline</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      ...theme.elevation[1],
    },
    title: {
      ...theme.typography.subtitle1,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xxs,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: theme.spacing.xs,
    },
    text: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
  });

export default MapLegend;
