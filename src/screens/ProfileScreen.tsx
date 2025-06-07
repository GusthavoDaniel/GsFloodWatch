import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';


type Props = BottomTabScreenProps<RootTabParamList, 'ProfileTab'> & {
  theme: any;
  setIsDarkMode: (value: boolean) => void;
};

const ProfileScreen: React.FC<Props> = ({ theme, setIsDarkMode }) => {
  const [isDarkMode, setLocalIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      const newIsDarkMode = storedTheme === 'dark';
      setLocalIsDarkMode(newIsDarkMode);
      setIsDarkMode(newIsDarkMode);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setLocalIsDarkMode(newTheme);
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const user = {
    name: 'Flood Watch',
    email: 'Flood.Watch25@gmail.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    joinDate: '10/01/2023',
    alertsReported: 12,
    profileImage: require('../../assets/flod.png'),
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header title="Perfil" rightIcon="settings" onRightIconPress={() => {}} theme={theme} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Image source={user.profileImage} style={[styles.profileImage, { borderColor: theme.colors.primary }]} />
          <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user.email}</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface, ...theme.elevation[2] }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{user.alertsReported}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Alertas Reportados</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{user.joinDate}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Membro desde</Text>
          </View>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface, ...theme.elevation[1] }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Informações Pessoais</Text>
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textPrimary }]}>{user.phone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="map-pin" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textPrimary }]}>{user.address}</Text>
          </View>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface, ...theme.elevation[1] }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Modo Escuro</Text>
          <View style={[styles.optionItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.optionLeft}>
              <Feather name="moon" size={20} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Ativar tema escuro</Text>
            </View>
            <Switch
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isDarkMode ? theme.colors.textPrimary : theme.colors.surface}
              ios_backgroundColor={theme.colors.border}
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>
        </View>

        <View style={[styles.sectionContainer, { backgroundColor: theme.colors.surface, ...theme.elevation[1] }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Equipe Desenvolvedora</Text>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.optionLeft}>
              <Image source={require('../../assets/eu.jpg')} style={styles.avatar} />
              <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Gusthavo Daniel — RM554681</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.optionLeft}>
              <Image source={require('../../assets/lulu.jpg')} style={styles.avatar} />
              <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Lucas Miranda — RM555161</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Image source={require('../../assets/roro.jpeg')} style={styles.avatar} />
              <Text style={[styles.optionText, { color: theme.colors.textPrimary }]}>Guilherme Roselli — RM555873</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.surface, ...theme.elevation[1] }]}>
          <Feather name="log-out" size={20} color={theme.colors.error} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 24 },
  profileImage: {
    width: 100, height: 100, borderRadius: 50, marginBottom: 16, borderWidth: 3,
  },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  userEmail: { fontSize: 16 },
  statsContainer: {
    flexDirection: 'row', borderRadius: 12, marginHorizontal: 16, marginVertical: 16, padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 14 },
  statDivider: { width: 1, marginHorizontal: 16 },
  sectionContainer: {
    borderRadius: 12, marginHorizontal: 16, marginBottom: 16, padding: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { fontSize: 16, marginLeft: 16 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, borderBottomWidth: 1,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionText: { fontSize: 16, marginLeft: 16 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginVertical: 24, padding: 16, borderRadius: 12,
  },
  logoutText: { fontSize: 16, fontWeight: '500', marginLeft: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12 },
});

export default ProfileScreen;
