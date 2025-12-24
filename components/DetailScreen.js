import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Importações dos Contextos (Garantir que estão corretas)
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext'; 

const DetailScreen = () => {
    const { colors } = useTheme(); 
    const { addToCart } = useCart(); 

    const route = useRoute();
    const navigation = useNavigation();
    
    // Garantir que o item foi passado corretamente
    const item = route.params?.selectedItem; 

    // Se por algum motivo o item não foi carregado, exibe erro
    if (!item) {
        return <View style={styles(colors).container}><Text style={styles(colors).errorText}>Erro: Item não encontrado.</Text></View>;
    }

    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        const cartItem = {
            id: item.id,
            nome: item.nome,
            preco: item.precoBase,
            quantidade: quantity,
        };
        
        // CRÍTICO: Verifica se a função existe antes de chamar
        if (addToCart) {
            addToCart(cartItem);
            // Navega de volta para o cardápio ou exibe alerta de sucesso
            Alert.alert(
                "Adicionado!", 
                `${item.nome} (${quantity}x) foi adicionado ao seu carrinho.`,
                [
                    { text: "Continuar Comprando", style: "cancel" },
                    { text: "Ir para o Carrinho", onPress: () => navigation.navigate('Carrinho') }
                ]
            );
        } else {
            console.error("CartContext não está disponível.");
            Alert.alert("Erro", "Não foi possível acessar o carrinho.");
        }
    };

    const totalPrice = (item.precoBase * quantity).toFixed(2).replace('.', ',');
    const pricePerUnit = item.precoBase.toFixed(2).replace('.', ',');

    return (
        <View style={styles(colors).container}>
            <ScrollView contentContainerStyle={styles(colors).scrollContent}>
                
                <Image 
                    source={{ uri: item.imagemUrl }} 
                    style={styles(colors).image} 
                    resizeMode="cover"
                />

                <View style={styles(colors).headerBox}>
                    <Text style={styles(colors).productName}>{item.nome}</Text>
                    <Text style={styles(colors).description}>{item.descricao}</Text>
                </View>

                <View style={styles(colors).quantitySection}>
                    <Text style={styles(colors).priceUnit}>R$ {pricePerUnit} / unidade</Text>
                    
                    <View style={styles(colors).quantityControls}>
                        <TouchableOpacity 
                            style={styles(colors).quantityButton} 
                            onPress={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                            <Text style={styles(colors).quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        
                        <Text style={styles(colors).quantityText}>{quantity}</Text>
                        
                        <TouchableOpacity 
                            style={styles(colors).quantityButton} 
                            onPress={() => setQuantity(q => q + 1)}
                        >
                            <Text style={styles(colors).quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </ScrollView>

            <View style={styles(colors).footer}>
                <View style={styles(colors).totalBox}>
                    <Text style={styles(colors).totalLabel}>Total:</Text>
                    <Text style={[styles(colors).totalPrice, { color: colors.ACCENT }]}>
                        R$ {totalPrice}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles(colors).addButton, { backgroundColor: colors.SUCCESS }]} 
                    onPress={handleAddToCart} // CHAMA A FUNÇÃO CORRETA
                >
                    <Ionicons name="cart-outline" size={24} color={colors.TEXT_LIGHT} />
                    <Text style={styles(colors).addButtonText}>Adicionar ({quantity})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ... (Definição dos Estilos - mantenha como está no seu código)
const styles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.BACKGROUND_LIGHT },
    scrollContent: { paddingBottom: 10 },
    image: { width: '100%', height: 250 },
    headerBox: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    productName: { fontSize: 26, fontWeight: 'bold', color: colors.TEXT_DARK, marginBottom: 8 },
    description: { fontSize: 16, color: colors.TEXT_MUTED },
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
    errorText: { fontSize: 18, color: colors.TEXT_DARK, textAlign: 'center', marginTop: 50 },
});

export default DetailScreen;