// components/AddProductModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CategoriaProducto, TipoSabor, TipoFritura, TipoPapeleria, obtenerPrecio } from '../data/datos';
import { COLOR_PALETTE } from '../utils/colors';

type TipoProducto = TipoSabor | TipoFritura | TipoPapeleria;

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (title: string, tipo: TipoProducto, categoria: CategoriaProducto) => void; 
}

const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose, onAdd }) => {
    const [productName, setProductName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoriaProducto>('Sabalitos');
    const [selectedType, setSelectedType] = useState<TipoProducto>('Agua');

    const handleSave = () => {
        if (productName.trim().length > 0) {
            onAdd(productName.trim(), selectedType, selectedCategory);
            setProductName('');
            setSelectedCategory('Sabalitos');
            setSelectedType('Agua');
            onClose();
        } else {
            alert("El nombre del producto no puede estar vacío.");
        }
    };

    const handleCategoryChange = (newCategory: CategoriaProducto) => {
        setSelectedCategory(newCategory);
        // Reset type based on category
        switch (newCategory) {
            case 'Sabalitos':
                setSelectedType('Agua');
                break;
            case 'Paletas':
                setSelectedType('Paletas');
                break;
            case 'Frituras':
                setSelectedType('Palomitas');
                break;
            case 'Papeleria':
                setSelectedType('Lapices');
                break;
        }
    };

    const getTypeOptions = (): { label: string; value: TipoProducto; precio: number }[] => {
        switch (selectedCategory) {
            case 'Sabalitos':
                return [
                    { label: 'Agua', value: 'Agua', precio: obtenerPrecio('Sabalitos', 'Agua') },
                    { label: 'Leche', value: 'Leche', precio: obtenerPrecio('Sabalitos', 'Leche') },
                    { label: 'Paletas', value: 'Paletas', precio: obtenerPrecio('Sabalitos', 'Paletas') }
                ];
            case 'Paletas':
                return [
                    { label: 'Paletas', value: 'Paletas', precio: obtenerPrecio('Paletas', 'Paletas') }
                ];
            case 'Frituras':
                return [
                    { label: 'Palomitas', value: 'Palomitas', precio: obtenerPrecio('Frituras', 'Palomitas') },
                    { label: 'Chicharrones', value: 'Chicharrones', precio: obtenerPrecio('Frituras', 'Chicharrones') },
                    { label: 'Papas', value: 'Papas', precio: obtenerPrecio('Frituras', 'Papas') },
                    { label: 'Otros', value: 'Otros', precio: obtenerPrecio('Frituras', 'Otros') }
                ];
            case 'Papeleria':
                return [
                    { label: 'Lápices', value: 'Lapices', precio: obtenerPrecio('Papeleria', 'Lapices') },
                    { label: 'Lapiceros', value: 'Lapiceros', precio: obtenerPrecio('Papeleria', 'Lapiceros') },
                    { label: 'Borradores', value: 'Borradores', precio: obtenerPrecio('Papeleria', 'Borradores') },
                    { label: 'Sacapuntas', value: 'Sacapuntas', precio: obtenerPrecio('Papeleria', 'Sacapuntas') },
                    { label: 'Corrector', value: 'Corrector', precio: obtenerPrecio('Papeleria', 'Corrector') },
                    { label: 'Pegamento', value: 'Pegamento', precio: obtenerPrecio('Papeleria', 'Pegamento') }
                ];
            default:
                return [];
        }
    };

    const getCategoryIcon = (category: CategoriaProducto): string => {
        switch (category) {
            case 'Sabalitos': return '🍧';
            case 'Paletas': return '🍭';
            case 'Frituras': return '🍿';
            case 'Papeleria': return '📚';
            default: return '📦';
        }
    };

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Nuevo Producto</Text>
                    
                    <TextInput
                        style={modalStyles.input}
                        placeholder="Nombre del producto"
                        placeholderTextColor={COLOR_PALETTE.textLight}
                        onChangeText={setProductName}
                        value={productName}
                        autoFocus={true}
                    />
                    
                    <Text style={modalStyles.label}>Categoría:</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={modalStyles.categoriesContainer}
                    >
                        {['Sabalitos', 'Paletas', 'Frituras', 'Papeleria'].map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    modalStyles.categoryButton,
                                    selectedCategory === category && modalStyles.categoryButtonActive
                                ]}
                                onPress={() => handleCategoryChange(category as CategoriaProducto)}
                            >
                                <Text style={modalStyles.categoryIcon}>
                                    {getCategoryIcon(category as CategoriaProducto)}
                                </Text>
                                <Text style={[
                                    modalStyles.categoryText,
                                    selectedCategory === category && modalStyles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={modalStyles.label}>Tipo:</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={modalStyles.typesContainer}
                    >
                        {getTypeOptions().map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    modalStyles.typeButton,
                                    selectedType === option.value && modalStyles.typeButtonActive
                                ]}
                                onPress={() => setSelectedType(option.value)}
                            >
                                <Text style={[
                                    modalStyles.typeText,
                                    selectedType === option.value && modalStyles.typeTextActive
                                ]}>
                                    {option.label}
                                </Text>
                                <Text style={[
                                    modalStyles.priceText,
                                    selectedType === option.value && modalStyles.priceTextActive
                                ]}>
                                    ${option.precio.toFixed(2)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={modalStyles.actionButtonContainer}>
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonCancel]} onPress={onClose}>
                            <Text style={modalStyles.textStyle}>Cancelar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[modalStyles.button, modalStyles.buttonAdd]} onPress={handleSave}>
                            <Text style={modalStyles.textStyle}>Añadir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddProductModal;

