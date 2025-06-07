import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  icon?: string;
  showBackButton?: boolean;
  rightIcon?: string;
  onRightIconPress?: () => void;
  theme: any; 
}

const Header: React.FC<HeaderProps> = ({
  title,
  icon,
  showBackButton = false,
  rightIcon,
  onRightIconPress,
  theme,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.colors.primary,
          paddingTop:
            Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
        },
      ]}
    >
      <StatusBar
        barStyle={
          theme.colors.background === '#121212' ? 'light-content' : 'dark-content'
        }
        backgroundColor={theme.colors.primary}
      />

      {/* Lado esquerdo */}
      <View style={styles.side}>
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Centro */}
      <View style={styles.center}>
        {icon && (
          <Feather
            name={icon as any}
            size={20}
            color={theme.colors.onPrimary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>{title}</Text>
      </View>

      {/* Lado direito */}
      <View style={styles.side}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Feather name={rightIcon as any} size={22} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      elevation: 4,
      shadowColor: '#000',
    },
    side: {
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    center: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
    },
  });

export default Header;
