import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, AlertTriangle, XOctagon, Inbox } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { NeuButton } from '../components/NeuButton';
import { theme } from '../theme';
import { useHistory } from '../context/HistoryContext';

export const HomeScreen = ({ navigation }: any) => {
  const { scans } = useHistory();
  
  const totalScans = scans.length;
  const threatsBlocked = scans.filter(s => s.status === 'MALICIOUS').length;
  
  const recentScans = scans.slice(0, 3); // Get top 3 most recent

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ShieldCheck color={theme.colors.primary} size={48} />
          <Text style={styles.title}>QRShield</Text>
          <Text style={styles.subtitle}>Scan. Analyze. Stay Safe.</Text>
        </View>

        <GlassCard style={styles.statusCard}>
          <Text style={styles.statusTitle}>Protection Status</Text>
          <Text style={styles.statusActive}>Active</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <ShieldCheck color={theme.colors.primary} size={24} />
              <Text style={styles.statLabel}>{totalScans}</Text>
              <Text style={styles.statSub}>Total Scans</Text>
            </View>
            <View style={styles.stat}>
              <XOctagon color={theme.colors.danger} size={24} />
              <Text style={styles.statLabel}>{threatsBlocked}</Text>
              <Text style={styles.statSub}>Threats Blocked</Text>
            </View>
          </View>
          <NeuButton 
            title="Scan QR Code" 
            onPress={() => navigation.navigate('ScanTab')} 
            style={{ marginTop: 20 }}
          />
        </GlassCard>

        <Text style={styles.sectionTitle}>Recent Scans</Text>
        
        {recentScans.length === 0 ? (
           <GlassCard style={styles.emptyCard}>
             <Inbox color={theme.colors.textSecondary} size={32} />
             <Text style={styles.emptyText}>Nill</Text>
             <Text style={styles.emptySub}>No scans yet.</Text>
           </GlassCard>
        ) : (
          recentScans.map((item, index) => {
            const isSafe = item.status === 'SAFE';
            const isWarning = item.status === 'WARNING';
            
            let color = theme.colors.danger;
            if (isSafe) color = theme.colors.success;
            if (isWarning) color = theme.colors.warning;

            const Icon = isSafe ? ShieldCheck : (isWarning ? AlertTriangle : XOctagon);

            return (
              <GlassCard key={item.id || index} style={styles.recentCard}>
                <View style={styles.scanRow}>
                  <Icon color={color} size={24} />
                  <View style={styles.scanInfo}>
                    <Text style={styles.scanUrl} numberOfLines={1}>{item.url}</Text>
                    <Text style={styles.scanRisk}>{item.status} ({item.risk_score}/100)</Text>
                  </View>
                </View>
              </GlassCard>
            )
          })
        )}

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
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
  statusCard: {
    marginBottom: 30,
  },
  statusTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  statusActive: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 5,
  },
  statSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  recentCard: {
    marginBottom: 10,
    padding: 15,
  },
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanInfo: {
    marginLeft: 15,
    flex: 1,
  },
  scanUrl: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  scanRisk: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  }
});
