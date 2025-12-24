import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importação dos Contextos
import { useMenu } from '../context/MenuContext'; 
import { useTheme } from '../theme/ThemeContext'; 
import { useAuth } from '../context/AuthContext'; 

// Componente individual do item na administração
const AdminMenuItem = ({ item, navigation, onRemove, colors, canEdit }) => {
    
    const handleEdit = () => {
        if (canEdit) {
            navigation.navigate('EditProduct', { item: item }); 
        } else {
            Alert.alert("Acesso Negado", "Você não tem permissão para editar produtos.");
        }
    };
    
    const handleDelete = () => {
        if (canEdit) {
            Alert.alert(
                "Confirmar Exclusão",
                `Você tem certeza que deseja remover "${item.nome}" permanentemente?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: () => onRemove(item.id) },
                ]
            );
        } else {
            Alert.alert("Acesso Negado", "Você não tem permissão para excluir produtos.");
        }
    };

    return (
        <View style={styles(colors).menuItemContainer}>
            {item.imagemUrl && (
                <Image 
                    source={{ uri: item.imagemUrl }} 
                    style={styles(colors).image} 
                    resizeMode="cover"
                />
            )}
            <View style={styles(colors).textContainer}>
                <Text style={styles(colors).name}>{item.nome}</Text>
                <Text style={styles(colors).category}>Categoria: {item.categoria}</Text>
                <Text style={styles(colors).price}>R$ {item.precoBase.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={styles(colors).actionsContainer}>
                {canEdit && (
                    <>
                        <TouchableOpacity 
                            style={[styles(colors).actionButton, { backgroundColor: colors.ACCENT }]} 
                            onPress={handleEdit}
                        >
                            <Ionicons name="create-outline" size={20} color={colors.TEXT_LIGHT} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles(colors).actionButton, { backgroundColor: '#FF3B30' }]} 
                            onPress={handleDelete}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.TEXT_LIGHT} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const AdminScreen = ({ navigation }) => {
    const { userLevel } = useAuth(); 
    const { menuData, removeProduct } = useMenu();
    const { colors } = useTheme(); 

    const canManageProducts = userLevel <= 2; 
    const canManageSettings = userLevel === 1; 

    const navigateToNewProduct = () => { navigation.navigate('NewProduct'); };
    const navigateToThemeSettings = () => { navigation.navigate('ThemeSettings'); };
    const navigateToUserManagement = () => { navigation.navigate('UserManagement'); };
    const navigateToCategoryManagement = () => { navigation.navigate('CategoryManagement'); };

    return (
        <View style={styles(colors).container}>
            
            {/* Botão Gerenciar Usuários (Nível 1) */}
            {canManageSettings && (
                <TouchableOpacity 
                    style={[styles(colors).topButton, { backgroundColor: colors.PRIMARY, marginBottom: 10 }]} 
                    onPress={navigateToUserManagement}
                >
                    <Ionicons name="people-outline" size={20} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).topButtonText}>Gerenciar Usuários</Text>
                </TouchableOpacity>
            )}

            {/* Botão Customizar Tema/Banners (Nível 1) */}
            {canManageSettings && (
                <TouchableOpacity 
                    style={[styles(colors).topButton, { backgroundColor: colors.ACCENT, marginBottom: 10 }]} 
                    onPress={navigateToThemeSettings}
                >
                    <Ionicons name="image-outline" size={20} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).topButtonText}>Customizar Tema e Banners</Text>
                </TouchableOpacity>
            )}
            
            {/* Botão Gerenciar Categorias (Nível 1 e 2) */}
            {canManageProducts && (
                <TouchableOpacity 
                    style={[styles(colors).topButton, { backgroundColor: '#007AA8', marginBottom: 10 }]} 
                    onPress={navigateToCategoryManagement}
                >
                    <Ionicons name="list-outline" size={20} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).topButtonText}>Gerenciar Categorias</Text>
                </TouchableOpacity>
            )}

            {/* Botão Adicionar Novo Item (Nível 1 e 2) */}
            {canManageProducts && (
                <TouchableOpacity 
                    style={[styles(colors).topButton, { backgroundColor: colors.SUCCESS, marginBottom: 10 }]} 
                    onPress={navigateToNewProduct}
                >
                    <Ionicons name="add-circle-outline" size={20} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).topButtonText}>+ Novo Item (Cardápio)</Text>
                </TouchableOpacity>
            )}

            <FlatList
                data={menuData} 
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AdminMenuItem
                        item={item}
                        navigation={navigation}
                        onRemove={removeProduct}
                        colors={colors} 
                        canEdit={canManageProducts} 
                    />
                )}
                ListHeaderComponent={<Text style={styles(colors).listHeader}>Itens Atuais do Cardápio ({menuData.length})</Text>}
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
        </View>
    );
};

// Estilos dinâmicos
const styles = (colors) => StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: colors.BACKGROUND_LIGHT },
    topButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        elevation: 2,
    },
    topButtonText: {
        color: colors.TEXT_LIGHT,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    listHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: colors.TEXT_DARK,
    },
    menuItemContainer: {
        flexDirection: 'row',
        backgroundColor: colors.BACKGROUND_DARK,
        borderRadius: 10,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        elevation: 1,
    },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
    textContainer: { flex: 1, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: 'bold', color: colors.TEXT_DARK },
    category: { fontSize: 12, color: colors.TEXT_MUTED, marginBottom: 2 }, 
    price: { fontSize: 14, color: colors.ACCENT, marginTop: 3 },
    actionsContainer: { flexDirection: 'row' },
    actionButton: {
        padding: 8,
        borderRadius: 5,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AdminScreen;