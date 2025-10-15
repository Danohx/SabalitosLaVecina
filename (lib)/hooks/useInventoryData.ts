// hooks/useInventoryData.ts
import { useMemo } from 'react';
import { Producto, CategoriaProducto, TipoSabor, TipoFritura, TipoPapeleria } from '../data/datos';

type TipoProducto = TipoSabor | TipoFritura | TipoPapeleria;

interface SubSection {
    title: string;
    type: TipoProducto;
    data: Producto[];
}

interface InventorySection {
    title: string;
    key: CategoriaProducto; 
    subSections: SubSection[];
}

export const useInventoryData = (inventory: Producto[]) => {
    const getGroupedData = (): InventorySection[] => {
        const groupedData = inventory.reduce((acc, producto) => {
            const categoria = producto.categoria;
            
            if (!acc[categoria]) {
                (acc as any)[categoria] = {};
            }

            if (!acc[categoria][producto.tipo]) {
                acc[categoria][producto.tipo] = [];
            }

            acc[categoria][producto.tipo].push(producto);
            return acc;
        }, {} as Record<CategoriaProducto, Record<TipoProducto, Producto[]>>);

        const sections: InventorySection[] = [];

        // Sabalitos
        if (groupedData.Sabalitos) {
            const subSections: SubSection[] = [];
            Object.entries(groupedData.Sabalitos).forEach(([tipo, productos]) => {
                const titleMap: Record<string, string> = {
                    'Agua': 'De Agua',
                    'Leche': 'De Leche',
                    'Paletas': 'Paletas',
                    'Otros': 'Otros Sabalitos'
                };
                subSections.push({ 
                    title: titleMap[tipo] || tipo, 
                    type: tipo as TipoProducto, 
                    data: productos 
                });
            });
            if (subSections.length > 0) {
                sections.push({ title: 'SABALITOS', key: 'Sabalitos', subSections });
            }
        }

        // Paletas
        if (groupedData.Paletas) {
            const subSections: SubSection[] = [];
            Object.entries(groupedData.Paletas).forEach(([tipo, productos]) => {
                subSections.push({ 
                    title: `Paletas (${productos.length})`, 
                    type: tipo as TipoProducto, 
                    data: productos 
                });
            });
            if (subSections.length > 0) {
                sections.push({ title: 'PALETAS Y HELADOS', key: 'Paletas', subSections });
            }
        }

        // Frituras
        if (groupedData.Frituras) {
            const subSections: SubSection[] = [];
            Object.entries(groupedData.Frituras).forEach(([tipo, productos]) => {
                const titleMap: Record<string, string> = {
                    'Palomitas': 'Palomitas',
                    'Chicharrones': 'Chicharrones', 
                    'Papas': 'Papas Fritas',
                    'Otros': 'Otras Frituras'
                };
                subSections.push({ 
                    title: titleMap[tipo] || tipo, 
                    type: tipo as TipoProducto, 
                    data: productos 
                });
            });
            if (subSections.length > 0) {
                sections.push({ title: 'FRITURAS', key: 'Frituras', subSections });
            }
        }

        // Papelería
        if (groupedData.Papeleria) {
            const subSections: SubSection[] = [];
            Object.entries(groupedData.Papeleria).forEach(([tipo, productos]) => {
                const titleMap: Record<string, string> = {
                    'Lapices': 'Lápices',
                    'Lapiceros': 'Lapiceros', 
                    'Borradores': 'Borradores',
                    'Sacapuntas': 'Sacapuntas',
                    'Corrector': 'Corrector',
                    'Pegamento': 'Pegamento'
                };
                subSections.push({ 
                    title: titleMap[tipo] || tipo, 
                    type: tipo as TipoProducto, 
                    data: productos 
                });
            });
            if (subSections.length > 0) {
                sections.push({ title: 'PAPELERÍA', key: 'Papeleria', subSections });
            }
        }


        return sections;
    };

    const inventoryData = useMemo(() => getGroupedData(), [inventory]);

    const getCategoryIcon = (category: CategoriaProducto): string => {
        switch (category) {
            case 'Sabalitos': return '🍧';
            case 'Paletas': return '🍭';
            case 'Frituras': return '🍿';
            case 'Papeleria': return '📚';
            default: return '📦';
        }
    };

    return {
        inventoryData,
        getCategoryIcon
    };
};