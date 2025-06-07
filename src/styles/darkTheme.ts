import { TextStyle, ViewStyle } from 'react-native';

const colors = {
  primary: '#90CAF9',          // Light blue for primary elements
  primaryVariant: '#64B5F6',    // Slightly darker light blue
  secondary: '#CE93D8',        // Light purple for secondary elements
  secondaryVariant: '#BA68C8',  // Slightly darker light purple
  background: '#121212',        // Dark background
  surface: '#1E1E1E',          // Darker surface for cards, etc.
  error: '#EF9A9A',            // Light red for errors
  success: '#A5D6A7',          // Light green for success
  warning: '#FFD54F',          // Light yellow for warnings

  onPrimary: '#000000',        // Text on primary (black)
  onSecondary: '#000000',        // Text on secondary (black)
  onBackground: '#FFFFFF',      // Text on background (white)
  onSurface: '#FFFFFF',        // Text on surfaces (white)
  onError: '#000000',          // Text on error (black)
  onSuccess: '#000000',        // Text on success (black)
  onWarning: '#000000',        // Text on warning (black)

  textPrimary: '#FFFFFF',      // Primary text color (white)
  textSecondary: '#B0B0B0',      // Secondary text color (light gray)
  textDisabled: '#757575',      // Disabled text color (gray)
  border: '#424242',            // Border color (dark gray)
  divider: '#303030',          // Divider color (even darker gray)
  ripple: 'rgba(144, 202, 249, 0.1)', // Ripple effect based on primary

  white: '#FFFFFF',
  black: '#000000',
};

const typography = {
  h1: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  } as TextStyle,
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  } as TextStyle,
  subtitle1: {
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.15,
  } as TextStyle,
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  } as TextStyle,
  body1: {
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.5,
  } as TextStyle,
  body2: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: 0.25,
  } as TextStyle,
  button: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  } as const,
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    letterSpacing: 0.4,
  } as TextStyle,
  overline: {
    fontSize: 10,
    fontWeight: 'normal',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  } as TextStyle,
};

const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
};

const elevation = {
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

const animation = {
  timing: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    standard: (x: number) => x, // linear (pode substituir por bezier ou Easing APIs)
  },
};

const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  } as ViewStyle,
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...elevation[1],
  } as ViewStyle,
};

export const darkTheme = {
  colors,
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
  commonStyles,
};


