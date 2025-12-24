import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useCart } from '../context/CartContext'; 
import { Ionicons } from '@expo/vector-icons';

const CardapioHome = ({ route, navigation }) => {
    const { restaurantId, restaurantName } = route.params || {};
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, removeFromCart, cart, cartTotal, cartCount } = useCart();

    useEffect(() => {
        if (!restaurantId) return;

        const q = query(collection(db, 'products'), where('restaurantId', '==', restaurantId));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProdutos(list);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar produtos:", error);
            setLoading(false);
        });

        return () => unsub();
    }, [restaurantId]);

    const getItemQuantity = (id) => {
        const item = cart.find(i => i.id === id);
        return item ? item.quantity : 0;
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{restaurantName || 'Cardápio'}</Text>
                <Text style={styles.subtitle}>Selecione seus itens favoritos</Text>
            </View>

            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image 
                            source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} 
                            style={styles.image} 
                        />
                        <View style={styles.info}>
                            <Text style={styles.nome}>{item.nome}</Text>
                            <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>
                            
                            <View style={styles.controls}>
                                {getItemQuantity(item.id) > 0 && (
                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                            <Ionicons name="remove-circle" size={36} color="#D00000" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{getItemQuantity(item.id)}</Text>
                                    </View>
                                )}
                                <TouchableOpacity onPress={() => addToCart(item, restaurantId)}>
                                    <Ionicons name="add-circle" size={36} color="#28A745" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>Nenhum produto encontrado nesta loja.</Text>
                    </View>
                }
            />

            {cartCount > 0 && (
                <TouchableOpacity 
                    style={styles.cartBar} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CartScreen', { 
                        restaurantName, 
                        restaurantId 
                    })}
                >
                    <View style={styles.cartBadge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                    <Text style={styles.cartBarText}>VER CARRINHO</Text>
                    <Text style={styles.cartBarTotal}>R$ {cartTotal.toFixed(2)}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F4F9' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EEE' },
    title: { fontSize: 24, fontWeight: '900', color: '#333' },
    subtitle: { fontSize: 14, color: '#888', fontWeight: 'bold' },
    listContent: { paddingBottom: 100 },
    card: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 15, marginTop: 15, borderRadius: 15, padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
    image: { width: 90, height: 90, borderRadius: 10 },
    info: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
    nome: { fontSize: 18, fontWeight: '800', color: '#000' },
    preco: { fontSize: 17, fontWeight: '900', color: '#28A745' },
    controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
    quantityContainer: { flexDirection: 'row', alignItems: 'center' },
    quantity: { marginHorizontal: 12, fontSize: 18, fontWeight: '900', color: '#333' },
    cartBar: { 
        position: 'absolute', bottom: 25, left: 15, right: 15, 
        backgroundColor: '#FF5733', padding: 18, borderRadius: 15, 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 
    },
    cartBarText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    cartBarTotal: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    cartBadge: { backgroundColor: '#FFF', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#FF5733', fontWeight: '900', fontSize: 14 },
    emptyText: { color: '#999', fontSize: 16, fontWeight: 'bold' }
});

export default CardapioHome;