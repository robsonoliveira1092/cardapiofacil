import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Alert, TextInput, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ route }) => {
    const { cart, cartTotal, removeFromCart, clearCart } = useCart();
    const { restaurantName, restaurantId } = route.params || {};
    
    const [entrega, setEntrega] = useState(true); // true = Entrega, false = Retirada
    const [endereco, setEndereco] = useState('');
    const [taxaEntrega, setTaxaEntrega] = useState(0);

    useEffect(() => {
        // Busca a taxa de entrega configurada pelo lojista
        const fetchTaxa = async () => {
            if (restaurantId) {
                const docRef = doc(db, 'restaurants', restaurantId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTaxaEntrega(Number(docSnap.data().taxaEntrega) || 0);
                }
            }
        };
        fetchTaxa();
    }, [restaurantId]);

    const totalFinal = entrega ? cartTotal + taxaEntrega : cartTotal;

    const enviarPedido = () => {
        if (cart.length === 0) return;
        if (entrega && endereco.length < 5) {
            Alert.alert("Erro", "Por favor, informe o endereço de entrega.");
            return;
        }

        let mensagem = `*Novo Pedido - ${restaurantName}*\n\n`;
        mensagem += `*Itens:*\n`;
        cart.forEach(item => {
            mensagem += `• ${item.quantity}x ${item.nome} (R$ ${(item.preco * item.quantity).toFixed(2)})\n`;
        });

        mensagem += `\n--------------------------\n`;
        mensagem += `*Subtotal:* R$ ${cartTotal.toFixed(2)}\n`;
        mensagem += `*Tipo:* ${entrega ? 'Entrega' : 'Retirada no Local'}\n`;
        if (entrega) {
            mensagem += `*Taxa de Entrega:* R$ ${taxaEntrega.toFixed(2)}\n`;
            mensagem += `*Endereço:* ${endereco}\n`;
        }
        mensagem += `\n*TOTAL FINAL: R$ ${totalFinal.toFixed(2)}*`;

        const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
        Linking.openURL(url).catch(() => Alert.alert("Erro", "WhatsApp não encontrado."));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Finalizar Pedido</Text>
            
            {/* Seletor Entrega/Retirada */}
            <View style={styles.selectorContainer}>
                <TouchableOpacity 
                    style={[styles.selectorBtn, entrega && styles.activeBtn]} 
                    onPress={() => setEntrega(true)}
                >
                    <Text style={[styles.selectorText, entrega && styles.activeText]}>Entrega</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.selectorBtn, !entrega && styles.activeBtn]} 
                    onPress={() => setEntrega(false)}
                >
                    <Text style={[styles.selectorText, !entrega && styles.activeText]}>Retirada</Text>
                </TouchableOpacity>
            </View>

            {/* Lista de Itens */}
            <View style={styles.section}>
                {cart.map(item => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.quantity}x {item.nome}</Text>
                        <Text style={styles.itemPrice}>R$ {(item.preco * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Campo de Endereço */}
            {entrega && (
                <View style={styles.section}>
                    <Text style={styles.label}>Endereço de Entrega:</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Rua, Número, Bairro..." 
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                    <Text style={styles.taxaAviso}>Taxa de entrega fixa: R$ {taxaEntrega.toFixed(2)}</Text>
                </View>
            )}

            {/* Resumo de Valores */}
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>R$ {totalFinal.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.btnSend} onPress={enviarPedido}>
                    <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                    <Text style={styles.btnSendText}>ENVIAR VIA WHATSAPP</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    title: { fontSize: 24, fontWeight: '900', marginBottom: 20 },
    selectorContainer: { flexDirection: 'row', backgroundColor: '#E9ECEF', borderRadius: 10, padding: 5, marginBottom: 20 },
    selectorBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    activeBtn: { backgroundColor: '#FFF', elevation: 2 },
    selectorText: { fontWeight: 'bold', color: '#6C757D' },
    activeText: { color: '#FF5733' },
    section: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    itemText: { fontSize: 16, color: '#333' },
    itemPrice: { fontWeight: 'bold' },
    label: { fontWeight: 'bold', marginBottom: 8 },
    input: { borderBottomWidth: 1, borderColor: '#DDD', paddingVertical: 8, fontSize: 16 },
    taxaAviso: { marginTop: 10, fontSize: 12, color: '#28A745', fontWeight: 'bold' },
    footer: { marginTop: 10, paddingBottom: 50 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
    totalLabel: { fontSize: 20, fontWeight: 'bold' },
    totalValue: { fontSize: 26, fontWeight: '900', color: '#28A745' },
    btnSend: { backgroundColor: '#25D366', flexDirection: 'row', padding: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 4 },
    btnSendText: { color: '#FFF', fontWeight: '900', fontSize: 18, marginLeft: 10 }
});

export default CartScreen;