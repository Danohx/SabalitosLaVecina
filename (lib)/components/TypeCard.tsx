import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';
import { TipoSabor } from '../data/datos';

type AggregatedDataItem = {
  type: string;
  totalRevenue: number;
  transactionCount: number;
};

type TypeConfig = {
  icon: string;
  label: string;
  badgeStyle: any;
  color: string;
};

interface TypeCardProps {
  item: AggregatedDataItem;
  getTypeConfig: (tipo: TipoSabor | string) => TypeConfig;
}

const TypeCard: React.FC<TypeCardProps> = ({ item, getTypeConfig }) => {
  const typeConfig = getTypeConfig(item.type);
  
  return (
    <View style={[styles.typeCard, { borderLeftColor: typeConfig.color }]}>
      <Text style={styles.typeTitle}>{typeConfig.icon} {item.type}</Text>
      <Text style={styles.typeRevenue}>
        ${item.totalRevenue.toFixed(2)}
      </Text>
      <Text style={styles.typeCount}>
        {item.transactionCount} ventas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typeCard: {
    backgroundColor: COLOR_PALETTE.surface,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
  },
  typeTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: COLOR_PALETTE.textPrimary,
    marginBottom: 5,
  },
  typeRevenue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: COLOR_PALETTE.textPrimary,
  },
  typeCount: {
    fontSize: 12,
    color: COLOR_PALETTE.textSecondary,
    marginTop: 4,
  },
});

export default TypeCard;