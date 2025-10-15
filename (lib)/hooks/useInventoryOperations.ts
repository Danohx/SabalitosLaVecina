// hooks/useInventoryOperations.ts
import { useCallback, useMemo } from 'react';
import { Producto, VentaRegistro, CartItem } from '../data/datos';

export const useInventoryOperations = (
inventory: Producto[], 
    setInventory: React.Dispatch<React.SetStateAction<Producto[]>>, 
    salesHistory: VentaRegistro[], 
    setSalesHistory: React.Dispatch<React.SetStateAction<VentaRegistro[]>>) => {

    // Creamos el Hashmap de Inventario para búsquedas O(1)
    const inventoryMap = useMemo(() => {
        return inventory.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {} as Record<string, Producto>);
    }, [inventory]);

    // updateStock (Usa un patrón de map/Object.values para simular O(1) mutación)
    const updateStock = useCallback((id: string, change: number) => {
        setInventory(prev => {
            // Conversión a Hashmap para mutación O(1)
            const map: Record<string, Producto> = prev.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
            
            const producto = map[id];
            if (producto) {
                const newStock = Math.max(0, producto.stock + change);
                map[id] = { ...producto, stock: newStock };
            }
            // Retorno a Array (costo O(N) inevitable debido a la API de setInventory)
            return Object.values(map); 
        });
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

    // recordSale (Optimizado a O(M + N))
    const recordSale = useCallback((cart: CartItem[]) => {
        const newSales: VentaRegistro[] = [];
        const updates = new Map<string, number>();

        // OPTIMIZACIÓN: Búsqueda O(1)
        cart.forEach(item => {
            const producto = inventoryMap[item.id]; 
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
                categoria: producto.categoria, 
                cantidad: item.quantity,
                precioUnitario: precioUnitario,
                ingresoTotal: ingresoTotal,
                fecha: Date.now(),
            });

            updates.set(item.id, (updates.get(item.id) || 0) + item.quantity);
        });

        if (updates.size > 0) {
            setInventory(prevInv => {
                // Conversión a Hashmap para mutación O(1)
                const map: Record<string, Producto> = prevInv.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
                
                // Mutación O(M)
                updates.forEach((quantitySold, id) => {
                    const producto = map[id];
                    if (producto && quantitySold > 0) {
                        const newStock = Math.max(0, producto.stock - quantitySold);
                        map[id] = { ...producto, stock: newStock };
                    }
                });
                // Retorno a Array (costo O(N))
                return Object.values(map);
            });
        }

        if (newSales.length > 0) {
            setSalesHistory(prevHistory => [...prevHistory, ...newSales]);
        }
        
    }, [inventoryMap, setInventory, setSalesHistory]);

    return {
        updateStock,
        addFlavor,
        deleteFlavor,
        recordSale
    };
};