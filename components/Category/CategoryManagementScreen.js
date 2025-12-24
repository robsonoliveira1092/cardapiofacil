import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useMenu } from '../../context/MenuContext';

const CategoryManagementScreen = () => {
    const { colors } = useTheme();
    const { categories, addCategory, removeCategory } = useMenu();
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory(newCategoryName);
            setNewCategoryName('');
        } else {
            Alert.alert("Aviso", "Por favor, digite um nome válido para a categoria.");
        }
    };

    const handleRemoveCategory = (categoryName) => {
        removeCategory(categoryName);
    };

    const renderItem = ({ item }) => (
        <View style={styles(colors).categoryItem}>
            <Text style={styles(colors).categoryName}>{item}</Text>
            <TouchableOpacity 
                style={styles(colors).deleteButton} 
                onPress={() => handleRemoveCategory(item)}
            >
                <Ionicons name="trash-outline" size={20} color={colors.TEXT_LIGHT} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles(colors).container}>
            <Text style={styles(colors).headerText}>Adicionar Nova Categoria</Text>
            
            <View style={styles(colors).inputRow}>
                <TextInput
                    style={styles(colors).input}
                    placeholder="Ex: Pizzas, Drinks, Vegan"
                    placeholderTextColor="#999"
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                />
                <TouchableOpacity style={styles(colors).addButton} onPress={handleAddCategory}>
                    <Ionicons name="add-circle" size={30} color={colors.TEXT_LIGHT} />
                </TouchableOpacity>
            </View>

            <Text style={styles(colors).listTitle}>Categorias Atuais ({categories.length})</Text>

            <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                contentContainerStyle={styles(colors).listContainer}
            />
        </View>
    );
};

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.BACKGROUND_LIGHT },
    headerText: { fontSize: 20, fontWeight: 'bold', color: colors.PRIMARY, marginBottom: 10 },
    inputRow: { flexDirection: 'row', marginBottom: 20 },
    input: {
        flex: 1,
        backgroundColor: colors.BACKGROUND_DARK,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginRight: 10,
        color: colors.TEXT_DARK,
    },
    addButton: {
        backgroundColor: colors.SUCCESS,
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listTitle: { fontSize: 18, fontWeight: 'bold', color: colors.TEXT_DARK, marginTop: 15, marginBottom: 10 },
    listContainer: { paddingBottom: 20 },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.BACKGROUND_DARK,
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        elevation: 1,
    },
    categoryName: { fontSize: 16, color: colors.TEXT_DARK, fontWeight: '600' },
    deleteButton: {
        backgroundColor: '#FF3B30', // Vermelho Destrutivo
        padding: 5,
        borderRadius: 5,
    },
});

export default CategoryManagementScreen;