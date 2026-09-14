import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScanResult {
  id: string;
  url: string;
  risk_score: number;
  status: 'SAFE' | 'WARNING' | 'MALICIOUS';
  signals: string[];
  timestamp: number;
}

interface HistoryContextType {
  scans: ScanResult[];
  addScan: (scan: Omit<ScanResult, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType>({
  scans: [],
  addScan: () => {},
  clearHistory: () => {}
});

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('@qrshield_history');
      if (stored) {
        setScans(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  const addScan = async (scanData: Omit<ScanResult, 'id' | 'timestamp'>) => {
    const newScan: ScanResult = {
      ...scanData,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    const updated = [newScan, ...scans];
    setScans(updated);
    try {
      await AsyncStorage.setItem('@qrshield_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  const clearHistory = async () => {
    setScans([]);
    await AsyncStorage.removeItem('@qrshield_history');
  };

  return (
    <HistoryContext.Provider value={{ scans, addScan, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
