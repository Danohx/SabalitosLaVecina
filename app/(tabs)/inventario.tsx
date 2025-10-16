// app/(tabs)/inventario.tsx

import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, SectionList } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../(lib)/context/InventoryContext'; 
import { Producto, CategoriaProducto, obtenerPrecio, TipoProducto } from '../../(lib)/data/datos'; 
// Importamos los tipos necesarios del hook
import { useInventoryData, InventorySection, SubSection } from '../../(lib)/hooks/useInventoryData'; 
import { COLOR_PALETTE } from '../../(lib)/utils/colors';
import AddProductModal from '../../(lib)/components/AddProductModal';
import { getFlavorImageSource } from '../../(lib)/utils/image-loader';
import InventarioItem from '../../(lib)/components/InventarioItem';


// OPTIMIZACIÓN: Memorización del componente
const MemoizedInventarioItem = React.memo(InventarioItem);

// Componente para renderizar las SubSecciones (utilizado en renderItem de SectionList)
const RenderSubSections: React.FC<{ subSections: SubSection[], onUpdateStock: (id: string, newStock: number) => void, onBorrar: (id: string) => void }> = 
    React.memo(({ subSections, onUpdateStock, onBorrar }) => (
    <>
        {subSections.map(subSection => (
            <View key={subSection.type}>
                <Text style={styles.subSectionTitle}>{subSection.title}</Text> 
                {subSection.data.map(item => (
                    <MemoizedInventarioItem 
                        key={item.id}
                        producto={item}
                        onUpdateStock={onUpdateStock}
                        onBorrar={onBorrar}
                    />
                ))}
            </View>
        ))}
    </>
));



const Inventario = () => {
    const { inventory, isLoading, updateStock, addFlavor, deleteFlavor, clearAllInventoryData } = useInventory();
    const [modalVisible, setModalVisible] = useState(false);
    const { inventoryData, getCategoryIcon } = useInventoryData(inventory);
    
    const handleUpdateStock = React.useCallback((id: string, newStock: number) => {
        const currentProduct = inventory.find(p => p.id === id);
        if (currentProduct) {
            const change = newStock - currentProduct.stock;
            updateStock(id, change);
        }
    }, [inventory, updateStock]);
    
    const handleClearInventory = () => { 
        Alert.alert(
            "⚠️ BORRAR INVENTARIO COMPLETO",
            "¿Estás seguro de que quieres eliminar TODO el inventario? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" }, 
                { text: "BORRAR TODO", style: "destructive", onPress: clearAllInventoryData }
            ]
        );
    }; 

    const handleBorrar = React.useCallback((id: string) => { 
        Alert.alert(
            "Confirmar Borrado",
            "¿Estás seguro de que quieres eliminar este producto del inventario?",
            [{ text: "Cancelar", style: "cancel" }, { text: "Eliminar", style: "destructive", onPress: () => deleteFlavor(id) }]
        );
    }, [deleteFlavor]); 

    const handleSaveNewProduct = (titulo: string, tipo: TipoProducto, categoria: CategoriaProducto) => {
        const precio = obtenerPrecio(categoria, tipo);
        const newProductData: Omit<Producto, 'id' | 'stock'> = { 
            titulo: titulo, 
            imagen: getFlavorImageSource(titulo), 
            tipo: tipo,
            categoria: categoria,
            precio: precio,
        };
        addFlavor(newProductData);
        setModalVisible(false);
    };

    // Adaptamos el formato para SectionList
    const sectionListData = useMemo(() => {
        return inventoryData.map(section => ({
            ...section,
            // Agrupamos la estructura de secciones en un solo ítem por categoría, 
            // ya que SectionList solo virtualiza el nivel más alto de la sección.
            data: [{ subSections: section.subSections }] 
        }));
    }, [inventoryData]);

    // Función que renderiza la cabecera de la Sección (Categoría)
    const renderSectionHeader = ({ section }: { section: InventorySection & { data: any[] } }) => (
        <View key={section.key} style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>{getCategoryIcon(section.key)}</Text>
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    );

    // Función que renderiza el contenido (SubSecciones y Productos)
    const renderItem = ({ item }: { item: { subSections: SubSection[] } }) => (
        <RenderSubSections 
            subSections={item.subSections}
            onUpdateStock={handleUpdateStock}
            onBorrar={handleBorrar}
        />
    );


    if (isLoading) {
        return <Text style={styles.loadingText}>Cargando inventario...</Text>;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle" size={20} color={COLOR_PALETTE.surface} />
                <Text style={styles.addButtonText}>AGREGAR NUEVO PRODUCTO</Text>
                {/* {__DEV__ && (
                    <TouchableOpacity 
                        style={[styles.addButton, styles.testButton]} 
                        onPress={handleClearInventory}
                    >
                        <Ionicons name="nuclear-outline" size={20} color={COLOR_PALETTE.surface} />
                        <Text style={styles.addButtonText}>BORRAR INVENTARIO (TEST)</Text>
                    </TouchableOpacity>
                )} */}
            </TouchableOpacity>
            
            <AddProductModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleSaveNewProduct}
            />

            {inventory.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="cube-outline" size={64} color={COLOR_PALETTE.textLight} />
                    <Text style={styles.emptyMessage}>Inventario vacío</Text>
                    <Text style={styles.emptySubMessage}>
                        Agrega productos para empezar a gestionar tu inventario
                    </Text>
                </View>
            ) : (
                // OPTIMIZACIÓN CRÍTICA: SectionList
                <SectionList
                    sections={sectionListData}
                    // Utilizamos una key que incluye el índice del item dentro del array data (que siempre es 1)
                    keyExtractor={(item, index) => 'section_item_' + index} 
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    // Desactivamos sticky headers para mantener el diseño original
                    stickySectionHeadersEnabled={false} 
                />
            )}
        </View>
    )
}

