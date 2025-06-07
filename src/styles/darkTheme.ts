import { TextStyle, ViewStyle } from 'react-native';

const colors = {
  primary: '#90CAF9',         
  primaryVariant: '#64B5F6',   
  secondary: '#CE93D8',        
  secondaryVariant: '#BA68C8',  
  background: '#121212',        
  surface: '#1E1E1E',          
  error: '#EF9A9A',            
  success: '#A5D6A7',          
  warning: '#FFD54F',          

  onPrimary: '#000000',        
  onSecondary: '#000000',        
  onBackground: '#FFFFFF',      
  onSurface: '#FFFFFF',        
  onError: '#000000',         
  onSuccess: '#000000',        
  onWarning: '#000000',        

  textPrimary: '#FFFFFF',      
  textSecondary: '#B0B0B0',      
  textDisabled: '#757575',      
  border: '#424242',            
  divider: '#303030',          
  ripple: 'rgba(144, 202, 249, 0.1)', 

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
    standard: (x: number) => x, 
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


