import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';

const PERIOD_OPTIONS = [
  { label: 'Hoy', value: 'today' },
  { label: '7 Días', value: 7 },
  { label: '30 Días', value: 30 },
  { label: 'Todo', value: null },
];

interface PeriodSelectorProps {
  selectedPeriod: string | number | null;
  onPeriodChange: (value: string | number | null) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  selectedPeriod, 
  onPeriodChange 
}) => {
  return (
    <View style={styles.periodSelector}>
      {PERIOD_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.label}
          style={[
            styles.periodButton, 
            selectedPeriod === option.value && styles.periodButtonActive
          ]}
          onPress={() => onPeriodChange(option.value)}
        >
          <Text style={[
            styles.periodText, 
            selectedPeriod === option.value && styles.periodTextActive
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  periodButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.surface,
  },
  periodButtonActive: {
    backgroundColor: COLOR_PALETTE.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  periodText: {
    fontWeight: '500',
    color: COLOR_PALETTE.textPrimary,
    fontSize: 12,
  },
  periodTextActive: {
    color: COLOR_PALETTE.surface,
    fontWeight: 'bold',
  },
});

export default PeriodSelector;