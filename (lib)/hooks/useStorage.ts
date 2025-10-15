import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Producto, VentaRegistro, INITIAL_INVENTORY } from '../data/datos';

const STORAGE_KEY_INV = '@Inventory_Sabalitos';
const STORAGE_KEY_SALES = '@Sales_History_Sabalitos';

export const useStorage = () => {
    const [inventory, setInventory] = useState<Producto[]>([]);
    const [salesHistory, setSalesHistory] = useState<VentaRegistro[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            try {                
                const [storedInv, storedSales] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEY_INV),
                    AsyncStorage.getItem(STORAGE_KEY_SALES)
                ]);

                if (storedInv) {
                    setInventory(JSON.parse(storedInv));
                } else {
                    setInventory(INITIAL_INVENTORY);
                }
                
                if (storedSales) {
                    setSalesHistory(JSON.parse(storedSales));
                }
                
            } catch (error) {
                setInventory(INITIAL_INVENTORY);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData(); 
    }, []);

    // Guardar inventario
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEY_INV, JSON.stringify(inventory))
                .catch(e => console.error("❌ Error guardando inventario:", e));
        }
    }, [inventory, isLoading]);

    // Guardar ventas
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(salesHistory))
                .catch(e => console.error("❌ Error guardando ventas:", e));
        }
    }, [salesHistory, isLoading]);

    const clearAllData = async () => {
        await AsyncStorage.multiRemove([STORAGE_KEY_INV, STORAGE_KEY_SALES]);
        setInventory(INITIAL_INVENTORY);
        setSalesHistory([]);
    };

    return {
        inventory,
        salesHistory,
        isLoading,
        setInventory,
        setSalesHistory,
        clearAllData
    };
};