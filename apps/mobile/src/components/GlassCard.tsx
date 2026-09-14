import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
}

export const GlassCard = ({ children, style, intensity = 50 }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="light" style={styles.blurContainer}>
        {children}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: theme.colors.border,
    borderWidth: 1,
    ...theme.shadows.glass,
  },
  blurContainer: {
    padding: 20,
    backgroundColor: theme.colors.surface,
  },
});
