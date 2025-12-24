// components/CategoryItemsScreen.js
import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity,
    Image // <-- Importação para exibir a imagem
} from 'react-native';
import { useTheme } from '../theme/ThemeContext'; 
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { Ionicons } from '@expo/vector-icons';

const CategoryItemsScreen = ({ route, navigation }) => {
    const { colors } = useTheme();
    const { restaurantId } = useAuth(); 
    
    // Captura o parâmetro 'category'
    const { category } = route.params || { category: 'Categoria Desconhecida' };

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!restaurantId) {
            setError("ID do Restaurante Ausente. Não é possível carregar produtos.");
            setIsLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const productsRef = collection(db, 'restaurants', restaurantId, 'products');
                const q = query(productsRef, where('category', '==', category));
                
                const querySnapshot = await getDocs(q);
                const productsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setProducts(productsList);
            } catch (err) {
                console.error("Erro ao buscar produtos por categoria:", err);
                setError("Falha ao buscar produtos. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [restaurantId, category]); 

    // Função de renderização para cada item da lista (Sintaxe JSX Correta)
    const renderProductItem = ({ item }) => {
        // Verifica se a URL da imagem existe e tem conteúdo
        const hasImage = item.imageUrl && item.imageUrl.length > 0;
        
        return (
            <TouchableOpacity
                style={[styles.productItem, { backgroundColor: colors.BACKGROUND_DARK }]}
                onPress={() => navigation.navigate('Detail', { productId: item.id })}
            >
                {hasImage ? (
                    <Image 
                        source={{ uri: item.imageUrl }} 
                        style={styles.productImage} 
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.productImage, styles.imagePlaceholder]}>
                        <Ionicons name="image-outline" size={30} color={colors.TEXT_MUTED} />
                    </View>
                )}
                
                <View style={styles.textContainer}>
                    <Text style={[styles.productName, { color: colors.TEXT_DARK }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={{ color: colors.TEXT_MUTED }} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
                <Text style={[styles.productPrice, { color: colors.ACCENT }]}>
                    R$ {item.price ? item.price.toFixed(2) : '0.00'}
                </Text>
            </TouchableOpacity>
        );
    }; // <-- Fechamento da função renderProductItem

    // --- RENDERIZAÇÃO PRINCIPAL ---
    
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.BACKGROUND_LIGHT }]}>
                <ActivityIndicator size="large" color={colors.PRIMARY} />
                <Text style={{ color: colors.TEXT_MUTED, marginTop: 10 }}>Carregando produtos de {category}...</Text>
            </View>
        );
    }
    
    if (error) {
         return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.BACKGROUND_LIGHT }]}>
                <Ionicons name="warning-outline" size={30} color={colors.ERROR} />
                <Text style={[styles.errorText, { color: colors.ERROR, marginTop: 10 }]}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND_LIGHT }]}>
            <View style={[styles.header, { borderBottomColor: colors.BORDER }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.TEXT_DARK }]}>
                    {category}
                </Text>
            </View>
            
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderProductItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <Text style={[styles.emptyText, { color: colors.TEXT_MUTED }]}>
                        Nenhum item encontrado nesta categoria.
                    </Text>
                )}
            />
        </SafeAreaView>
    );
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        elevation: 1,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: '#000',
    },
    // Estilos para a imagem e placeholder
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10,
    },
    imagePlaceholder: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
    }
});

export default CategoryItemsScreen;