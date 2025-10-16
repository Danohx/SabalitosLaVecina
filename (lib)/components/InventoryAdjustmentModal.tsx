// components/InventoryAdjustmentModal.tsx
import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../utils/colors';
import { useToast } from '../context/ToastContext';

interface InventoryAdjustmentModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (change: number) => void;
    productTitle: string;
    stockActual: number;
}

const InventoryAdjustmentModal: React.FC<InventoryAdjustmentModalProps> = ({ 
    visible, 
    onClose, 
    onConfirm, 
    productTitle,
    stockActual
}) => {
    const [quantityInput, setQuantityInput] = useState('');
    const [isAdding, setIsAdding] = useState(true); // true = sumar, false = restar
    const { showToast } = useToast();

    // Reinicia el estado al abrirse
    React.useEffect(() => {
        if (visible) {
            setQuantityInput('');
            setIsAdding(true);
        }
    }, [visible]);

    const handleConfirm = useCallback(() => {
        const magnitude = parseInt(quantityInput || '0', 10);
        
        Keyboard.dismiss();

        if (isNaN(magnitude) || magnitude <= 0) {
            showToast("Ingrese una cantidad válida a sumar o restar.", 'error');
            return;
        }
        
        const change = isAdding ? magnitude : -magnitude;
        const newStock = stockActual + change;

        // Validación crítica para evitar stock negativo si el usuario resta
        if (!isAdding && newStock < 0) {
            showToast(`Error: No puede restar ${magnitude}. El stock restante es solo ${stockActual}.`, 'error');
            return;
        }

        onConfirm(change);
        onClose();
        showToast(`${productTitle} ajustado: ${isAdding ? '+' : '-'}${magnitude} unidades.`, 'info');

    }, [quantityInput, isAdding, stockActual, onConfirm, onClose, showToast, productTitle]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Ajuste Transaccional de Stock</Text>
                    <Text style={styles.modalSubtitle}>{productTitle} (Stock actual: {stockActual})</Text>

                    {/* Selector de Acción */}
                    <View style={styles.actionSelector}>
                        <TouchableOpacity
                            style={[styles.actionButton, isAdding && styles.actionButtonActive]}
                            onPress={() => setIsAdding(true)}
                        >
                            <Ionicons name="add-circle" size={24} color={isAdding ? COLOR_PALETTE.surface : COLOR_PALETTE.success} />
                            <Text style={[styles.actionText, isAdding && { color: COLOR_PALETTE.surface }]}>Añadir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, !isAdding && styles.actionButtonActive, !isAdding && styles.actionButtonSubtract]}
                            onPress={() => setIsAdding(false)}
                        >
                            <Ionicons name="remove-circle" size={24} color={!isAdding ? COLOR_PALETTE.surface : COLOR_PALETTE.error} />
                            <Text style={[styles.actionText, !isAdding && { color: COLOR_PALETTE.surface }]}>Restar</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        onChangeText={text => setQuantityInput(text.replace(/[^0-9]/g, ''))}
                        value={quantityInput}
                        keyboardType="numeric"
                        placeholder="Cantidad a ajustar (ej. 10)"
                        maxLength={4}
                        autoFocus={true}
                    />

                    <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirm}>
                        <Text style={styles.textStyle}>Confirmar Ajuste</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InventoryAdjustmentModal;

const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    modalView: { margin: 20, backgroundColor: COLOR_PALETTE.surface, borderRadius: 15, padding: 30, width: '85%', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: COLOR_PALETTE.textPrimary },
    modalSubtitle: { fontSize: 14, color: COLOR_PALETTE.textSecondary, marginBottom: 20, textAlign: 'center' },
    actionSelector: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
    actionButton: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 10, borderWidth: 2, borderColor: COLOR_PALETTE.border, alignItems: 'center', backgroundColor: COLOR_PALETTE.background },
    actionButtonActive: { borderColor: COLOR_PALETTE.primary, backgroundColor: COLOR_PALETTE.primary },
    actionButtonSubtract: { borderColor: COLOR_PALETTE.error, backgroundColor: COLOR_PALETTE.error },
    actionText: { fontSize: 16, fontWeight: '600', color: COLOR_PALETTE.textPrimary, marginTop: 4 },
    input: { width: '100%', height: 50, borderColor: COLOR_PALETTE.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, fontSize: 20, textAlign: 'center', marginBottom: 25, fontWeight: 'bold' },
    buttonConfirm: { backgroundColor: COLOR_PALETTE.success, width: '100%', borderRadius: 10, padding: 15, elevation: 2 },
    textStyle: { color: COLOR_PALETTE.surface, fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});