import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, CircleDashed } from 'lucide-react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';
import { useHistory } from '../context/HistoryContext';

export const AnalyzingScreen = ({ route, navigation }: any) => {
  const { payload } = route.params;
  const [step, setStep] = useState(0);
  const { addScan } = useHistory();

  const steps = [
    "Decoding QR payload",
    "Extracting URL",
    "Querying Threat Intelligence",
    "Performing AI Security Analysis",
    "Finalizing Risk Score"
  ];

  useEffect(() => {
    // Start backend analysis
    analyzePayload(payload);
    
    // UI simulation for progress
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const analyzePayload = async (url: string) => {
    try {
      // Get the local IP of the development machine running Expo
      const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
      let backendIp = '127.0.0.1';
      if (hostUri) {
        backendIp = hostUri.split(':')[0];
      }
      
      const apiUrl = `http://${backendIp}:8000/api/v1/scan`;
      
      console.log(`Sending payload to: ${apiUrl}`);
      
      const response = await axios.post(apiUrl, { payload: url }, { timeout: 15000 });
      const data = response.data;
      
      // Force step to complete
      setStep(steps.length);
      
      const verdict = data.status.toUpperCase() === 'BLOCKED' ? 'MALICIOUS' : data.status.toUpperCase();
      
      addScan({
        url: url,
        risk_score: data.risk_score,
        status: verdict as any,
        signals: data.signals
      });

      if (verdict === 'SAFE') {
        // Safe — open URL directly, no warning needed
        Linking.openURL(url).catch(() => {});
        setTimeout(() => navigation.navigate('MainTabs'), 300);
      } else {
        // WARNING or MALICIOUS — show full Result screen
        setTimeout(() => {
          navigation.replace('Result', { 
            url, 
            risk_score: data.risk_score, 
            verdict, 
            signals: data.signals 
          });
        }, 500);
      }
      
    } catch (error) {
      console.error("Backend scan failed:", error);
      // Fallback if backend isn't running
      setStep(steps.length);
      
      addScan({
        url: url,
        risk_score: 50,
        status: 'WARNING',
        signals: ['Could not reach backend analysis server', 'Proceed with caution']
      });

      setTimeout(() => {
        navigation.replace('Result', { 
          url, 
          risk_score: 50, 
          verdict: 'WARNING', 
          signals: ['Could not reach backend analysis server', 'Proceed with caution'] 
        });
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Analyzing Destination</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.percentage}>{Math.min(Math.round((step / steps.length) * 100), 100)}%</Text>
        <Text style={styles.progressText}>Analyzing...</Text>
      </View>

      <GlassCard style={styles.stepsCard}>
        {steps.map((s, index) => {
          const isComplete = step > index;
          const isActive = step === index;
          return (
            <View key={index} style={styles.stepRow}>
              {isComplete ? (
                <CheckCircle2 color={theme.colors.success} size={20} />
              ) : (
                <CircleDashed color={isActive ? theme.colors.primary : theme.colors.textSecondary} size={20} />
              )}
              <Text style={[styles.stepText, isActive && styles.stepTextActive, isComplete && styles.stepTextComplete]}>
                {s}
              </Text>
            </View>
          );
        })}
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
    marginBottom: 40,
  },
  progressContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.surfaceSolid,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.neumorphic,
    marginBottom: 40,
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
  stepsCard: {
    width: '85%',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepText: {
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  stepTextActive: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  stepTextComplete: {
    color: theme.colors.success,
  }
});
