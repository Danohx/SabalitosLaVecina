// hooks/useInventoryOperations.ts
import { useCallback } from 'react';
import { Producto, VentaRegistro, CartItem } from '../data/datos';

export const useInventoryOperations = (
inventory: Producto[], setInventory: React.Dispatch<React.SetStateAction<Producto[]>>, salesHistory: VentaRegistro[], setSalesHistory: React.Dispatch<React.SetStateAction<VentaRegistro[]>>) => {
    const updateStock = useCallback((id: string, change: number) => {
        setInventory(prev =>
            prev.map(producto => {
                if (producto.id === id) {
                    const newStock = Math.max(0, producto.stock + change);
                    return { ...producto, stock: newStock };
                }
                return producto;
            })
        );
    }, [setInventory]);

    const addFlavor = useCallback((newProductoData: Omit<Producto, 'id' | 'stock'>) => {
        const newProducto: Producto = { 
            ...newProductoData, 
            id: Date.now().toString(), 
            stock: 0
        };
        setInventory(prev => [...prev, newProducto]);
    }, [setInventory]);

    const deleteFlavor = useCallback((id: string) => {
        setInventory(prev => prev.filter(producto => producto.id !== id));
    }, [setInventory]);

    const recordSale = useCallback((cart: CartItem[]) => {
        const newSales: VentaRegistro[] = [];
        const updates = new Map<string, number>();

        cart.forEach(item => {
            const producto = inventory.find(p => p.id === item.id);
            if (!producto || item.quantity <= 0) {
                return;
            }

            const precioUnitario = producto.precio;
            const ingresoTotal = item.quantity * precioUnitario;

            newSales.push({
                id: Date.now().toString() + Math.random(),
                saborId: item.id,
                titulo: producto.titulo,
                tipo: item.tipo,
                categoria: producto.categoria, // ✅ AGREGAR CATEGORÍA
                cantidad: item.quantity,
                precioUnitario: precioUnitario,
                ingresoTotal: ingresoTotal,
                fecha: Date.now(),
            });

            updates.set(item.id, (updates.get(item.id) || 0) + item.quantity);
        });

        if (updates.size > 0) {
            setInventory(prevInv =>
                prevInv.map(producto => {
                    const quantitySold = updates.get(producto.id) || 0;
                    if (quantitySold > 0) {
                        const newStock = Math.max(0, producto.stock - quantitySold);
                        return { ...producto, stock: newStock };
                    }
                    return producto;
                })
            );
        }

        if (newSales.length > 0) {
            setSalesHistory(prevHistory => [...prevHistory, ...newSales]);
        }
        
    }, [inventory, setInventory, setSalesHistory]);

    return {
        updateStock,
        addFlavor,
        deleteFlavor,
        recordSale
    };
};