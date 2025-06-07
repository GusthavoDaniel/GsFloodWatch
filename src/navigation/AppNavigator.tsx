import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { RootStackParamList, RootTabParamList } from '../types/navigation';

import LoginScreen from '../screens/LoginScreen';
import AlertListScreen from '../screens/AlertListScreen';
import MapScreen from '../screens/MapScreen';
import AddAlertScreen from '../screens/AddAlertScreen';
import SensorStatusScreen from '../screens/SensorStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RiskAnalysisScreen from '../screens/RiskAnalysisScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen';
import EditAlertScreen from '../screens/EditAlertScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

interface AppTabsProps {
  theme: any;
  setIsDarkMode: (value: boolean) => void;
}

function AppTabs({ theme, setIsDarkMode }: AppTabsProps) {
  const tabIcons: Record<keyof RootTabParamList, React.ComponentProps<typeof MaterialIcons>['name']> = {
    AlertListTab: 'notifications',
    MapTab: 'map',
    AddAlertTab: 'add-alert',
    SensorStatusTab: 'sensors',
    ProfileTab: 'person-outline',
    RiskAnalysis: 'analytics',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const iconName = tabIcons[route.name] || 'help-outline';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="AlertListTab" options={{ title: 'Alertas' }}>
    {props => <AlertListScreen {...props} theme={theme} />}
  </Tab.Screen>
  <Tab.Screen name="MapTab" options={{ title: 'Mapa' }}>
    {props => <MapScreen {...props} theme={theme} />}
  </Tab.Screen>
  <Tab.Screen name="AddAlertTab" options={{ title: 'Adicionar Alerta' }}>
    {props => <AddAlertScreen {...props} theme={theme} />}
  </Tab.Screen>
  <Tab.Screen name="SensorStatusTab" options={{ title: 'Sensores' }}>
    {props => <SensorStatusScreen {...props} theme={theme} />}
  </Tab.Screen>
  <Tab.Screen name="RiskAnalysis" options={{ title: 'Análise de Risco' }}>
    {props => <RiskAnalysisScreen {...props} theme={theme} />}
  </Tab.Screen>
  <Tab.Screen name="ProfileTab" options={{ title: 'Perfil' }}>
    {props => <ProfileScreen {...props} theme={theme} setIsDarkMode={setIsDarkMode} />}
  </Tab.Screen>
</Tab.Navigator>
  );
}

interface AppNavigatorProps {
  theme: any;
  setIsDarkMode: (value: boolean) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ theme, setIsDarkMode }) => {
  const baseTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  const customTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {props => <LoginScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {props => <AppTabs {...props} theme={theme} setIsDarkMode={setIsDarkMode} />}
        </Stack.Screen>
        <Stack.Screen name="AlertDetail" options={{ headerShown: false }}>
          {props => <AlertDetailScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="EditAlert" options={{ headerShown: false }}>
          {props => <EditAlertScreen {...props} theme={theme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
