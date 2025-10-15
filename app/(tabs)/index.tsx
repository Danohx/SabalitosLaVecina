// app/(tabs)/index.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotonSabor from '../../(lib)/components/BotonSabor'; 
import ConfirmSaleButton from '../../(lib)/components/ConfirmSaleButton';
import { useInventory } from '../../(lib)/context/InventoryContext';
import { useCart } from '../../(lib)/hooks/useCart';
import { useCategories } from '../../(lib)/hooks/useCategories';
import { CategoriaProducto } from '../../(lib)/data/datos';
import { COLOR_PALETTE } from '../../(lib)/utils/colors';

const Principal = () => {
    const { inventory, isLoading, recordSale } = useInventory(); 
    const { cart, updateCart, getCartQuantity, clearCart, totalCost, totalItems } = useCart(inventory);
    const { categories, getCategoryIcon, getCategoryTitle, filterByCategory } = useCategories(inventory);
    const [selectedCategory, setSelectedCategory] = useState<CategoriaProducto>('Sabalitos');

    const filteredProducts = filterByCategory(selectedCategory);

    const handleConfirmSale = () => {
        if (cart.length === 0) return;

        recordSale(cart); 
        clearCart();

        const totalItemsSold = cart.reduce((sum, item) => sum + item.quantity, 0);
        Alert.alert("Venta Confirmada", `Se han vendido ${totalItemsSold} artículos. Stock actualizado.`);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando Productos...</Text>
            </View>
        );
    }
  
    return (
        <View style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerTitle}>🏪 La Vecina</Text>
                        <Text style={styles.headerSubtitle}>Sistema de Ventas</Text>
                    </View>
                    {totalItems > 0 && (
                        <View style={styles.cartBadge}>
                            <Ionicons name="cart" size={20} color={COLOR_PALETTE.surface} />
                            <Text style={styles.cartBadgeText}>{totalItems}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Selector de Categorías */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categoriesContainer}
            >
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryIcon,
                            selectedCategory === category && styles.categoryIconActive
                        ]}>
                            {getCategoryIcon(category)}
                        </Text>
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.categoryTextActive
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats rápidas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="cube-outline" size={24} color={COLOR_PALETTE.primary} />
                        <Text style={styles.statNumber}>{filteredProducts.length}</Text>
                        <Text style={styles.statLabel}>Productos</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="layers-outline" size={24} color={COLOR_PALETTE.secondary} />
                        <Text style={styles.statNumber}>
                            {filteredProducts.reduce((sum, p) => sum + p.stock, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Stock Total</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="cart-outline" size={24} color={COLOR_PALETTE.accent} />
                        <Text style={styles.statNumber}>${totalCost.toFixed(2)}</Text>
                        <Text style={styles.statLabel}>En Carrito</Text>
                    </View>
                </View>

                {/* Sección de productos */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{getCategoryTitle(selectedCategory)}</Text>
                    <Text style={styles.sectionCount}>
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                    </Text>
                </View>

                <View style={styles.productosGrid}>
                    {filteredProducts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={64} color={COLOR_PALETTE.textLight} />
                            <Text style={styles.emptyMessage}>
                                No hay productos en esta categoría
                            </Text>
                            <Text style={styles.emptySubMessage}>
                                Añade productos desde la pestaña Inventario
                            </Text>
                        </View>
                    ) : (
                        filteredProducts.map(producto => (
                            <BotonSabor
                                key={producto.id}
                                titulo={producto.titulo}
                                imagenSource={producto.imagen}
                                onPress={() => updateCart(producto.id, 1)}
                                onRemove={() => updateCart(producto.id, -1)}
                                cartQuantity={getCartQuantity(producto.id)}
                                stock={producto.stock} 
                                disabled={producto.stock === 0} 
                                // precio={producto.precio}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            <ConfirmSaleButton 
                isActive={cart.length > 0} 
                onPress={handleConfirmSale}
                totalCost={totalCost} 
            />
        </View>
    )
}

export default Principal;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.background,
    },
    loadingText: { 
        textAlign: 'center',
        color: COLOR_PALETTE.textSecondary,
        fontSize: 16,
    },
    safeArea: { 
        flex: 1, 
        backgroundColor: COLOR_PALETTE.background,
    },
    header: { 
        backgroundColor: COLOR_PALETTE.primary,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { 
        fontSize: 28, 
        fontWeight: 'bold',
        color: COLOR_PALETTE.surface,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLOR_PALETTE.surface,
        opacity: 0.9,
    },
    cartBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    cartBadgeText: {
        color: COLOR_PALETTE.surface,
        fontWeight: 'bold',
        fontSize: 16,
    },
    categoriesScroll: {
        backgroundColor: COLOR_PALETTE.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_PALETTE.border,
        flexShrink: 0,
    },
    categoriesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        gap: 6,
    },
    categoryButtonActive: {
        backgroundColor: COLOR_PALETTE.primary,
        borderColor: COLOR_PALETTE.primary,
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryIconActive: {
        color: COLOR_PALETTE.surface,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLOR_PALETTE.textPrimary,
    },
    categoryTextActive: {
        color: COLOR_PALETTE.surface,
    },
    scrollContent: { 
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLOR_PALETTE.surface,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLOR_PALETTE.textPrimary,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 11,
        color: COLOR_PALETTE.textSecondary,
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold',
        color: COLOR_PALETTE.textPrimary,
    },
    sectionCount: {
        fontSize: 14,
        color: COLOR_PALETTE.textSecondary,
        fontWeight: '600',
    },
    productosGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
    },
    emptyContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyMessage: { 
        color: COLOR_PALETTE.textPrimary,
        marginTop: 20,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
    },
    emptySubMessage: {
        color: COLOR_PALETTE.textSecondary,
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
});