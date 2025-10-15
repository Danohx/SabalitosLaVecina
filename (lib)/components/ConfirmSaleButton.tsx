// components/ConfirmSaleButton.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '../utils/colors';

interface ConfirmSaleButtonProps {
    isActive: boolean;
    onPress: () => void;
    totalCost: number;
}

const ConfirmSaleButton: React.FC<ConfirmSaleButtonProps> = ({ isActive, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]}
            onPress={onPress}
            disabled={!isActive}
        >
            <Text style={styles.buttonText}>
                {isActive ? 'Confirmar Venta' : 'Carrito Vacío'}
            </Text>
        </TouchableOpacity>
    );
};

export default ConfirmSaleButton;

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 10,
    },
    activeButton: {
        backgroundColor: COLOR_PALETTE.success,
    },
    inactiveButton: {
        backgroundColor: COLOR_PALETTE.textLight,
    },
    buttonText: {
        color: COLOR_PALETTE.surface,
        fontSize: 18,
        fontWeight: 'bold',
    },
});