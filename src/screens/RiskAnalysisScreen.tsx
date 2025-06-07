import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import Header from '../components/Header';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, LineChart } from 'react-native-chart-kit';

type Props = BottomTabScreenProps<RootTabParamList, 'RiskAnalysis'> & {
  theme: any; 
};


const riskLevelData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }
  ],
  legend: ['Nível de Risco']
};

const rainfallData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [
    {
      data: [50, 120, 70, 200, 250, 110],
    }
  ]
};

const riskZones = [
  { id: '1', name: 'Zona Norte', riskLevel: 'Alto', affectedAreas: 'Brasilândia, Freguesia do Ó', population: '120.000' },
  { id: '2', name: 'Zona Leste', riskLevel: 'Médio', affectedAreas: 'Itaquera, São Miguel', population: '180.000' },
  { id: '3', name: 'Zona Sul', riskLevel: 'Crítico', affectedAreas: 'M\'Boi Mirim, Capela do Socorro', population: '210.000' },
  { id: '4', name: 'Zona Oeste', riskLevel: 'Baixo', affectedAreas: 'Butantã, Pinheiros', population: '90.000' },
];

const screenWidth = Dimensions.get('window').width;

const RiskAnalysisScreen: React.FC<Props> = ({ theme }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const renderRiskLevelIndicator = (level: string) => {
    let color;
    switch (level) {
      case 'Baixo':
        color = theme.colors.success;
        break;
      case 'Médio':
        color = theme.colors.warning;
        break;
      case 'Alto':
        color = '#FFA500'; 
        break;
      case 'Crítico':
        color = theme.colors.error;
        break;
      default:
        color = theme.colors.textDisabled;
    }
    
    return (
      <View style={[styles(theme).riskIndicator, { backgroundColor: color }]}>
        <Text style={styles(theme).riskIndicatorText}>{level}</Text>
      </View>
    );
  };

  const renderOverviewTab = () => (
    <View style={styles(theme).tabContent}>
      <View style={styles(theme).card}>
        <Text style={styles(theme).cardTitle}>Resumo de Risco Atual</Text>
        <View style={styles(theme).riskSummary}>
          <View style={styles(theme).riskSummaryItem}>
            <Text style={styles(theme).riskSummaryValue}>4</Text>
            <Text style={styles(theme).riskSummaryLabel}>Zonas de Risco</Text>
          </View>
          <View style={styles(theme).riskSummaryItem}>
            <Text style={styles(theme).riskSummaryValue}>600k</Text>
            <Text style={styles(theme).riskSummaryLabel}>População Afetada</Text>
          </View>
          <View style={styles(theme).riskSummaryItem}>
            <Text style={styles(theme).riskSummaryValue}>Alto</Text>
            <Text style={styles(theme).riskSummaryLabel}>Nível Médio</Text>
          </View>
        </View>
      </View>

      <View style={styles(theme).card}>
        <Text style={styles(theme).cardTitle}>Tendência de Risco</Text>
        <Text style={styles(theme).cardSubtitle}>Últimos 6 meses</Text>
        <LineChart
          data={riskLevelData}
          width={screenWidth - 50}
          height={220}
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.textSecondary,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: theme.colors.primary
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>

      <View style={styles(theme).card}>
        <Text style={styles(theme).cardTitle}>Precipitação Mensal</Text>
        <Text style={styles(theme).cardSubtitle}>Em milímetros</Text>
        <BarChart
          data={rainfallData}
          width={screenWidth - 50}
          height={220}
          yAxisSuffix=" mm"
          yAxisLabel=""
          chartConfig={{
            backgroundColor: theme.colors.surface,
            backgroundGradientFrom: theme.colors.surface,
            backgroundGradientTo: theme.colors.surface,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => theme.colors.textSecondary,
            style: {
              borderRadius: 16
            },
            barPercentage: 0.7,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>

      <View style={styles(theme).card}>
        <Text style={styles(theme).cardTitle}>Alertas Recentes</Text>
        <View style={styles(theme).alertItem}>
          <View style={[styles(theme).alertDot, { backgroundColor: theme.colors.error }]} />
          <View style={styles(theme).alertContent}>
            <Text style={styles(theme).alertTitle}>Alerta de Inundação</Text>
            <Text style={styles(theme).alertDescription}>Zona Sul - M'Boi Mirim</Text>
            <Text style={styles(theme).alertTime}>Hoje, 14:30</Text>
          </View>
        </View>
        <View style={styles(theme).alertItem}>
          <View style={[styles(theme).alertDot, { backgroundColor: theme.colors.warning }]} />
          <View style={styles(theme).alertContent}>
            <Text style={styles(theme).alertTitle}>Risco de Deslizamento</Text>
            <Text style={styles(theme).alertDescription}>Zona Norte - Brasilândia</Text>
            <Text style={styles(theme).alertTime}>Ontem, 18:45</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderZonesTab = () => (
    <View style={styles(theme).tabContent}>
      <Text style={styles(theme).sectionTitle}>Zonas de Risco</Text>
      <Text style={styles(theme).sectionDescription}>
        Áreas da cidade com maior probabilidade de inundações e deslizamentos.
      </Text>
      
      {riskZones.map(zone => (
        <TouchableOpacity 
          key={zone.id} 
          style={[
            styles(theme).zoneCard, 
            selectedZone === zone.id && styles(theme).selectedZoneCard
          ]}
          onPress={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
        >
          <View style={styles(theme).zoneHeader}>
            <Text style={styles(theme).zoneName}>{zone.name}</Text>
            {renderRiskLevelIndicator(zone.riskLevel)}
          </View>
          
          {selectedZone === zone.id && (
            <View style={styles(theme).zoneDetails}>
              <View style={styles(theme).zoneDetailRow}>
                <Feather name="map-pin" size={16} color={theme.colors.primary} />
                <Text style={styles(theme).zoneDetailLabel}>Áreas afetadas:</Text>
                <Text style={styles(theme).zoneDetailValue}>{zone.affectedAreas}</Text>
              </View>
              <View style={styles(theme).zoneDetailRow}>
                <Feather name="users" size={16} color={theme.colors.primary} />
                <Text style={styles(theme).zoneDetailLabel}>População:</Text>
                <Text style={styles(theme).zoneDetailValue}>{zone.population}</Text>
              </View>
              <LinearGradient
                colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.1)']}
                style={styles(theme).zoneMap}
              >
                <Text style={styles(theme).mapPlaceholder}>Mapa da região</Text>
              </LinearGradient>
              <TouchableOpacity style={styles(theme).viewDetailsButton}>
                <Text style={styles(theme).viewDetailsText}>Ver detalhes completos</Text>
                <Feather name="arrow-right" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPreventionTab = () => (
    <View style={styles(theme).tabContent}>
      <Text style={styles(theme).sectionTitle}>Medidas Preventivas</Text>
      <Text style={styles(theme).sectionDescription}>
        Recomendações para reduzir riscos e se preparar para possíveis inundações.
      </Text>
      
      <View style={styles(theme).preventionCard}>
        <View style={styles(theme).preventionIconContainer}>
          <Feather name="home" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles(theme).preventionContent}>
          <Text style={styles(theme).preventionTitle}>Antes da Chuva</Text>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Limpe calhas e ralos</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Verifique o telhado e paredes</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Prepare um kit de emergência</Text>
          </View>
        </View>
      </View>
      
      <View style={styles(theme).preventionCard}>
        <View style={styles(theme).preventionIconContainer}>
          <Feather name="cloud-rain" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles(theme).preventionContent}>
          <Text style={styles(theme).preventionTitle}>Durante a Chuva</Text>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Evite áreas alagadas</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Não atravesse correntezas</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="check" size={16} color={theme.colors.success} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Desligue aparelhos elétricos</Text>
          </View>
        </View>
      </View>
      
      <View style={styles(theme).preventionCard}>
        <View style={styles(theme).preventionIconContainer}>
          <Feather name="phone-call" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles(theme).preventionContent}>
          <Text style={styles(theme).preventionTitle}>Contatos de Emergência</Text>
          <View style={styles(theme).preventionItem}>
            <Feather name="phone" size={16} color={theme.colors.error} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Defesa Civil: 199</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="phone" size={16} color={theme.colors.error} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>Corpo de Bombeiros: 193</Text>
          </View>
          <View style={styles(theme).preventionItem}>
            <Feather name="phone" size={16} color={theme.colors.error} style={styles(theme).bulletIcon} />
            <Text style={styles(theme).preventionText}>SAMU: 192</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles(theme).container}>
        <Header title="Análise de Risco" theme={theme} />
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles(theme).loadingText}>Carregando dados de análise de risco...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <Header title="Análise de Risco" theme={theme} />
      
      <View style={styles(theme).tabBar}>
        <TouchableOpacity 
          style={[styles(theme).tabButton, activeTab === 'overview' && styles(theme).activeTabButton]} 
          onPress={() => setActiveTab('overview')}
        >
          <Feather 
            name="pie-chart" 
            size={18} 
            color={activeTab === 'overview' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles(theme).tabButtonText, 
              activeTab === 'overview' && styles(theme).activeTabButtonText
            ]}
          >
            Visão Geral
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles(theme).tabButton, activeTab === 'zones' && styles(theme).activeTabButton]} 
          onPress={() => setActiveTab('zones')}
        >
          <Feather 
            name="map" 
            size={18} 
            color={activeTab === 'zones' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles(theme).tabButtonText, 
              activeTab === 'zones' && styles(theme).activeTabButtonText
            ]}
          >
            Zonas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles(theme).tabButton, activeTab === 'prevention' && styles(theme).activeTabButton]} 
          onPress={() => setActiveTab('prevention')}
        >
          <Feather 
            name="shield" 
            size={18} 
            color={activeTab === 'prevention' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text 
            style={[
              styles(theme).tabButtonText, 
              activeTab === 'prevention' && styles(theme).activeTabButtonText
            ]}
          >
            Prevenção
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles(theme).scrollView}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'zones' && renderZonesTab()}
        {activeTab === 'prevention' && renderPreventionTab()}
      </ScrollView>
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body1.fontSize,
  },
  scrollView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabButtonText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body2.fontSize,
  },
  activeTabButtonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation[2],
  },
  cardTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  riskSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  riskSummaryItem: {
    alignItems: 'center',
  },
  riskSummaryValue: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  riskSummaryLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  alertDescription: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
  },
  alertTime: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textDisabled,
  },
  sectionTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  sectionDescription: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  zoneCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation[1],
  },
  selectedZoneCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  zoneName: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  riskIndicator: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  riskIndicatorText: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
  },
  zoneDetails: {
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    paddingTop: theme.spacing.md,
  },
  zoneDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  zoneDetailLabel: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  zoneDetailValue: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textPrimary,
  },
  zoneMap: {
    width: '100%',
    height: 150,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  mapPlaceholder: {
    color: theme.colors.textDisabled,
    fontSize: theme.typography.body1.fontSize,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  viewDetailsText: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginRight: theme.spacing.xs,
  },
  preventionCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.elevation[1],
  },
  preventionIconContainer: {
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preventionContent: {
    flex: 1,
  },
  preventionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  preventionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  bulletIcon: {
    marginRight: theme.spacing.xs,
    marginTop: 2, 
  },
  preventionText: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});

export default RiskAnalysisScreen;


