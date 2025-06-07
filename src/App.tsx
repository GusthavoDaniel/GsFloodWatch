import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';
import { lightTheme, darkTheme } from './styles/theme';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Carregar a preferência de tema ao iniciar o app
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Erro ao carregar preferência de tema:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Salvar a preferência de tema quando mudar
  const handleThemeChange = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem('theme', value ? 'dark' : 'light');
    } catch (error) {
      console.error('Erro ao salvar preferência de tema:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AppNavigator theme={theme} setIsDarkMode={handleThemeChange} />
    </SafeAreaProvider>
  );
};

export default App;

