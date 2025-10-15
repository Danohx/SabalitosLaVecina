import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Producto, VentaRegistro, INITIAL_INVENTORY } from '../data/datos';

const STORAGE_KEY_INV = '@Inventory_Sabalitos';
const STORAGE_KEY_SALES = '@Sales_History_Sabalitos';

const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

export const useStorage = () => {
    const [inventory, setInventory] = useState<Producto[]>([]);
    const [salesHistory, setSalesHistory] = useState<VentaRegistro[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSaveInventory = useRef(
        debounce((data: Producto[]) => {
            AsyncStorage.setItem(STORAGE_KEY_INV, JSON.stringify(data))
                .catch(e => console.error("❌ Error guardando inventario debounced:", e));
        }, 500)
    ).current;

    const debouncedSaveSales = useRef(
        debounce((data: VentaRegistro[]) => {
            AsyncStorage.setItem(STORAGE_KEY_SALES, JSON.stringify(data))
                .catch(e => console.error("❌ Error guardando ventas debounced:", e));
        }, 1000) // Un retraso mayor para el historial grande
    ).current;

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
                console.error("❌ Error crítico cargando datos de AsyncStorage:", error);
                setInventory(INITIAL_INVENTORY);
                setSalesHistory([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData(); 
        
        return () => {
            clearTimeout(debouncedSaveInventory as any); 
            clearTimeout(debouncedSaveSales as any); 
        };
    }, []);

    // Guardar inventario
    useEffect(() => {
        if (!isLoading) {
            debouncedSaveInventory(inventory);
        }
    }, [inventory, isLoading, debouncedSaveInventory]);

    // Guardar ventas
    useEffect(() => {
        if (!isLoading) {
            debouncedSaveSales(salesHistory);
        }
    }, [salesHistory, isLoading, debouncedSaveSales]);

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