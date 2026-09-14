import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck, AlertTriangle, XOctagon, Inbox } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { theme } from '../theme';
import { useHistory } from '../context/HistoryContext';

export const HistoryScreen = () => {
  const { scans } = useHistory();

  const total = scans.length;
  const safeCount = scans.filter(s => s.status === 'SAFE').length;
  const warningCount = scans.filter(s => s.status === 'WARNING').length;
  const maliciousCount = scans.filter(s => s.status === 'MALICIOUS').length;

  const safePct = total === 0 ? 0 : Math.round((safeCount / total) * 100);
  const warnPct = total === 0 ? 0 : Math.round((warningCount / total) * 100);
  const malPct = total === 0 ? 0 : Math.round((maliciousCount / total) * 100);

  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.statsCard}>
          <View style={styles.pieChart}>
            <Text style={styles.pieNumber}>{safePct}%</Text>
            <Text style={styles.pieText}>Safe</Text>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.legendText}>Safe: {safePct}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.colors.warning }]} />
              <Text style={styles.legendText}>Warning: {warnPct}%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: theme.colors.danger }]} />
              <Text style={styles.legendText}>Blocked: {malPct}%</Text>
            </View>
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Recent Scans</Text>

        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Inbox color={theme.colors.textSecondary} size={48} />
            <Text style={styles.emptyText}>Nill</Text>
            <Text style={styles.emptySub}>No scans have been done yet.</Text>
          </View>
        ) : (
          scans.map((item, index) => {
            const isSafe = item.status === 'SAFE';
            const isWarning = item.status === 'WARNING';
            
            let color = theme.colors.danger;
            if (isSafe) color = theme.colors.success;
            if (isWarning) color = theme.colors.warning;

            const Icon = isSafe ? ShieldCheck : (isWarning ? AlertTriangle : XOctagon);

            return (
              <GlassCard key={item.id || index} style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <Icon color={color} size={24} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.url} numberOfLines={1}>{item.url}</Text>
                    <Text style={styles.risk}>Risk: {item.risk_score}/100</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
              </GlassCard>
            );
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scroll: {
    padding: 20,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 30,
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: theme.colors.success,
    borderTopColor: theme.colors.warning,
    borderRightColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  pieText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  legend: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginTop: 15,
  },
  emptySub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 5,
  },
  historyCard: {
    marginBottom: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  url: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  risk: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: 10,
  }
});
