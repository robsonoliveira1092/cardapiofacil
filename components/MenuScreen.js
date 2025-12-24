import React, { useState } from 'react'; // Garante que o useState está aqui
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importação dos Contextos
import { useMenu } from '../context/MenuContext'; 
import { useTheme } from '../theme/ThemeContext'; 
import MenuItem from './MenuItem'; 

// === Componente da Tela Inicial (MenuScreen) ===
function MenuScreen() {
    // Puxa menuData e categories do MenuContext
    const { menuData, categories } = useMenu();
    const { colors } = useTheme(); 
    const navigation = useNavigation();

    // ESTADO CRÍTICO: Estado para armazenar a categoria selecionada (inicialmente 'Todos')
    const [selectedCategory, setSelectedCategory] = useState('Todos'); 

    // Lógica para filtrar o menu
    const filteredMenu = menuData.filter(item => 
        selectedCategory === 'Todos' || item.categoria === selectedCategory
    );

    // Lógica para navegar ao Detalhe (Clique no Item)
    const handleSelectItem = (item) => {
        navigation.navigate('Detalhes', { selectedItem: item });
    };

    // FUNÇÃO CRÍTICA: Renderiza os botões de categoria
    const renderCategoryTabs = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles(colors).categoryTabContainer}
        >
            {/* Mapeia 'Todos' e as categorias do contexto */}
            {['Todos', ...categories].map(category => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles(colors).categoryButton,
                        selectedCategory === category && styles(colors).categoryButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category)}
                >
                    <Text style={[
                        styles(colors).categoryButtonText,
                        selectedCategory === category && styles(colors).categoryButtonTextActive
                    ]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View style={styles(colors).container}>
            {/* CHAMADA CRÍTICA: Renderiza a barra de categorias */}
            {renderCategoryTabs()} 
            
            <Text style={styles(colors).headerText}>
                {selectedCategory} ({filteredMenu.length} Itens)
            </Text>
            
            <FlatList
                data={filteredMenu} // Usa o menu FILTRADO
                keyExtractor={(item) => item.id} 
                renderItem={({ item }) => (
                    <MenuItem
                        {...item} 
                        onSelect={() => handleSelectItem(item)} 
                    />
                )}
                contentContainerStyle={styles(colors).listContent}
            />
        </View>
    );
}

// Estilos para MenuScreen (Ajuste para usar o tema)
const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.BACKGROUND_LIGHT },
    
    // Estilos da aba de categorias
    categoryTabContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.BACKGROUND_DARK,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: colors.BACKGROUND_LIGHT,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    categoryButtonActive: {
        backgroundColor: colors.ACCENT, // Cor de destaque
        borderColor: colors.ACCENT,
    },
    categoryButtonText: {
        color: colors.TEXT_DARK,
        fontWeight: '500',
    },
    categoryButtonTextActive: {
        color: colors.TEXT_LIGHT, // Branco
        fontWeight: 'bold',
    },
    
    // Estilos da lista
    headerText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: colors.TEXT_DARK, 
        marginTop: 15, 
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    listContent: { paddingBottom: 20, paddingHorizontal: 10 },
});

export default MenuScreen;