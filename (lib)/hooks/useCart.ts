// hooks/useCart.ts
import { useState, useMemo, useCallback } from 'react';
import { Producto, CartItem as CartItemType } from '../data/datos';
import { useToast } from '../context/ToastContext';

interface InternalCartItem {
    id: string;
    quantity: number;
}

type CartMapState = Record<string, InternalCartItem>;

export const useCart = (inventory: Producto[]) => {
    const [cartMap, setCartMap] = useState<CartMapState>({});
    const { showToast } = useToast();

    const inventoryMap = useMemo(() => {
        return inventory.reduce((map, product) => {
            map[product.id] = product;
            return map;
        }, {} as Record<string, Producto>);
    }, [inventory]);

    const setQuantity = useCallback((productoId: string, quantity: number) => {
        setCartMap(prevCart => {
            const producto = inventoryMap[productoId];
            if (!producto) return prevCart;

            // Validación de stock es crucial aquí también
            if (quantity > producto.stock) {
                showToast(`Stock limitado. Solo quedan ${producto.stock} de ${producto.titulo}.`, 'warning');
                return prevCart;
            }

            // Caso: Eliminar el ítem si la cantidad es 0
            if (quantity <= 0) {
                const newCart = { ...prevCart };
                delete newCart[productoId];
                return newCart;
            }

            // Caso: Actualizar o Agregar
            return {
                ...prevCart,
                [productoId]: { 
                    id: productoId, 
                    quantity: quantity 
                },
            };
        });
    }, [inventoryMap, showToast]);

    const updateCart = useCallback((productoId: string, change: number) => {
        setCartMap(prevCart => {
            const producto = inventoryMap[productoId];
            if (!producto) return prevCart;

            const existingItem = prevCart[productoId];
            const currentQuantity = existingItem ? existingItem.quantity : 0;
            let newQuantity = currentQuantity + change;

            if (newQuantity > producto.stock) {
                showToast(`Stock limitado. Solo quedan ${producto.stock} de ${producto.titulo}.`, 'warning');
                return prevCart;
            }

            // Caso 1: Eliminar el ítem o no hacer nada si newQuantity <= 0
            if (newQuantity <= 0) {
                const newCart = { ...prevCart };
                delete newCart[productoId];
                return newCart;
            }

            // Caso 2: Actualizar o Agregar (Programación Funcional e Inmutabilidad)
            return {
                ...prevCart,
                [productoId]: { 
                    id: productoId, 
                    quantity: newQuantity 
                },
            };
        });
    }, [inventory]);

    const getCartQuantity = useCallback((productoId: string): number => {
        return cartMap[productoId]?.quantity || 0;
    }, [cartMap]);

    const clearCart = useCallback(() => {
        setCartMap({});
    }, []);

    const totalCost = useMemo(() => {
        let cost = 0;
        // Iteración simple sobre las claves O(N)
        for (const id in cartMap) {
            const cartItem = cartMap[id];
            const producto = inventoryMap[id];
            const price = producto ? producto.precio : 0;
            cost += cartItem.quantity * price;
        }
        return cost;
    }, [cartMap, inventoryMap]);

    const totalItems = useMemo(() => {
        let sum = 0;
        for (const id in cartMap) {
            sum += cartMap[id].quantity;
        }
        return sum;
    }, [cartMap]);

    const cartAsArray = useMemo(() => {
        return Object.values(cartMap).map(item => ({
            id: item.id,
            quantity: item.quantity,
            // ... (mapeo de tipos)
        })) as CartItemType[];
    }, [cartMap, inventoryMap]);

    return {
        cart: cartAsArray,
        updateCart,
        setQuantity,
        getCartQuantity,
        clearCart,
        totalCost,
        totalItems
    };
};