// app/(tabs)/inventario.tsx

import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useInventory } from '../../(lib)/context/InventoryContext'; 
import { Producto, CategoriaProducto, obtenerPrecio, TipoProducto } from '../../(lib)/data/datos'; 
import { useInventoryData } from '../../(lib)/hooks/useInventoryData';
import { COLOR_PALETTE } from '../../(lib)/utils/colors';
import AddProductModal from '../../(lib)/components/AddProductModal';
import { getFlavorImageSource } from '../../(lib)/utils/image-loader';

interface InventarioItemProps {
    producto: Producto; 
    onRestar: (id: string) => void; 
    onSumar: (id: string) => void;  
    onBorrar: (id: string) => void;
}

const InventarioItem: React.FC<InventarioItemProps> = ({ producto, onRestar, onSumar, onBorrar }) => (
    <View style={itemStyles.container}>
        <Image source={producto.imagen} style={itemStyles.imagen} />
        <View style={itemStyles.info}>
            <Text style={itemStyles.titulo}>{producto.titulo}</Text>
            <Text style={itemStyles.detalles}>
                Stock: {producto.stock} | ${(producto.precio || 0).toFixed(2)}
            </Text>
            <Text style={itemStyles.categoria}>{producto.categoria}</Text>
        </View>
        <TouchableOpacity style={itemStyles.deleteButton} onPress={() => onBorrar(producto.id)}>
            <Ionicons name="trash-outline" size={20} color={COLOR_PALETTE.error} />
        </TouchableOpacity>
        <View style={itemStyles.contador}>
            <TouchableOpacity 
                style={[itemStyles.addButton, producto.stock === 0 && { backgroundColor: COLOR_PALETTE.textLight }]} 
                onPress={() => onRestar(producto.id)} 
                disabled={producto.stock === 0}
            >
                <Text style={itemStyles.addText}>-</Text>
            </TouchableOpacity>
            <Text style={itemStyles.cantidad}>{producto.stock}</Text>
            <TouchableOpacity style={itemStyles.addButton} onPress={() => onSumar(producto.id)}>
                <Text style={itemStyles.addText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const Inventario = () => {
    const { inventory, isLoading, updateStock, addFlavor, deleteFlavor, clearAllInventoryData } = useInventory();
    const [modalVisible, setModalVisible] = useState(false);
    const { inventoryData, getCategoryIcon } = useInventoryData(inventory);

    const handleRestar = (id: string) => updateStock(id, -1);
    const handleSumar = (id: string) => updateStock(id, 1);
    
    const handleClearInventory = () => { 
        Alert.alert(
            "⚠️ BORRAR INVENTARIO COMPLETO",
            "¿Estás seguro de que quieres eliminar TODO el inventario? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" }, 
                { 
                    text: "BORRAR TODO", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await clearAllInventoryData();
                            Alert.alert("✅ Listo", "Inventario borrado completamente");
                        } catch (error) {
                            Alert.alert("❌ Error", "No se pudo borrar el inventario");
                        }
                    } 
                }
            ]
        );
    }; 

    const handleBorrar = (id: string) => { 
        Alert.alert(
            "Confirmar Borrado",
            "¿Estás seguro de que quieres eliminar este producto del inventario?",
            [{ text: "Cancelar", style: "cancel" }, { text: "Eliminar", style: "destructive", onPress: () => deleteFlavor(id) }]
        );
    }; 

    const handleSaveNewProduct = (titulo: string, tipo: TipoProducto, categoria: CategoriaProducto) => {
        const precio = obtenerPrecio(categoria, tipo);
        const newProductData: Omit<Producto, 'id' | 'stock'> = { 
            titulo: titulo, 
            imagen: getFlavorImageSource(titulo), // Usar la función para obtener la imagen correcta
            tipo: tipo,
            categoria: categoria,
            precio: precio,
        };
        addFlavor(newProductData);
    };

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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {inventory.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={64} color={COLOR_PALETTE.textLight} />
                        <Text style={styles.emptyMessage}>Inventario vacío</Text>
                        <Text style={styles.emptySubMessage}>
                            Agrega productos para empezar a gestionar tu inventario
                        </Text>
                    </View>
                ) : (
                    inventoryData.map(section => (
                        <View key={section.key} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionIcon}>{getCategoryIcon(section.key)}</Text>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            {section.subSections.map(subSection => (
                                <View key={subSection.type}>
                                    <Text style={styles.subSectionTitle}>{subSection.title}</Text> 
                                    {subSection.data.map(item => (
                                        <InventarioItem 
                                            key={item.id}
                                            producto={item}
                                            onRestar={handleRestar}
                                            onSumar={handleSumar}
                                            onBorrar={handleBorrar}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
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