// components/SaleQuantityModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../utils/colors';
import { useToast } from '../context/ToastContext';

interface SaleQuantityModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    maxStock: number;
    productTitle: string;
    currentQuantity: number;
}

const SaleQuantityModal: React.FC<SaleQuantityModalProps> = ({ 
    visible, 
    onClose, 
    onConfirm, 
    maxStock, 
    productTitle,
    currentQuantity 
}) => {
    const [quantityInput, setQuantityInput] = useState(String(currentQuantity > 0 ? currentQuantity : 1));

    const { showToast } = useToast();

    useEffect(() => {
        // Resetear el input cuando el modal se abre/cierra
        if (visible) {
            setQuantityInput(String(currentQuantity > 0 ? currentQuantity : 1));
        }
    }, [visible, currentQuantity]);

    const handleConfirm = useCallback(() => {
        const quantity = parseInt(quantityInput || '0', 10);
        
        Keyboard.dismiss();

        if (isNaN(quantity) || quantity <= 0) {
            showToast("La cantidad debe ser un número positivo.", 'error');
            return;
        }

        if (quantity > maxStock) {
            showToast(`Error: Solo hay ${maxStock} unidades de ${productTitle}.`, 'warning');
            return;
        }

        onConfirm(quantity);
        onClose();
    }, [quantityInput, maxStock, productTitle, onConfirm, onClose]);

    const handleQuantityChange = (text: string) => {
        // Permite solo números
        const newText = text.replace(/[^0-9]/g, '');
        setQuantityInput(newText);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Ajustar Cantidad</Text>
                    <Text style={styles.modalSubtitle}>{productTitle}</Text>
                    <Text style={styles.stockText}>Stock disponible: {maxStock}</Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={handleQuantityChange}
                        value={quantityInput}
                        keyboardType="numeric"
                        placeholder="Cantidad"
                        maxLength={4}
                        autoFocus={true}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                            <Text style={styles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonConfirm]} onPress={handleConfirm}>
                            <Text style={styles.textStyle}>
                                {currentQuantity > 0 ? 'Actualizar' : 'Agregar'}
                            </Text>
                            <Ionicons name="cart" size={18} color={COLOR_PALETTE.surface} style={{ marginLeft: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SaleQuantityModal;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: COLOR_PALETTE.surface,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLOR_PALETTE.textPrimary,
    },
    modalSubtitle: {
        fontSize: 16,
        color: COLOR_PALETTE.textSecondary,
        marginBottom: 10,
    },
    stockText: {
        fontSize: 14,
        color: COLOR_PALETTE.primaryDark,
        marginBottom: 20,
        fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: COLOR_PALETTE.border,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: 'bold',
        color: COLOR_PALETTE.textPrimary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 10,
    },
    button: {
        flex: 1,
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: COLOR_PALETTE.textLight,
    },
    buttonConfirm: {
        backgroundColor: COLOR_PALETTE.success,
    },
    textStyle: {
        color: COLOR_PALETTE.surface,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});