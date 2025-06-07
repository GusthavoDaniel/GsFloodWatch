// LoginScreenFinalDesign.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Pressable,
  LayoutAnimation,
  UIManager,
  Image,
  StatusBar,
  TextStyle,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Keep for loading state
import * as Haptics from 'expo-haptics';

// Assuming these types exist
import { RootStackParamList } from '../types/navigation';

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Define specific types based on React Native's TextStyle ---
type FontWeight = TextStyle['fontWeight'];
type TextTransform = TextStyle['textTransform'];

type Props = NativeStackScreenProps<RootStackParamList, 'Login'> & {
  theme: any;
};

// --- Input Component (Simplified for Reference Image Style) ---
interface FormInputProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  error?: string | null;
  theme: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: object;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, theme, style, leftIcon, rightIcon, containerStyle, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const componentStyles = loginStyles(theme);

  return (
    <View style={[componentStyles.inputOuterContainer, containerStyle]}>
      <Text style={componentStyles.inputLabel}>{label}</Text>
      <View style={[
          componentStyles.inputContainer,
          isFocused && componentStyles.inputContainerFocused,
          error && componentStyles.inputContainerError,
        ]}>
        {leftIcon && <View style={componentStyles.inputIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            componentStyles.input,
            !props.editable && componentStyles.disabledInput,
            style,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={componentStyles.inputIconRight}>{rightIcon}</View>}
      </View>
      {/* Error text can be added here if needed, though not in reference */}
      {/* {error && <Text style={componentStyles.errorText}>{error}</Text>} */}
    </View>
  );
};
// --- End Simplified Input Component ---

const LoginScreen: React.FC<Props> = ({ navigation, theme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current; // Keep animation for button press

  // Basic validation (can be enhanced)
  const validateFields = () => {
    let isValid = true;
    if (!username.trim()) {
        isValid = false;
        // Optionally show toast or simple alert
        console.warn('Username is required');
    }
    if (!password) {
        isValid = false;
        console.warn('Password is required');
    }
    return isValid;
  }

  const handleLogin = () => {
    if (!validateFields()) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 1500); // Simulate API call
  };

  // Button press animation handlers
  const onPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98, // Subtle scale down
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const styles = loginStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle={theme.colors.background === '#121212' ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <LinearGradient
          colors={[theme.colors.background, theme.colors.background]}
          style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Title Area */} 
        <View style={styles.headerContainer}>
          <Image
            // IMPORTANT: Replace with your actual logo path
            source={require('../../assets/flod.png')} // Usando a imagem disponível
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>FloodWatch</Text>
          <Text style={styles.subtitle}>Monitoramento Inteligente</Text>
        </View>

        {/* Form Card */} 
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <FormInput
            label="Usuário ou E-mail"
            placeholder="Digite seu usuário ou e-mail"
            theme={theme}
            value={username}
            onChangeText={setUsername}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            leftIcon={<Feather name="user" size={20} color={theme.colors.textSecondary} />}
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />
          <FormInput
            label="Senha"
            placeholder="Digite sua senha"
            theme={theme}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            returnKeyType="done"
            leftIcon={<Feather name="lock" size={20} color={theme.colors.textSecondary} />}
            rightIcon={
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} hitSlop={10}>
                <Feather name={passwordVisible ? "eye-off" : "eye"} size={20} color={theme.colors.textSecondary} />
              </Pressable>
            }
            containerStyle={{ marginBottom: theme.spacing.xl }} // More space before button
          />

          <Animated.View style={[{ transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85} // Slightly more visible press
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Links removed as per reference image */} 

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// --- Styles Function (Aligned with Reference Image) ---
const loginStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl, // Space between header and card
    marginTop: theme.spacing.lg,
  },
  logo: {
    width: 64, // Smaller logo as in reference
    height: 64,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.md, // Rounded square logo bg
    backgroundColor: theme.colors.primary, // Dark background for logo
    // Ensure the image inside fits well
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.subtitle1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.elevation[1], // Apply subtle shadow
  },
  inputOuterContainer: {
    // Container for label and input field
  },
  inputLabel: {
    ...theme.typography.h3, // Use h3 for label style
    fontSize: 14, // Explicit size from reference
    fontWeight: '500' as FontWeight,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs, // Slight indent for label
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      height: 52, // Input height
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: 'transparent', // Default no border
  },
  inputContainerFocused: {
      borderColor: theme.colors.primary, // Border on focus
      backgroundColor: theme.colors.surface, // White background on focus
  },
  inputContainerError: {
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.surface,
  },
  inputIcon: {
      marginRight: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
  },
  inputIconRight: {
      marginLeft: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 'normal' as FontWeight,
  },
  disabledInput: {
    color: theme.colors.textDisabled,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
    // No shadow needed based on reference
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textDisabled,
    opacity: 0.7,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.onPrimary,
  },
  // Links container removed
});

export default LoginScreen;

