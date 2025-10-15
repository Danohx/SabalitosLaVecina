// context/InventoryContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStorage } from '../hooks/useStorage';
import { useNotifications } from '../hooks/useNotifications';
import { useInventoryOperations } from '../hooks/useInventoryOperations';
import { Producto, VentaRegistro, AlertaStock, CartItem } from '../data/datos';

interface InventoryContextType {
    inventory: Producto[];
    isLoading: boolean;
    updateStock: (id: string, change: number) => void;
    addFlavor: (newFlavor: Omit<Producto, 'id' | 'stock'>) => void;
    deleteFlavor: (id: string) => void;
    salesHistory: VentaRegistro[];
    activeAlerts: AlertaStock[];
    recordSale: (cart: CartItem[]) => void;
    clearAllInventoryData: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { 
        inventory, 
        salesHistory, 
        isLoading, 
        setInventory, 
        setSalesHistory, 
        clearAllData 
    } = useStorage();
    
    const { 
        activeAlerts, 
        calculateAlerts 
    } = useNotifications();
    
    const { 
        updateStock, 
        addFlavor, 
        deleteFlavor, 
        recordSale 
    } = useInventoryOperations(inventory, setInventory, salesHistory, setSalesHistory);

    React.useEffect(() => {
        calculateAlerts(inventory, isLoading);
    }, [inventory, isLoading, calculateAlerts]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#f4511e" />
            </View>
        );
    }

    return (
        <InventoryContext.Provider value={{
            inventory,
            isLoading,
            updateStock,
            addFlavor,
            deleteFlavor,
            salesHistory,
            activeAlerts,
            recordSale,
            clearAllInventoryData: clearAllData
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory debe ser usado dentro de un InventoryProvider');
    }
    return context;
};