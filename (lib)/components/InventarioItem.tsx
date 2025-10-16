// components/InventarioItem.tsx (ACTUALIZADO CON BOTONES +/- Y BOTÓN AJUSTAR)

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Producto } from '../data/datos';
import { COLOR_PALETTE } from '../utils/colors';
import { useToast } from '../context/ToastContext';
import InventoryAdjustmentModal from './InventoryAdjustmentModal'; 

interface InventarioItemProps {
    producto: Producto; 
    onUpdateStock: (id: string, newStock: number) => void; 
    onBorrar: (id: string) => void;
}

const InventarioItem: React.FC<InventarioItemProps> = React.memo(({ producto, onUpdateStock, onBorrar }) => {
    
    // ESTADO PARA EL MODAL
    const [modalVisible, setModalVisible] = useState(false);
    const { showToast } = useToast();

    // Función que calcula la cantidad final y luego llama a onUpdateStock
    const handleUpdateStock = useCallback((newStock: number, isQuickAction = false) => {
        
        // Evita actualizaciones si el stock es negativo por error (la validación principal es en el modal/hook)
        const finalStock = Math.max(0, newStock); 
        if (finalStock === producto.stock) return;

        onUpdateStock(producto.id, finalStock);
        
        if (isQuickAction) {
             const change = finalStock - producto.stock;
             const action = change > 0 ? "reabastecido" : "ajustado";
             const toastType = change > 0 ? 'success' : 'warning';
             showToast(`Ajuste rápido: ${producto.titulo} ${change > 0 ? '+' : ''}${change}. Stock actual: ${finalStock}.`, toastType);
        }
    }, [producto.stock, producto.id, producto.titulo, onUpdateStock, showToast]);

    // Función para manejar Ajustes Rápidos (+/- 1)
    const handleQuickAdjustment = useCallback((change: number) => {
        const newStock = producto.stock + change;
        
        // Validación para +/- 1. Si intenta restar -1 y es 0, no hacer nada.
        if (change < 0 && newStock < 0) {
            showToast(`Stock de ${producto.titulo} ya está en 0.`, 'warning');
            return;
        }

        handleUpdateStock(newStock, true);
    }, [producto.stock, handleUpdateStock, producto.titulo, showToast]);

    // Función que se activa al confirmar el MODAL (Ajuste Preciso)
    const handleModalConfirm = useCallback((change: number) => {
        const newStock = producto.stock + change;
        // La validación de stock negativo se hace dentro del modal.
        onUpdateStock(producto.id, newStock);
    }, [producto.stock, onUpdateStock]);

    const handleBorrar = () => { 
        Alert.alert(
            "Confirmar Borrado",
            `¿Estás seguro de que quieres eliminar ${producto.titulo} del inventario?`,
            [{ text: "Cancelar", style: "cancel" }, { text: "Eliminar", style: "destructive", onPress: () => onBorrar(producto.id) }]
        );
    };

    const isCritical = producto.stock <= 5; 

    return (
        <View style={[itemStyles.container, isCritical && itemStyles.criticalContainer]}>
            <Image source={producto.imagen} style={itemStyles.imagen} />
            
            <View style={itemStyles.info}>
                <Text style={itemStyles.titulo}>{producto.titulo}</Text>
                <Text style={itemStyles.categoria}>{producto.categoria} | ${(producto.precio || 0).toFixed(2)}</Text>
                
                {/* Contenedor de acciones rápidas */}
                <View style={itemStyles.quickActions}>
                    
                    {/* Botón para abrir el Modal Transaccional */}
                    <TouchableOpacity 
                        style={[itemStyles.adjustButton]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={itemStyles.adjustText}>AJUSTAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Control de Ajuste Unitario (+/-) y Stock Actual */}
            <View style={itemStyles.stockControls}>
                <TouchableOpacity 
                    style={[itemStyles.unitButton, itemStyles.unitButtonMinus]}
                    onPress={() => handleQuickAdjustment(-1)}
                >
                    <Text style={itemStyles.unitText}>-</Text>
                </TouchableOpacity>
                
                <Text style={[itemStyles.cantidad, isCritical && itemStyles.cantidadCritical]}>
                    {producto.stock}
                </Text>

                <TouchableOpacity 
                    style={[itemStyles.unitButton, itemStyles.unitButtonPlus]}
                    onPress={() => handleQuickAdjustment(1)}
                >
                    <Text style={itemStyles.unitText}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={itemStyles.deleteButton} onPress={handleBorrar}>
                <Ionicons name="trash-outline" size={20} color={COLOR_PALETTE.error} />
            </TouchableOpacity>

            <InventoryAdjustmentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleModalConfirm}
                productTitle={producto.titulo}
                stockActual={producto.stock}
            />
        </View>
    );
});

export default InventarioItem;

const itemStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLOR_PALETTE.surface,
        borderRadius: 10,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLOR_PALETTE.accent,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    criticalContainer: { borderLeftColor: COLOR_PALETTE.error },
    imagen: { width: 45, height: 45, borderRadius: 8, marginRight: 12, flexShrink: 0 },
    info: { flex: 1, marginRight: 10 },
    titulo: { fontSize: 16, fontWeight: 'bold', color: COLOR_PALETTE.textPrimary, marginBottom: 2 },
    categoria: { fontSize: 12, color: COLOR_PALETTE.textSecondary, fontStyle: 'italic' },
    deleteButton: { padding: 5, flexShrink: 0 },
    cantidadCritical: { color: COLOR_PALETTE.error, fontWeight: 'bold' },

    // ✅ NUEVOS ESTILOS PARA CONTROLES DE STOCK UNITARIO
    stockControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        borderRadius: 15,
        paddingHorizontal: 5,
        flexShrink: 0,
    },
    unitButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitButtonMinus: {
        backgroundColor: COLOR_PALETTE.error,
    },
    unitButtonPlus: {
        backgroundColor: COLOR_PALETTE.success,
    },
    unitText: {
        color: COLOR_PALETTE.surface,
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 20,
    },
    cantidad: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: COLOR_PALETTE.textPrimary,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'center',
    },

    // ✅ ESTILOS PARA EL BOTÓN DE AJUSTE PRECISO
    quickActions: {
        flexDirection: 'row',
        marginTop: 5,
    },
    adjustButton: {
        backgroundColor: COLOR_PALETTE.primary,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    adjustText: {
        color: COLOR_PALETTE.surface,
        fontSize: 12,
        fontWeight: 'bold',
    },
});