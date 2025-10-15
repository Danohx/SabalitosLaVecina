// app/(tabs)/alertas.tsx

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../(lib)/context/InventoryContext';
import { COLOR_PALETTE } from '../../(lib)/utils/colors';

interface NotificacionItemProps {
    alerta: any;
    onDismiss: (id: string) => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({ alerta, onDismiss }) => {
    const colorCode = alerta.nivel === 'Critico' ? COLOR_PALETTE.error : COLOR_PALETTE.warning;
    const bgColor = alerta.nivel === 'Critico' ? '#FFF5F5' : '#FFF8E1';

    return (
        <View style={[itemStyles.container, { backgroundColor: bgColor, borderLeftColor: colorCode }]}>
            <Ionicons name="warning-outline" size={24} color={colorCode} style={itemStyles.icon} />
            
            <View style={itemStyles.textContainer}>
                <Text style={itemStyles.titulo}>{alerta.titulo}</Text>
                <Text style={itemStyles.restante}>{alerta.mensaje}</Text>
                <Text style={itemStyles.categoria}>{alerta.categoria || 'General'}</Text>
            </View>
            
            <TouchableOpacity onPress={() => onDismiss(alerta.productoId)} style={itemStyles.dismissButton}>
                <Ionicons name="close-circle-outline" size={24} color={COLOR_PALETTE.textSecondary} />
            </TouchableOpacity>
        </View>
    );
};

const Notificaciones = () => {
    const { activeAlerts = [], isLoading } = useInventory();

    if (isLoading) {
        return <Text style={styles.loadingText}>Cargando alertas...</Text>;
    }

    const handleDismiss = (productoId: string) => {
        Alert.alert(
            "Alerta Descartada",
            "Para eliminar la alerta permanentemente, debes aumentar el stock en la pestaña Inventario."
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alertas de Stock</Text>
                <Text style={styles.headerSubtitle}>
                    {activeAlerts.length} {activeAlerts.length === 1 ? 'alerta activa' : 'alertas activas'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeAlerts.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={64} color={COLOR_PALETTE.success} />
                        <Text style={styles.emptyTitle}>🎉 No hay alertas de stock</Text>
                        <Text style={styles.emptySubtitle}>
                            Todo el inventario está en niveles seguros
                        </Text>
                    </View>
                ) : (
                    activeAlerts.map(alerta => (
                        <NotificacionItem 
                            key={alerta.id} 
                            alerta={alerta} 
                            onDismiss={handleDismiss} 
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default Notificaciones;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_PALETTE.background,
    },
    header: {
        backgroundColor: COLOR_PALETTE.primary,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLOR_PALETTE.surface,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLOR_PALETTE.surface,
        opacity: 0.9,
    },
    loadingText: { 
        flex: 1, 
        textAlign: 'center', 
        marginTop: 50,
        color: COLOR_PALETTE.textSecondary,
    },
    scrollContent: {
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLOR_PALETTE.success,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: COLOR_PALETTE.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});

const itemStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderLeftWidth: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: COLOR_PALETTE.textPrimary,
    },
    restante: {
        fontSize: 14,
        color: COLOR_PALETTE.textSecondary,
        marginBottom: 2,
    },
    categoria: {
        fontSize: 12,
        color: COLOR_PALETTE.textLight,
        fontStyle: 'italic',
    },
    dismissButton: {
        padding: 5,
    }
});