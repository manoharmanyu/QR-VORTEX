import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, AlertTriangle, XOctagon } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { NeuButton } from '../components/NeuButton';
import { theme } from '../theme';

export const ResultScreen = ({ route, navigation }: any) => {
  const { url, risk_score, verdict, signals } = route.params;

  const isSafe = verdict === 'SAFE';
  const isWarning = verdict === 'WARNING';
  const isMalicious = verdict === 'MALICIOUS';

  const getVerdictColor = () => {
    if (isSafe) return theme.colors.success;
    if (isWarning) return theme.colors.warning;
    return theme.colors.danger;
  };

  const getVerdictIcon = () => {
    if (isSafe) return <ShieldCheck color={getVerdictColor()} size={64} />;
    if (isWarning) return <AlertTriangle color={getVerdictColor()} size={64} />;
    return <XOctagon color={getVerdictColor()} size={64} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <View style={[styles.iconContainer, { shadowColor: getVerdictColor() }]}>
            {getVerdictIcon()}
          </View>
          <Text style={[styles.verdictText, { color: getVerdictColor() }]}>
            {verdict === 'MALICIOUS' ? 'THREAT DETECTED' : verdict}
          </Text>
          <Text style={styles.verdictSub}>
            {isSafe && "This QR code is safe"}
            {isWarning && "Proceed with caution"}
            {isMalicious && "This QR code is unsafe"}
          </Text>
        </View>

        <GlassCard style={styles.detailsCard}>
          <Text style={styles.label}>Destination</Text>
          <Text style={styles.value} numberOfLines={2}>{url}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Risk Score</Text>
            <View style={[styles.badge, { backgroundColor: getVerdictColor() + '20' }]}>
              <Text style={[styles.badgeText, { color: getVerdictColor() }]}>
                {risk_score}/100
              </Text>
            </View>
          </View>
        </GlassCard>

        {!isSafe && signals.length > 0 && (
          <GlassCard style={[styles.threatCard, { borderColor: getVerdictColor() + '50' }]}>
            <Text style={[styles.threatTitle, { color: getVerdictColor() }]}>
              Detected Threats
            </Text>
            {signals.map((sig: string, idx: number) => (
              <View key={idx} style={styles.threatRow}>
                <AlertTriangle color={getVerdictColor()} size={16} />
                <Text style={styles.threatText}>{sig}</Text>
              </View>
            ))}
          </GlassCard>
        )}

        <View style={styles.actions}>
          {isMalicious ? (
            <NeuButton 
              title="Go Back Safely" 
              variant="secondary"
              onPress={() => navigation.navigate('HomeTab')}
            />
          ) : (
            <NeuButton 
              title="Open Website" 
              variant={isWarning ? 'warning' : 'primary'}
              onPress={() => alert(`Opening ${url}...`)}
            />
          )}
          {!isMalicious && (
            <NeuButton 
              title="Go Back" 
              variant="secondary"
              onPress={() => navigation.navigate('HomeTab')}
              style={{ marginTop: 15 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surfaceSolid,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.neumorphic,
  },
  verdictText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  verdictSub: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
  detailsCard: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  threatCard: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  threatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  threatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  threatText: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.colors.text,
  },
  actions: {
    width: '100%',
    marginTop: 20,
  }
});
