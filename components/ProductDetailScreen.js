import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importações dos Contextos
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext'; // <--- CRÍTICO: Garante a importação correta

const ProductDetailScreen = () => {
    // Puxa as cores do tema
    const { colors } = useTheme(); 
    // Puxa a função de adicionar ao carrinho
    const { addToCart } = useCart(); // <--- CRÍTICO: O erro de 'undefined' ocorre aqui se o import falhar

    const route = useRoute();
    const navigation = useNavigation();
    const item = route.params.selectedItem;

    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // Objeto do item a ser adicionado
        const cartItem = {
            id: item.id,
            nome: item.nome,
            preco: item.precoBase,
            quantidade: quantity,
        };
        
        // Chama a função addToCart (que estava dando erro)
        if (addToCart) {
            addToCart(cartItem);
            // Navega de volta ou para o carrinho
            navigation.navigate('Carrinho');
        } else {
            // Mensagem de erro caso o CartContext não esteja acessível
            console.error("CartContext não está disponível.");
        }
    };

    const totalPrice = (item.precoBase * quantity).toFixed(2).replace('.', ',');
    const pricePerUnit = item.precoBase.toFixed(2).replace('.', ',');

    return (
        <View style={styles(colors).container}>
            <ScrollView contentContainerStyle={styles(colors).scrollContent}>
                
                {/* Imagem */}
                <Image 
                    source={{ uri: item.imagemUrl }} 
                    style={styles(colors).image} 
                    resizeMode="cover"
                />

                {/* Título e Descrição */}
                <View style={styles(colors).headerBox}>
                    <Text style={styles(colors).productName}>{item.nome}</Text>
                    <Text style={styles(colors).description}>{item.descricao}</Text>
                </View>

                {/* Seção de Preço e Quantidade */}
                <View style={styles(colors).quantitySection}>
                    <Text style={styles(colors).priceUnit}>R$ {pricePerUnit} / unidade</Text>
                    
                    <View style={styles(colors).quantityControls}>
                        {/* Botão Diminuir */}
                        <TouchableOpacity 
                            style={styles(colors).quantityButton} 
                            onPress={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                            <Text style={styles(colors).quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        
                        <Text style={styles(colors).quantityText}>{quantity}</Text>
                        
                        {/* Botão Aumentar */}
                        <TouchableOpacity 
                            style={styles(colors).quantityButton} 
                            onPress={() => setQuantity(q => q + 1)}
                        >
                            <Text style={styles(colors).quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>

            {/* Rodapé: Total e Adicionar ao Carrinho */}
            <View style={styles(colors).footer}>
                <View style={styles(colors).totalBox}>
                    <Text style={styles(colors).totalLabel}>Total:</Text>
                    <Text style={[styles(colors).totalPrice, { color: colors.ACCENT }]}>
                        R$ {totalPrice}
                    </Text>
                </View>
                
                {/* Botão Adicionar ao Carrinho */}
                <TouchableOpacity style={[styles(colors).addButton, { backgroundColor: colors.SUCCESS }]} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={24} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).addButtonText}>Adicionar ({quantity})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.BACKGROUND_LIGHT },
    scrollContent: { paddingBottom: 10 },
    image: { width: '100%', height: 250 },
    headerBox: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    productName: { fontSize: 26, fontWeight: 'bold', color: colors.TEXT_DARK, marginBottom: 8 },
    description: { fontSize: 16, color: colors.TEXT_MUTED },

    // Quantidade
    quantitySection: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    priceUnit: { fontSize: 16, color: colors.TEXT_MUTED },
    quantityControls: { flexDirection: 'row', alignItems: 'center' },
    quantityButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.BACKGROUND_DARK,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.ACCENT,
    },
    quantityButtonText: { fontSize: 20, fontWeight: 'bold', color: colors.ACCENT },
    quantityText: { fontSize: 18, marginHorizontal: 15, color: colors.TEXT_DARK },
    
    // Rodapé
    footer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.BACKGROUND_DARK,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalBox: { flexDirection: 'column' },
    totalLabel: { fontSize: 14, color: colors.TEXT_MUTED },
    totalPrice: { fontSize: 24, fontWeight: 'bold' },
    addButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: { 
        color: colors.TEXT_LIGHT, 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginLeft: 10 
    },
});

export default ProductDetailScreen;