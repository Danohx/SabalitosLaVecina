import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Producto, AlertaStock } from '../data/datos';

const UMBRAL_ALERTA_AMARILLA = 10;
const UMBRAL_ALERTA_ROJA = 5;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000; 

// Configurar notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const useNotifications = () => {
    const [lastNotifiedTimestamps, setLastNotifiedTimestamps] = useState<Map<string, number>>(() => new Map()); 
    const [activeAlerts, setActiveAlerts] = useState<AlertaStock[]>([]);
    const isInitialLoad = useRef(true);


    const setupNotifications = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== 'granted') return;
            
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        } catch (error) {
            console.error('❌ Error configurando notificaciones:', error);
        }
    };

    const sendPushNotificationAlerts = async (alertsToSend: AlertaStock[]) => {
        for (const alert of alertsToSend) {
            try {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: '🚨 Alerta de Stock',
                        body: alert.mensaje,
                        sound: 'default',
                        data: { screen: 'inventario', saborId: alert.saborId },
                    },
                    trigger: {
                        seconds: 5,
                        channelId: 'default'
                    },
                });
            } catch (error) {
                console.error('❌ Error al programar notificación:', error);
            }
        }
    };

    // ✅ CORRECCIÓN: Usar useCallback para memoizar la función
    const calculateAlerts = useCallback((currentInventory: Producto[]) => {
        const newAlerts: AlertaStock[] = [];

        currentInventory.forEach(sabor => {
            if (sabor.stock <= UMBRAL_ALERTA_AMARILLA) {
                let nivel: 'Critico' | 'Bajo';
                let mensaje: string;
                
                if (sabor.stock <= UMBRAL_ALERTA_ROJA) {
                    nivel = 'Critico';
                    mensaje = sabor.stock === 0 
                        ? `¡AGOTADO! ${sabor.titulo}` 
                        : `¡CRÍTICO! ${sabor.titulo} - Solo ${sabor.stock} unidades`;
                } else {
                    nivel = 'Bajo';
                    mensaje = `Stock Bajo: ${sabor.titulo} - Quedan ${sabor.stock} unidades`;
                }
                
                newAlerts.push({
                    id: sabor.id,
                    titulo: `Alerta de ${sabor.titulo}`,
                    mensaje: mensaje,
                    nivel: nivel,
                    saborId: sabor.id,
                    stockActual: sabor.stock,
                });
            }
        });

        setActiveAlerts(newAlerts);
        
        const newLowStockIds = new Set(newAlerts.map(a => a.saborId));
        const alertsToNotify: AlertaStock[] = [];
        let updatedTimestamps = new Map(lastNotifiedTimestamps);
        let shouldUpdateState = false;

        const now = Date.now();

        // Solo notificar alertas críticas
        newAlerts.forEach(alert => {
            const lastNotifiedTime = updatedTimestamps.get(alert.saborId) || 0;

            if (alert.nivel === 'Critico') {
                if (now - lastNotifiedTime > MILLISECONDS_IN_A_DAY) {
                    alertsToNotify.push(alert);
                    updatedTimestamps.set(alert.saborId, now); // Registrar el nuevo tiempo de notificación
                    shouldUpdateState = true;
                }
            }
        });

        // Limpiar IDs resueltos
        [...updatedTimestamps.keys()].forEach(id => {
            if (!newLowStockIds.has(id)) {
                updatedTimestamps.delete(id);
                shouldUpdateState = true;
            }
        });

        if (alertsToNotify.length > 0 && !isInitialLoad.current) {
            sendPushNotificationAlerts(alertsToNotify);
        }

        if (shouldUpdateState) {
            setLastNotifiedTimestamps(updatedTimestamps);
        }

        // Marcar que la carga inicial terminó
        if (isInitialLoad.current) {
            setTimeout(() => {
                isInitialLoad.current = false;
            }, 1000);
        }
    }, [lastNotifiedTimestamps]); // ✅ Dependencia correcta

    useEffect(() => {
        setupNotifications();
    }, []);

    return {
        activeAlerts,
        calculateAlerts
    };
};