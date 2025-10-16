// components/ToastComponent.tsx
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLOR_PALETTE } from '../utils/colors';

const { height } = Dimensions.get('window');
const TOAST_HEIGHT = 70;

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    duration: number;
    onHide: () => void;
}

const ToastComponent: React.FC<ToastProps> = ({ message, type, duration, onHide }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(-TOAST_HEIGHT)).current;

    const config = {
        success: { icon: 'checkmark-circle', color: COLOR_PALETTE.success, background: '#e6fffa' },
        warning: { icon: 'alert-circle', color: COLOR_PALETTE.warning, background: '#fff9e6' },
        error: { icon: 'close-circle', color: COLOR_PALETTE.error, background: '#ffe6e6' },
        info: { icon: 'information-circle', color: COLOR_PALETTE.info, background: '#e6f0ff' },
    }[type];

    useEffect(() => {
        // 1. Mostrar (Animación de entrada)
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(translateYAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();

        // 2. Ocultar después de la duración
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(translateYAnim, { toValue: -TOAST_HEIGHT, duration: 300, useNativeDriver: true }),
            ]).start(() => onHide()); // Ejecutar onHide al finalizar la animación
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onHide, fadeAnim, translateYAnim]);

    return (
        <Animated.View style={[
            styles.container,
            { backgroundColor: config.background },
            { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }
        ]}>
            <Ionicons name={config.icon as any} size={20} color={config.color} />
            <Text style={[styles.message, { color: config.color }]}>{message}</Text>
        </Animated.View>
    );
};

export default ToastComponent;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50, // Debajo de la zona de seguridad del iPhone/Android
        width: '90%',
        alignSelf: 'center',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000, // Asegura que esté por encima de todo
    },
    message: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
        flexShrink: 1,
    },
});