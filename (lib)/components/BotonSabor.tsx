// components/BotonSabor.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';

interface BotonSaborProps {
  titulo: string;
  imagenSource: any;
  onPress: () => void;
  onRemove: () => void;
  stock: number;
  cartQuantity: number;
  disabled: boolean;
  estilo?: ViewStyle;
}

const BotonSabor: React.FC<BotonSaborProps> = ({ titulo, imagenSource, onPress, onRemove, stock, cartQuantity, disabled, estilo }) => {
  const isLowStock = stock <= 5 && stock > 0;
  
  return (
    <TouchableOpacity 
      style={[
        styles.saborContainer, 
        estilo,
        disabled && styles.disabledContainer
      ]} 
      onPress={onPress} 
      activeOpacity={disabled ? 1 : 0.9} 
    >
      <Image source={imagenSource} style={styles.imagen} resizeMode="cover" />
      
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.tituloSabor}>{titulo}</Text>
          <Text style={[styles.stockText, isLowStock && styles.lowStockText]}>
            Stock: {stock}
          </Text>
          {cartQuantity > 0 && (
              <Text style={styles.cartQuantityText}>En carrito: {cartQuantity}</Text>
          )}
        </View>
        
        <View style={styles.cartControls}>
            {cartQuantity > 0 && (
                <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={onRemove}
                >
                    <Text style={styles.removeText}>-</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.addButton, disabled && styles.disabledButton]} 
              onPress={onPress}
              disabled={disabled}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BotonSabor;

const styles = StyleSheet.create({
  saborContainer: {
    width: '48%', 
    height: 150, 
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden', 
    borderColor: COLOR_PALETTE.border,
    borderWidth: 1, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imagen: {
    width: '100%',
    height: '100%',
    position: 'absolute', 
    borderRadius: 15,
  },
  infoContainer: {
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
  },
  tituloSabor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLOR_PALETTE.textPrimary,
  },
  stockText: { 
    fontSize: 12,
    color: COLOR_PALETTE.textSecondary,
    fontWeight: '600',
  },
  lowStockText: { 
    color: COLOR_PALETTE.error,
    fontWeight: 'bold',
  },
  cartQuantityText: {
    fontSize: 12,
    color: COLOR_PALETTE.info,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cartControls: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: COLOR_PALETTE.success, 
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: COLOR_PALETTE.secondary, 
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addText: {
    color: COLOR_PALETTE.surface,
    fontSize: 20,
    lineHeight: 28, 
    fontWeight: 'bold',
  },
  removeText: {
    color: COLOR_PALETTE.surface,
    fontSize: 20,
    lineHeight: 28,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  disabledButton: {
    backgroundColor: COLOR_PALETTE.textLight,
  }
});