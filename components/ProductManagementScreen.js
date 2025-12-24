import React from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    Image, 
    ActivityIndicator 
} from 'react-native';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ProductManagementScreen = ({ navigation }) => {
    const { products, isLoading } = useMenu();
    const { userLevel } = useAuth();
    const { colors } = useTheme();

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.productCard, { backgroundColor: colors.BACKGROUND_DARK || '#FFF' }]}
            onPress={() => navigation.navigate('EditProduct', { product: item, isNew: false })}
        >
            <Image 
                source={{ uri: item.imagemUrl || 'https://via.placeholder.com/150' }} 
                style={styles.productImage}
                resizeMode="cover"
            />
            
            <View style={styles.infoContainer}>
                <Text style={[styles.productName, { color: colors.TEXT_DARK || '#333' }]}>
                    {item.nome}
                </Text>

                {/* AQUI É ONDE A DESCRIÇÃO FICA VISÍVEL PARA O LOGISTA */}
                <Text style={styles.productDescription} numberOfLines={2}>
                    {item.descricao || "Nenhuma descrição cadastrada."}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={[styles.productPrice, { color: colors.SUCCESS || '#28a745' }]}>
                        R$ {parseFloat(item.precoBase || 0).toFixed(2)}
                    </Text>
                    <Text style={styles.productCategory}>{item.categoria}</Text>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}><ActivityIndicator size="large" color={colors.PRIMARY} /></View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listPadding}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
            />

            {userLevel === 2 && (
                <TouchableOpacity 
                    style={[styles.fab, { backgroundColor: colors.PRIMARY || '#FF5733' }]} 
                    onPress={() => navigation.navigate('EditProduct', { isNew: true })}
                >
                    <Ionicons name="add" size={35} color="#FFF" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listPadding: { padding: 15, paddingBottom: 100 },
    productCard: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 12, 
        borderRadius: 12, 
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
    infoContainer: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold' },
    
    // Estilo da descrição na lista
    productDescription: { 
        fontSize: 13, 
        color: '#666', 
        marginVertical: 4,
        lineHeight: 18 
    },
    
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    productPrice: { fontSize: 15, fontWeight: 'bold' },
    productCategory: { fontSize: 11, color: '#999', backgroundColor: '#EEE', paddingHorizontal: 6, borderRadius: 4 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
    fab: { 
        position: 'absolute', right: 20, bottom: 20, width: 65, height: 65, borderRadius: 32.5, 
        justifyContent: 'center', alignItems: 'center', elevation: 5
    }
});

export default ProductManagementScreen;