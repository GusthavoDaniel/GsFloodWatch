import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { deleteAlert } from '../services/alertsService';

import { getAlerts } from '../services/alertsService'; // agora real com API
import { Alert as AlertType } from '../types/data';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type AlertDetailScreenRouteProp = RouteProp<RootStackParamList, 'AlertDetail'>;
type AlertDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AlertDetail'>;

type Props = {
  route: AlertDetailScreenRouteProp;
  navigation: AlertDetailScreenNavigationProp;
  theme: any; 
};

const AlertDetailScreen: React.FC<Props> = ({ route, navigation, theme }) => {
  const { alertId } = route.params;
  
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapeamento de níveis para cores
  const levelColors: Record<string, string> = {
    Baixo: theme.colors.success,
    Médio: theme.colors.warning,
    Alto: '#FFA500',
    Crítico: theme.colors.error,
  };

  useEffect(() => {
    const fetchAlertDetail = async () => {
      try {
        const alerts = await getAlerts();
        const foundAlert = alerts.find(a => a.id === alertId);
        
        if (foundAlert) {
          setAlert(foundAlert);
        } else {
          setError('Alerta não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar detalhes do alerta');
      } finally {
        setLoading(false);
      }
    };

    fetchAlertDetail();
  }, [alertId]);

  const handleEdit = () => {
    if (alert) {
      navigation.navigate('EditAlert', { alertId: alert.id });
    }
  };

  const handleDelete = () => {
    if (!alert) return;

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alerta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAlert(alert.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o alerta. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles(theme).safeArea}>
        <Header title="Detalhes do Alerta" showBackButton={true} theme={theme} />
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles(theme).loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !alert) {
    return (
      <SafeAreaView style={styles(theme).safeArea}>
        <Header title="Detalhes do Alerta" showBackButton={true} theme={theme} />
        <View style={styles(theme).errorContainer}>
          <Feather name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={styles(theme).errorText}>{error || 'Alerta não encontrado'}</Text>
          <TouchableOpacity 
            style={styles(theme).backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles(theme).backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(theme).safeArea}>
      <Header title="Detalhes do Alerta" showBackButton={true} theme={theme} />
      
      <ScrollView style={styles(theme).container}>
        <View style={styles(theme).card}>
          <View style={styles(theme).headerRow}>
            <View style={styles(theme).levelBadge}>
              <Text style={[styles(theme).levelText, { color: levelColors[alert.level] || theme.colors.textPrimary }]}>
                {alert.level}
              </Text>
            </View>
            <Text style={styles(theme).timestamp}>
              {new Date(alert.timestamp).toLocaleString('pt-BR')}
            </Text>
          </View>

          <Text style={styles(theme).locationTitle}>{alert.location}</Text>
          
          {alert.description && (
            <View style={styles(theme).descriptionContainer}>
              <Text style={styles(theme).descriptionLabel}>Descrição:</Text>
              <Text style={styles(theme).descriptionText}>{alert.description}</Text>
            </View>
          )}

          {alert.image && (
            <View style={styles(theme).imageContainer}>
              <Image source={{ uri: alert.image }} style={styles(theme).image} resizeMode="cover" />
            </View>
          )}

          <View style={styles(theme).actionsContainer}>
            <TouchableOpacity 
              style={[styles(theme).actionButton, styles(theme).editButton]} 
              onPress={handleEdit}
            >
              <Feather name="edit-2" size={20} color={theme.colors.onPrimary} />
              <Text style={styles(theme).actionButtonText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles(theme).actionButton, styles(theme).deleteButton]} 
              onPress={handleDelete}
            >
              <Feather name="trash-2" size={20} color={theme.colors.onPrimary} />
              <Text style={styles(theme).actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles(theme).metadataCard}>
          <Text style={styles(theme).metadataTitle}>Informações Adicionais</Text>
          
          <View style={styles(theme).metadataRow}>
            <Feather name="hash" size={18} color={theme.colors.primary} />
            <Text style={styles(theme).metadataLabel}>ID:</Text>
            <Text style={styles(theme).metadataValue}>{alert.id}</Text>
          </View>
          
          <View style={styles(theme).metadataRow}>
            <Feather name="calendar" size={18} color={theme.colors.primary} />
            <Text style={styles(theme).metadataLabel}>Data de Criação:</Text>
            <Text style={styles(theme).metadataValue}>
              {new Date(alert.timestamp).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          
          <View style={styles(theme).metadataRow}>
            <Feather name="clock" size={18} color={theme.colors.primary} />
            <Text style={styles(theme).metadataLabel}>Hora de Criação:</Text>
            <Text style={styles(theme).metadataValue}>
              {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  backButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.elevation[2],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  levelBadge: {
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  levelText: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  locationTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.md,
  },
  descriptionLabel: {
    fontSize: theme.typography.subtitle2.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  descriptionText: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  imageContainer: {
    marginVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: width * 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  actionButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  metadataCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.elevation[1],
  },
  metadataTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  metadataLabel: {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.xs,
  },
  metadataValue: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
  },
});

export default AlertDetailScreen;


