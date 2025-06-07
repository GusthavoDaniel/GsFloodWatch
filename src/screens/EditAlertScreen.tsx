import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Alert as RNAlert,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateAlert } from '../services/alertsService';
import { getAlerts } from '../services/alertsService'; // agora real com API
import { Alert as AlertType } from '../types/data';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

const ALERT_LEVELS = ['Baixo', 'Médio', 'Alto', 'Crítico'];

type EditAlertScreenRouteProp = RouteProp<RootStackParamList, 'EditAlert'>;
type EditAlertScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditAlert'>;

type Props = {
  route: EditAlertScreenRouteProp;
  navigation: EditAlertScreenNavigationProp;
  theme: any; 
};

const EditAlertScreen: React.FC<Props> = ({ route, navigation, theme }) => {
  const { alertId } = route.params;

  const [alert, setAlert] = useState<AlertType | null>(null);
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState<string>(ALERT_LEVELS[0]);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingAlert, setFetchingAlert] = useState(true);

  useEffect(() => {
    const fetchAlertData = async () => {
      try {
        const alerts = await getAlerts();
        const foundAlert = alerts.find(a => a.id === alertId);

        if (foundAlert) {
          setAlert(foundAlert);
          setLocation(foundAlert.location);
          setLevel(foundAlert.level);
          setDescription(foundAlert.description || '');
          setImageUri(foundAlert.image || null);
        } else {
          Toast.show('Alerta não encontrado', { duration: Toast.durations.LONG });
          navigation.goBack();
        }
      } catch (error) {
        console.error('Erro ao buscar dados do alerta:', error);
        Toast.show('Erro ao carregar dados do alerta', { duration: Toast.durations.LONG });
      } finally {
        setFetchingAlert(false);
      }
    };

    fetchAlertData();
  }, [alertId, navigation]);

  const pickImage = async (fromCamera = false) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      RNAlert.alert('Permissão necessária', 'Permita o acesso à câmera ou galeria para adicionar uma imagem.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1024 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        setImageUri(manipResult.uri);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.error("Erro ao manipular imagem:", error);
        Toast.show('Erro ao processar a imagem.', { duration: Toast.durations.SHORT });
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const validateFields = () => {
    if (!location.trim()) {
      Toast.show('Por favor, informe a localização.', { duration: Toast.durations.SHORT });
      return false;
    }
    if (!level) {
      Toast.show('Por favor, selecione o nível do alerta.', { duration: Toast.durations.SHORT });
      return false;
    }
    return true;
  };

  const handleUpdateAlert = async () => {
    if (!validateFields() || !alert) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      const updatedAlertData: Partial<Omit<AlertType, 'id'>> = {
        location: location.trim(),
        level: level as any,
        description: description.trim() || undefined,
        image: imageUri || undefined,
      };

      const result = await updateAlert(alert.id, updatedAlertData);

      if (result) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show('Alerta atualizado com sucesso!', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
        });
        navigation.goBack();
      } else {
        throw new Error('Falha ao atualizar alerta');
      }
    } catch (error) {
      console.error('Erro ao atualizar alerta:', error);
      Toast.show('Falha ao atualizar alerta. Verifique sua conexão e tente novamente.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingAlert) {
    return (
      <SafeAreaView style={styles(theme).safeArea}>
        <Header title="Editar Alerta" showBackButton={true} theme={theme} />
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles(theme).loadingText}>Carregando dados do alerta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles(theme).safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles(theme).container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Header title="Editar Alerta" showBackButton={true} theme={theme} />
        <ScrollView contentContainerStyle={styles(theme).scroll}>
          <View style={styles(theme).card}>
            <Text style={styles(theme).label}>Localização *</Text>
            <View style={styles(theme).inputContainer}>
              <Feather name="map-pin" size={20} color={theme.colors.primary} style={styles(theme).inputIcon} />
              <TextInput
                placeholder="Ex: Rua das Flores, 123"
                value={location}
                onChangeText={setLocation}
                style={styles(theme).input}
                placeholderTextColor={theme.colors.textDisabled}
              />
            </View>

            <Text style={styles(theme).label}>Nível de Risco *</Text>
            <View style={styles(theme).pickerBox}>
              <Picker
                selectedValue={level}
                onValueChange={(itemValue) => setLevel(itemValue)}
                style={styles(theme).picker}
              >
                {ALERT_LEVELS.map((lvl) => (
                  <Picker.Item key={lvl} label={lvl} value={lvl} />
                ))}
              </Picker>
            </View>

            <Text style={styles(theme).label}>Descrição (Opcional)</Text>
            <View style={styles(theme).inputContainer}>
              <Feather name="file-text" size={20} color={theme.colors.primary} style={styles(theme).inputIcon} />
              <TextInput
                placeholder="Detalhes adicionais sobre o alerta..."
                value={description}
                onChangeText={setDescription}
                multiline
                style={[styles(theme).input, styles(theme).textArea]}
                placeholderTextColor={theme.colors.textDisabled}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1 },
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
  scroll: { paddingVertical: 20, paddingHorizontal: 15 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 50,
    color: theme.colors.textPrimary,
  },
});

export default EditAlertScreen;