const modalStyles = StyleSheet.create({
    centeredView: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)' 
    },
    modalView: { 
        margin: 20, 
        backgroundColor: COLOR_PALETTE.surface, 
        borderRadius: 15, 
        padding: 25, 
        width: '90%', 
        maxHeight: '80%',
        alignItems: 'center', 
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15,
        color: COLOR_PALETTE.textPrimary,
    },
    input: { 
        width: '100%', 
        padding: 12, 
        marginBottom: 20, 
        borderWidth: 1, 
        borderColor: COLOR_PALETTE.border, 
        borderRadius: 8,
        color: COLOR_PALETTE.textPrimary,
        backgroundColor: COLOR_PALETTE.background,
        fontSize: 16,
    },
    label: { 
        alignSelf: 'flex-start', 
        marginBottom: 8, 
        fontWeight: '600',
        color: COLOR_PALETTE.textPrimary,
        fontSize: 16,
    },
    categoriesContainer: {
        paddingBottom: 10,
        marginBottom: 15,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.background,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        marginRight: 10,
        gap: 6,
    },
    categoryButtonActive: {
        backgroundColor: COLOR_PALETTE.primary,
        borderColor: COLOR_PALETTE.primary,
    },
    categoryIcon: {
        fontSize: 16,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLOR_PALETTE.textPrimary,
    },
    categoryTextActive: {
        color: COLOR_PALETTE.surface,
    },
    typesContainer: {
        paddingBottom: 10,
        marginBottom: 20,
    },
    typeButton: {
        backgroundColor: COLOR_PALETTE.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLOR_PALETTE.border,
        marginRight: 10,
        alignItems: 'center',
        minWidth: 100,
    },
    typeButtonActive: {
        backgroundColor: COLOR_PALETTE.primaryLight, 
        borderColor: COLOR_PALETTE.primary, 
        borderWidth: 2,
    },
    typeText: {
        color: COLOR_PALETTE.textSecondary,
        fontWeight: '500',
        fontSize: 14,
        marginBottom: 4,
    },
    typeTextActive: {
        color: COLOR_PALETTE.primary, 
        fontWeight: 'bold',
    },
    priceText: {
        color: COLOR_PALETTE.textLight,
        fontSize: 12,
    },
    priceTextActive: {
        color: COLOR_PALETTE.primary,
        fontWeight: '600',
    },
    actionButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    button: { 
        borderRadius: 8, 
        padding: 12, 
        width: '48%', 
        alignItems: 'center' 
    },
    buttonCancel: { 
        backgroundColor: COLOR_PALETTE.textLight,
    },
    buttonAdd: { 
        backgroundColor: COLOR_PALETTE.primary,
    },
    textStyle: { 
        color: COLOR_PALETTE.surface, 
        fontWeight: 'bold',
        fontSize: 16,
    },
});