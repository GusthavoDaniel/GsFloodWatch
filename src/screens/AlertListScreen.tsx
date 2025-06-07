
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import { getAlerts } from '../services/alertsService'; // agora real com API
import { Alert as AlertType } from '../types/data';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart } from 'react-native-chart-kit';
import Header from '../components/Header'; 
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { deleteAlert } from '../services/alertsService';


const screenWidth = Dimensions.get('window').width;

interface AlertListScreenProps extends BottomTabScreenProps<RootTabParamList, 'AlertListTab'> {
  theme: any; 
}

const AlertListScreen: React.FC<AlertListScreenProps> = ({ navigation: tabNavigation, theme }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  
  const levelColors: Record<string, string> = {
    Baixo: theme.colors.success, 
    Médio: theme.colors.warning, 
    Alto: '#FFA500', 
    Crítico: theme.colors.error, 
  };

  const fetchAlerts = useCallback(async () => {
    setLoading(true); 
    try {
      setError(null);
      const data = await getAlerts();
      const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAlerts(sortedData);
      setFilteredAlerts(sortedData); 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError('Erro ao carregar alertas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fadeAnim]);

  useEffect(() => {
    const unsubscribe = tabNavigation.addListener('focus', () => {
      fetchAlerts(); 
    });
    return unsubscribe;
  }, [tabNavigation, fetchAlerts]);

  useEffect(() => {
    
    const filtered = alerts.filter(alert => {
      const matchText = alert.location.toLowerCase().includes(searchText.toLowerCase()) ||
                        (alert.description && alert.description.toLowerCase().includes(searchText.toLowerCase()));
      const matchLevel = filterLevel === 'Todos' || alert.level === filterLevel;
      return matchText && matchLevel;
    });
    setFilteredAlerts(filtered);
  }, [searchText, filterLevel, alerts]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert(id);
      
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
      
    } catch {
      setError('Erro ao excluir alerta');
    }
  };

  const handleViewAlert = (alertId: string) => {
    navigation.navigate('AlertDetail', { alertId });
  };

  
  const groupedAlerts = filteredAlerts.reduce((groups: Record<string, AlertType[]>, alert) => {
    const level = alert.level || 'Desconhecido'; 
    if (!groups[level]) groups[level] = [];
    groups[level].push(alert);
    return groups;
  }, {});

 
  const alertStats = Object.keys(levelColors).map(level => {
    const count = alerts.filter(a => a.level === level).length;
    return {
      name: level,
      population: count,
      color: levelColors[level] || theme.colors.textDisabled, 
      legendFontColor: theme.colors.textPrimary,
      legendFontSize: 12,
    };
  }).filter(data => data.population > 0); 

  
  const renderGroup = (level: string, alertsInGroup: AlertType[]) => (
    <View key={level} style={styles(theme).groupContainer}>
      <Text style={[styles(theme).groupHeader, { color: levelColors[level] || theme.colors.textPrimary }]}>{level}</Text>
      {alertsInGroup.map(item => (
        <Animated.View key={item.id} style={{ ...styles(theme).cardContainer, opacity: fadeAnim }}>
          {/* Usa gradiente sutil no card */}
          <TouchableOpacity onPress={() => handleViewAlert(item.id)}>
            <LinearGradient colors={[theme.colors.surface, theme.colors.background]} style={styles(theme).card}>
              <View style={styles(theme).cardContent}>
                  <Text style={styles(theme).title}>{item.location}</Text>
                  {item.description && <Text style={styles(theme).description}>{item.description}</Text>}
                  <Text style={styles(theme).timestamp}>{new Date(item.timestamp).toLocaleString('pt-BR')}</Text>
              </View>
              <TouchableOpacity style={styles(theme).deleteButton} onPress={() => handleDelete(item.id)}>
                <Feather name="trash-2" size={20} color={theme.colors.onError} />
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  
  const renderEmpty = () => (
    <View style={styles(theme).centered}>
      <Feather name="info" size={48} color={theme.colors.textDisabled} />
      <Text style={styles(theme).emptyText}>Nenhum alerta encontrado.</Text>
      {error && <Text style={styles(theme).errorText}>{error}</Text>} 
    </View>
  );

  
  if (loading && !refreshing) { 
    return (
      <View style={styles(theme).screenContainer}>
        <Header title="Alertas" theme={theme} />
        <View style={styles(theme).centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles(theme).loadingText}>Carregando alertas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles(theme).screenContainer}> 
      <Header title="Alertas" theme={theme} />

      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={fetchAlerts} 
            colors={[theme.colors.primary]} 
            tintColor={theme.colors.primary} 
          />
        }
      >
        {/* Campo de busca */}
        <View style={styles(theme).searchContainer}>
            <Feather name="search" size={20} color={theme.colors.textSecondary} style={styles(theme).searchIcon} />
            <TextInput
                style={styles(theme).searchInput}
                placeholder="Buscar por local ou descrição"
                placeholderTextColor={theme.colors.textDisabled}
                value={searchText}
                onChangeText={setSearchText}
            />
        </View>

        {/* Botões de filtro */}
        <View style={styles(theme).filterContainer}>
          {['Todos', ...Object.keys(levelColors)].map(level => (
            <TouchableOpacity
              key={level}
              style={[styles(theme).filterButton, filterLevel === level && styles(theme).filterButtonActive]}
              onPress={() => setFilterLevel(level)}
            >
              <Text style={[styles(theme).filterText, filterLevel === level && styles(theme).filterTextActive]}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gráfico de Pizza */}
        {alertStats.length > 0 && (
          <View style={styles(theme).chartContainer}>
            <Text style={styles(theme).chartTitle}>Distribuição de Alertas</Text>
            <PieChart
              data={alertStats}
              width={screenWidth - theme.spacing.md * 2} 
              height={220}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => theme.colors.primary, 
                labelColor: (opacity = 1) => theme.colors.textPrimary,
                style: {
                  borderRadius: theme.borderRadius.lg,
                }
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              
            />
          </View>
        )}

        {/* Exibe erro se houver */}
        {error && !loading && <Text style={styles(theme).errorText}>{error}</Text>} 

        {/* Lista de Alertas Agrupados */}
        {filteredAlerts.length === 0 && !loading ? (
          renderEmpty()
        ) : (
          Object.entries(groupedAlerts).map(([level, items]) => renderGroup(level, items))
        )}
      </ScrollView>

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity style={styles(theme).fab} onPress={() => tabNavigation.navigate('AddAlertTab')}>
        <LinearGradient colors={[theme.colors.primary, theme.colors.secondary]} style={styles(theme).fabGradient}>
          <Feather name="plus" size={24} color={theme.colors.onPrimary} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};


const styles = (theme: any) => StyleSheet.create({
  screenContainer: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 80, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.elevation[1],
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap', 
    gap: theme.spacing.xs, 
  },
  filterButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: theme.colors.onPrimary,
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.elevation[2],
  },
  chartTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  groupContainer: {
    marginBottom: theme.spacing.lg,
  },
  groupHeader: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    
  },
  cardContainer: {
    marginBottom: theme.spacing.md,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row', 
    alignItems: 'center',
    ...theme.elevation[1],
  },
  cardContent: {
    flex: 1, 
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.subtitle1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xxs,
  },
  description: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xxs,
  },
  timestamp: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textDisabled,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    marginLeft: 'auto', 
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    ...theme.elevation[4],
    borderRadius: 28, 
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xxl, 
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.error,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
});

export default AlertListScreen;


