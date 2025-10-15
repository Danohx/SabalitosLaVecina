import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Producto, AlertaStock } from '../data/datos';

const UMBRAL_ALERTA_AMARILLA = 10;
const UMBRAL_ALERTA_ROJA = 5;
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000; 

type NotifiedAlertLevel = 'Critico' | 'Bajo';
type NotifiedTimestamp = { 
    time: number; 
    level: NotifiedAlertLevel;
};

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
    const [lastNotifiedTimestamps, setLastNotifiedTimestamps] = useState<Map<string, NotifiedTimestamp>>(() => new Map()); 
    const [activeAlerts, setActiveAlerts] = useState<AlertaStock[]>([]);

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

    const calculateAlerts = useCallback((currentInventory: Producto[], inventoryIsLoading: boolean) => {
        if (inventoryIsLoading) return;

        const newAlerts: AlertaStock[] = [];

        currentInventory.forEach(sabor => {
            if (sabor.stock <= UMBRAL_ALERTA_AMARILLA) {
                let nivel: 'Critico' | 'Bajo' | 'Seguro';
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

        newAlerts.forEach(alert => {
            const lastNotified = updatedTimestamps.get(alert.saborId);
            const lastNotifiedTime = lastNotified?.time || 0;
            const lastNotifiedLevel = lastNotified?.level;

            if (alert.nivel === 'Critico' || alert.nivel === 'Bajo') {
                let shouldNotify = false;

                if (now - lastNotifiedTime > MILLISECONDS_IN_A_DAY)
                    shouldNotify = true;
                else if (alert.nivel === 'Critico' && lastNotifiedLevel === 'Bajo')
                    shouldNotify = true;

                if (shouldNotify) {
                    alertsToNotify.push(alert);
                    updatedTimestamps.set(alert.saborId, { time: now, level: alert.nivel }); 
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

        if (alertsToNotify.length > 0) {
            sendPushNotificationAlerts(alertsToNotify);
        }

        if (shouldUpdateState) {
            setLastNotifiedTimestamps(updatedTimestamps);
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