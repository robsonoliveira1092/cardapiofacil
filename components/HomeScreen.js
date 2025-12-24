import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    ActivityIndicator 
} from 'react-native';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
    // Agora o products e categories já vêm filtrados pelo restaurantId selecionado na tela anterior
    const { products, categories, isLoading } = useMenu();
    const { colors } = useTheme();

    const renderProduct = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: colors.BACKGROUND_DARK || '#FFF' }]}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
            <Image 
                source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150?text=Sem+Imagem' }} 
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <View>
                    <Text style={[styles.name, { color: colors.TEXT_DARK || '#333' }]} numberOfLines={1}>
                        {item.nome}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.descricao || 'Toque para ver detalhes e ingredientes.'}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <Text style={[styles.price, { color: colors.SUCCESS || '#28a745' }]}>
                        R$ {parseFloat(item.precoBase || 0).toFixed(2)}
                    </Text>
                    <Ionicons name="add-circle" size={28} color={colors.PRIMARY || '#FF5733'} />
                </View>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.PRIMARY} />
                <Text style={{marginTop: 10, color: '#666'}}>Carregando cardápio...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND_LIGHT || '#F8F8F8' }]}>
            {/* Header com Categorias */}
            <View style={styles.header}>
                <FlatList 
                    horizontal
                    data={['Todos', ...categories]}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.categoryBadge, { backgroundColor: colors.PRIMARY || '#FF5733' }]}>
                            <Text style={styles.categoryText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Lista de Produtos */}
            <FlatList 
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderProduct}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Ionicons name="fast-food-outline" size={50} color="#CCC" />
                        <Text style={styles.emptyText}>
                            Este restaurante ainda não cadastrou produtos no cardápio.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    header: { paddingVertical: 15, paddingHorizontal: 10 },
    categoriesList: { paddingRight: 20 },
    categoryBadge: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 25, marginRight: 10, elevation: 2 },
    categoryText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    listContent: { paddingHorizontal: 15, paddingBottom: 30 },
    card: { 
        flexDirection: 'row', 
        borderRadius: 15, 
        marginBottom: 15, 
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    image: { width: 110, height: 110 },
    info: { flex: 1, padding: 12, justifyContent: 'space-between' },
    name: { fontSize: 17, fontWeight: 'bold' },
    description: { fontSize: 12, color: '#777', marginTop: 4 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 18, fontWeight: 'bold' },
    emptyText: { color: '#999', textAlign: 'center', marginTop: 10, fontSize: 16 }
});

export default HomeScreen;