import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Platform,
  ScrollView,
  Alert as RNAlert,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { Picker } from '@react-native-picker/picker'; 
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { uploadImageToSupabase } from '../services/uploadToSupabase';
import { addAlert } from '../services/alertsService';
import { Alert as AlertType } from '../types/data';
import { RootTabParamList } from '../types/navigation'; 
import Header from '../components/Header'; 


const ALERT_LEVELS = ['Baixo', 'Médio', 'Alto', 'Crítico'];

interface AddAlertScreenProps extends BottomTabScreenProps<RootTabParamList, 'AddAlertTab'> {
  theme: any; 
}

const AddAlertScreen: React.FC<AddAlertScreenProps> = ({ navigation, theme }) => {
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState<string>(ALERT_LEVELS[0]); 
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleAddAlert = async () => {
    if (!validateFields()) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      let imageUrl: string | undefined = undefined;

      if (imageUri) {
        
        console.log('Simulando upload de imagem para:', imageUri);
        
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        imageUrl = undefined; 
      }

      const newAlertData: Omit<AlertType, 'id' | 'timestamp'> = {
        location: location.trim(),
        level: level as any, 
        description: description.trim() || undefined,
        image: imageUrl,
      };

      await addAlert(newAlertData);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Alerta enviado com sucesso!', {
        duration: Toast.durations.LONG, 
        position: Toast.positions.CENTER, 
      });
      
      setLocation('');
      setLevel(ALERT_LEVELS[0]);
      setDescription('');
      setImageUri(null);
      navigation.navigate('AlertListTab');
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
      Toast.show('Falha ao enviar alerta. Verifique sua conexão e tente novamente.', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles(theme).safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles(theme).container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} 
      >
        <Header title="Reportar Alerta" theme={theme} />

        <ScrollView contentContainerStyle={styles(theme).scroll} showsVerticalScrollIndicator={false}>

          <View style={styles(theme).card}>
            <Text style={styles(theme).label}>Localização *</Text>
            <View style={styles(theme).inputContainer}>
                 {/* Use a cor primária para o ícone */}
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
            <View style={[styles(theme).inputContainer, styles(theme).pickerContainer]}>
                 {/* Use a cor primária para o ícone */}
                 <Feather name="bar-chart-2" size={20} color={theme.colors.primary} style={styles(theme).inputIcon} />
                <Picker
                    selectedValue={level}
                    onValueChange={(itemValue) => setLevel(itemValue)}
                    style={styles(theme).picker}
                    dropdownIconColor={theme.colors.primary} 
                >
                    {ALERT_LEVELS.map((lvl) => (
                        <Picker.Item key={lvl} label={lvl} value={lvl} style={styles(theme).pickerItem} />
                    ))}
                </Picker>
            </View>

            <Text style={styles(theme).label}>Descrição (Opcional)</Text>
             <View style={styles(theme).inputContainer}>
                 {/* Use a cor primária para o ícone */}
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

          <View style={styles(theme).card}>
            <Text style={styles(theme).label}>Adicionar Foto (Opcional)</Text>
            {imageUri ? (
              <View style={styles(theme).imagePreviewContainer}>
                <TouchableOpacity onPress={() => setFullScreenVisible(true)} style={styles(theme).imageWrapper}>
                    <Image source={{ uri: imageUri }} style={styles(theme).imagePreview} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveImage} style={styles(theme).removeImageButton}>
                  {/* Use a cor de erro para o ícone */}
                  <Feather name="x-circle" size={28} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles(theme).imagePickerButtons}>
                <TouchableOpacity onPress={() => pickImage(false)} style={styles(theme).imageButton}>
                  {/* Use a cor primária para o ícone */}
                  <Feather name="image" size={24} color={theme.colors.primary} />
                  <Text style={styles(theme).imageButtonText}>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImage(true)} style={styles(theme).imageButton}>
                  {/* Use a cor primária para o ícone */}
                  <Feather name="camera" size={24} color={theme.colors.primary} />
                  <Text style={styles(theme).imageButtonText}>Câmera</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={handleAddAlert} style={styles(theme).submitButton} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} /> 
            ) : (
              <>
                {/* Use a cor onPrimary para o ícone */}
                <Ionicons name="send" size={20} color={theme.colors.onPrimary} />
                <Text style={styles(theme).submitButtonText}>Enviar Alerta</Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal for Full Screen Image */}
      <Modal visible={fullScreenVisible} transparent animationType="fade" onRequestClose={() => setFullScreenVisible(false)}>
        <Pressable style={styles(theme).modalBackground} onPress={() => setFullScreenVisible(false)}>
          <Image source={{ uri: imageUri! }} style={styles(theme).fullImage} resizeMode="contain" />
           <TouchableOpacity style={styles(theme).closeModalButton} onPress={() => setFullScreenVisible(false)}>
                {/* Use a cor onPrimary para o ícone */}
                <Feather name="x" size={30} color={theme.colors.onPrimary} />
            </TouchableOpacity>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');


const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background }, 
  container: { flex: 1 },
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
  pickerContainer: {
      paddingHorizontal: 0, 
      paddingLeft: 12, 
  },
  picker: {
    flex: 1,
    height: 50,
    color: theme.colors.textPrimary, 
    
  },
  pickerItem: {
      fontSize: 16,
      color: theme.colors.textPrimary, 
  },
  imagePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  imageButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.divider, 
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  imageButtonText: {
    marginTop: 5,
    color: theme.colors.primary, 
    fontWeight: '500',
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
    position: 'relative',
},
  imageWrapper: {
      borderRadius: 15,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border, 
  },
  imagePreview: {
    width: width * 0.8, 
    height: width * 0.5, 
    borderRadius: 15,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.colors.surface, 
    borderRadius: 15,
    padding: 2,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary, 
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
    shadowColor: theme.colors.black, 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: { color: theme.colors.onPrimary, fontSize: 18, fontWeight: 'bold' }, 
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeModalButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      padding: 10,
  },
});

export default AddAlertScreen;


