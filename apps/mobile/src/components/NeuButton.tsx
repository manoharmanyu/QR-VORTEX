import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../theme';

interface Props {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'danger' | 'warning' | 'secondary';
}

export const NeuButton = ({ onPress, title, style, variant = 'primary' }: Props) => {
  const getBgColor = () => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'secondary': return theme.colors.surfaceSolid;
      default: return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    return variant === 'secondary' ? theme.colors.text : '#fff';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBgColor() },
        style,
        variant === 'secondary' ? theme.shadows.neumorphic : theme.shadows.glass
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