export default Inventario;

const styles = StyleSheet.create({
    // En los estilos, agrega:
    testButton: {
        backgroundColor: COLOR_PALETTE.error,
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: COLOR_PALETTE.background,
        paddingTop: 10,
        paddingHorizontal: 15,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOR_PALETTE.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    addButtonText: {
        color: COLOR_PALETTE.surface,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    scrollContent: {
        paddingBottom: 50,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: COLOR_PALETTE.primary,
    },
    sectionIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 22, 
        fontWeight: 'bold', 
        color: COLOR_PALETTE.textPrimary,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 10,
        color: COLOR_PALETTE.textSecondary,
        paddingLeft: 5,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyMessage: {
        fontSize: 20,
        fontWeight: '600',
        color: COLOR_PALETTE.textPrimary,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubMessage: {
        fontSize: 14,
        color: COLOR_PALETTE.textSecondary,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    loadingText: { 
        marginTop: 50, 
        textAlign: 'center',
        color: COLOR_PALETTE.textSecondary,
    }
});

const itemStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: COLOR_PALETTE.surface,
        borderRadius: 10,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: COLOR_PALETTE.accent,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    imagen: {
        width: 45,
        height: 45,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    titulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR_PALETTE.textPrimary,
        marginBottom: 2,
    },
    detalles: {
        fontSize: 14,
        color: COLOR_PALETTE.textSecondary,
        marginBottom: 2,
    },
    categoria: {
        fontSize: 12,
        color: COLOR_PALETTE.textLight,
        fontStyle: 'italic',
    },
    contador: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        borderRadius: 15,
        paddingHorizontal: 5,
    },
    cantidad: {
        paddingHorizontal: 15,
        fontSize: 16,
        color: COLOR_PALETTE.textPrimary,
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: COLOR_PALETTE.primary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        color: COLOR_PALETTE.surface,
        fontSize: 18,
        fontWeight: '300',
    },
    deleteButton: {
        marginLeft: 10,
        marginRight: 'auto',
        padding: 5,
    },
});