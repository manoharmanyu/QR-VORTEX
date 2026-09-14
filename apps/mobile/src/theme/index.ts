export const colors = {
  primary: '#10B981', // Emerald Green
  primaryLight: '#34D399',
  primaryDark: '#059669',
  background: '#F3F4F6', // Off-white/light gray for Neumorphism
  surface: 'rgba(255, 255, 255, 0.7)', // Semi-transparent for Glassmorphism
  surfaceSolid: '#FFFFFF',
  text: '#1F2937', // Dark gray
  textSecondary: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: 'rgba(255, 255, 255, 0.4)',
};

export const shadows = {
  neumorphic: {
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  }
};

export const theme = {
  colors,
  shadows
};
