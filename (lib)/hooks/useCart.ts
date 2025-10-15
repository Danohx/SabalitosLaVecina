// hooks/useCart.ts
import { useState, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { Producto, CartItem } from '../data/datos';

export const useCart = (inventory: Producto[]) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const updateCart = useCallback((productoId: string, change: number) => {
        setCart(prevCart => {
            const producto = inventory.find(p => p.id === productoId);
            if (!producto) return prevCart;
            
            const existingItem = prevCart.find(item => item.id === productoId);
            
            let newQuantity = change;
            if (existingItem) newQuantity = existingItem.quantity + change;

            if (newQuantity > producto.stock) {
                Alert.alert("Límite de Stock", `Solo quedan ${producto.stock} unidades de ${producto.titulo}.`);
                return prevCart;
            }

            if (newQuantity <= 0)
                return prevCart.filter(item => item.id !== productoId);

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === productoId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                return [...prevCart, { 
                    id: productoId, 
                    quantity: 1, 
                    tipo: producto.tipo,
                    categoria: producto.categoria 
                }];
            }
        });
    }, [inventory]);

    const getCartQuantity = useCallback((productoId: string): number => {
        return cart.find(item => item.id === productoId)?.quantity || 0;
    }, [cart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const totalCost = useMemo(() => {
        return cart.reduce((total, cartItem) => {
            const producto = inventory.find(p => p.id === cartItem.id); 
            const price = producto ? producto.precio : 0;
            return total + (cartItem.quantity * price);
        }, 0);
    }, [cart, inventory]);

    const totalItems = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    return {
        cart,
        updateCart,
        getCartQuantity,
        clearCart,
        totalCost,
        totalItems
    };
};