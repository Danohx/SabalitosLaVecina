// components/SaleQuantityModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

interface SaleQuantityModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    flavorTitle: string; // Título del sabor para mostrar en el modal
    maxStock: number; // Stock disponible (para validación)
}

const SaleQuantityModal: React.FC<SaleQuantityModalProps> = ({ visible, onClose, onConfirm, flavorTitle, maxStock }) => {
    const [quantityInput, setQuantityInput] = useState('1'); // Inicialmente 1

    const handleConfirm = () => {
        const quantity = parseInt(quantityInput, 10);
        
        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor, introduce una cantidad válida.");
            return;
        }
        if (quantity > maxStock) {
            alert(`No puedes vender ${quantity} unidades. Stock disponible: ${maxStock}.`);
            return;
        }

        onConfirm(quantity);
        setQuantityInput('1'); // Resetear input
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Vender {flavorTitle}</Text>
                    <Text style={modalStyles.stockText}>Stock Disponible: {maxStock}</Text>
                    
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Cantidad a vender"
                        onChangeText={setQuantityInput}
                        value={quantityInput}
                        keyboardType="numeric" // Solo teclado numérico
                        autoFocus={true}
                    />

                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity 
                            style={[modalStyles.button, modalStyles.buttonCancel]}
                            onPress={onClose}
                        >
                            <Text style={modalStyles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[modalStyles.button, modalStyles.buttonConfirm]}
                            onPress={handleConfirm}
                        >
                            <Text style={modalStyles.textStyle}>Confirmar Venta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default SaleQuantityModal;

const modalStyles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalView: { margin: 20, backgroundColor: 'white', borderRadius: 15, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.25, elevation: 5, width: '80%' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    stockText: { marginBottom: 15, color: '#555' },
    input: { width: '100%', padding: 10, marginBottom: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, textAlign: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    button: { borderRadius: 8, padding: 10, elevation: 2, width: '48%', alignItems: 'center' },
    buttonCancel: { backgroundColor: '#ccc' },
    buttonConfirm: { backgroundColor: '#f4511e' },
    textStyle: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});