import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';
import { TipoSabor } from '../data/datos';

type TypeConfig = {
  icon: string;
  label: string;
  badgeStyle: any;
  color: string;
};

interface SaleItemProps {
  item: any;
  index: number;
  getTypeConfig: (tipo: TipoSabor | string) => TypeConfig;
}

const SaleItem: React.FC<SaleItemProps> = ({ item, index, getTypeConfig }) => {
  const typeConfig = getTypeConfig(item.tipo);
  
  return (
    <View style={[
      styles.saleItem,
      index === 0 && styles.firstItem
    ]}>
      <View style={styles.itemLeft}>
        <View style={[styles.typeBadge, typeConfig.badgeStyle]}>
          <Text style={styles.typeText}>
            {typeConfig.icon}
          </Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.titulo}
          </Text>
          <Text style={styles.itemQuantity}>
            {item.cantidad} unidades • ${item.precioUnitario.toFixed(2)} c/u
          </Text>
          <Text style={styles.itemDate}>
            {new Date(item.fecha).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.itemRevenue}>+${item.ingresoTotal.toFixed(2)}</Text>
        <View style={styles.revenueBadge}>
          <Text style={styles.revenueBadgeText}>
            {typeConfig.label}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  saleItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 0,
  },
  firstItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLOR_PALETTE.success,
    shadowOpacity: 0.1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waterBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  milkBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  candyBadge: {
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
  },
  defaultBadge: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  typeText: {
    fontSize: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: { 
    fontWeight: '600', 
    fontSize: 16,
    color: COLOR_PALETTE.textPrimary,
    marginBottom: 2,
  },
  itemQuantity: { 
    fontSize: 14, 
    color: COLOR_PALETTE.textSecondary,
    marginBottom: 2,
  },
  itemDate: { 
    fontSize: 12, 
    color: COLOR_PALETTE.textLight,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemRevenue: { 
    color: COLOR_PALETTE.success, 
    fontWeight: 'bold', 
    fontSize: 16,
    marginBottom: 4,
  },
  revenueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLOR_PALETTE.background,
    borderRadius: 6,
  },
  revenueBadgeText: {
    fontSize: 10,
    color: COLOR_PALETTE.textSecondary,
    fontWeight: '500',
  },
});

export default SaleItem;