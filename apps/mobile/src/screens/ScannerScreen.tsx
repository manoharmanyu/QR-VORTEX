import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';

export const ScannerScreen = ({ navigation }: any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
    });
    return unsubscribe;
  }, [navigation]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    // Proceed to analyzing screen with the URL
    navigation.navigate('Analyzing', { payload: data });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      <Text style={styles.subtitle}>Place the QR code inside the frame</Text>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
        <View style={styles.overlay}>
          <View style={styles.scanTarget} />
        </View>
      </View>

      <GlassCard style={styles.infoCard}>
        <Text style={styles.infoText}>
          QRShield prevents you from navigating to phishing sites by analyzing the destination before it opens.
        </Text>
      </GlassCard>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 10,
    marginBottom: 40,
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    ...theme.shadows.neumorphic,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  infoCard: {
    marginTop: 40,
    width: '85%',
  },
  infoText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  }
});
