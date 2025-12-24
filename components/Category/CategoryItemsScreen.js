import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useMenu } from '../context/MenuContext';
import { useTheme } from '../theme/ThemeContext';
import MenuItem from './MenuItem'; 

const CategoryItemsScreen = () => {
    const { colors } = useTheme();
    const { menuData } = useMenu();
    const navigation = useNavigation();
    const route = useRoute();
    
    // Puxa o nome da categoria passada como parâmetro
    const categoryName = route.params?.category || 'Itens'; 

    // Filtra o menu pelos itens da categoria
    const categoryItems = menuData.filter(item => item.categoria === categoryName);

    const handleSelectItem = (item) => {
        navigation.navigate('Detalhes', { selectedItem: item });
    };

    return (
        <View style={styles(colors).container}>
            <Text style={styles(colors).headerTitle}>{categoryName} ({categoryItems.length} Itens)</Text>
            
            <FlatList
                data={categoryItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <MenuItem
                        {...item}
                        onSelect={() => handleSelectItem(item)}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles(colors).emptyContainer}>
                        <Text style={styles(colors).emptyText}>Não há itens cadastrados nesta categoria.</Text>
                    </View>
                )}
                contentContainerStyle={styles(colors).listContent}
            />
            
            {/* Botão de Voltar para a Tela Inicial */}
            <TouchableOpacity 
                style={[styles(colors).backButton, { backgroundColor: colors.PRIMARY }]} 
                onPress={() => navigation.navigate('Cardápio')} // Volta para a rota principal (HomeScreen)
            >
                <Ionicons name="arrow-back-outline" size={24} color={colors.TEXT_LIGHT} />
                <Text style={styles(colors).backButtonText}>Voltar ao Início</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.BACKGROUND_LIGHT, paddingBottom: 70 }, // Espaço para o botão
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.TEXT_DARK,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listContent: { padding: 10, paddingBottom: 20 },
    emptyContainer: { padding: 20, alignItems: 'center' },
    emptyText: { color: colors.TEXT_MUTED, fontSize: 16 },

    // Botão Voltar (fixo no rodapé)
    backButton: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        elevation: 5,
    },
    backButtonText: {
        color: colors.TEXT_LIGHT,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});

export default CategoryItemsScreen;