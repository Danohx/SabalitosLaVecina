// hooks/useCategories.ts
import { useMemo } from 'react';
import { Producto, CategoriaProducto } from '../data/datos';

export const useCategories = (inventory: Producto[]) => {
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(new Set(inventory.map(p => p.categoria)));
        return uniqueCategories.length > 0 ? uniqueCategories as CategoriaProducto[] : ['Sabalitos'] as CategoriaProducto[];
    }, [inventory]);

    const getCategoryIcon = (category: CategoriaProducto): string => {
        switch (category) {
            case 'Sabalitos': return '🍧';
            case 'Paletas': return '🍭';
            case 'Frituras': return '🍿';
            case 'Papeleria': return '📚';
            default: return '📦';
        }
    };

    const getCategoryTitle = (category: CategoriaProducto): string => {
        switch (category) {
            case 'Sabalitos': return 'Sabalitos Disponibles';
            case 'Paletas': return 'Paletas y Helados';
            case 'Frituras': return 'Frituras';
            case 'Papeleria': return 'Papelería';
            default: return 'Productos';
        }
    };

    const filterByCategory = (category: CategoriaProducto): Producto[] => {
        return inventory.filter(producto => producto.categoria === category);
    };

    return {
        categories,
        getCategoryIcon,
        getCategoryTitle,
        filterByCategory
    };
};