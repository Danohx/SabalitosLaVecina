import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';

interface SummaryCardProps {
  totalRevenue: number;
  selectedPeriod: string | number | null;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalRevenue, selectedPeriod }) => {
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'HOY';
      case 7: return '7 DÍAS';
      case 30: return '30 DÍAS';
      default: return 'TOTAL';
    }
  };

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>💰</Text>
        </View>
        <View>
          <Text style={styles.totalLabel}>
            INGRESOS TOTALES ({getPeriodLabel()})
          </Text>
          <Text style={styles.totalValue}>${totalRevenue.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.trendIndicator}>
        <Text style={styles.trendText}>
          {selectedPeriod ? 'Filtro Activo' : 'Histórico'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: COLOR_PALETTE.primary,
    padding: 24,
    borderRadius: 16,
    marginVertical: 20,
    shadowColor: COLOR_PALETTE.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  totalValue: {
    color: COLOR_PALETTE.surface,
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  trendIndicator: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendText: {
    color: COLOR_PALETTE.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SummaryCard;