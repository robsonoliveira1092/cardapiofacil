import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ProductDetailsScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { colors } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.BACKGROUND_LIGHT }}>
            <ScrollView>
                <Image 
                    source={{ uri: product.imagemUrl || 'https://via.placeholder.com/150' }} 
                    style={styles.image} 
                />
                
                <View style={styles.content}>
                    <Text style={[styles.name, { color: colors.TEXT_DARK }]}>{product.nome}</Text>
                    <Text style={styles.category}>{product.categoria}</Text>
                    
                    <Text style={[styles.price, { color: colors.SUCCESS }]}>
                        R$ {parseFloat(product.precoBase || 0).toFixed(2)}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: colors.TEXT_DARK }]}>Descrição</Text>
                    <Text style={styles.description}>
                        {product.descricao || 'Nenhum detalhe adicional fornecido.'}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.PRIMARY }]}>
                    <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    image: { width: '100%', height: 300, resizeMode: 'cover' },
    content: { padding: 20 },
    name: { fontSize: 24, fontWeight: 'bold' },
    category: { fontSize: 14, color: '#999', textTransform: 'uppercase', marginBottom: 10 },
    price: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    description: { fontSize: 16, color: '#666', lineHeight: 24 },
    footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
    addButton: { padding: 18, borderRadius: 12, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default ProductDetailsScreen;