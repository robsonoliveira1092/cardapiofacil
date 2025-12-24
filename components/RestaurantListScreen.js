import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const RestaurantListScreen = ({ navigation }) => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'restaurants'), (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRestaurantes(list);
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Restaurantes</Text>
            <FlatList
                data={restaurantes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.card}
                        onPress={() => navigation.navigate('CardapioHome', { 
                            restaurantId: item.id, 
                            restaurantName: item.nome 
                        })}
                    >
                        <Image 
                            source={{ uri: item.logoUrl || 'https://via.placeholder.com/150' }} 
                            style={styles.logo} 
                        />
                        <View style={styles.info}>
                            <Text style={styles.nomeLoja}>{item.nome}</Text>
                            <Text style={styles.taxaText}>Taxa de entrega: R$ {Number(item.taxaEntrega || 0).toFixed(2)}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#CCC" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma loja encontrada.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 15 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '900', color: '#000', marginBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 12, alignItems: 'center', elevation: 3 },
    logo: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#EEE' },
    info: { flex: 1, marginLeft: 15 },
    nomeLoja: { fontSize: 18, fontWeight: 'bold', color: '#000' },
    taxaText: { fontSize: 14, color: '#28A745', fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default RestaurantListScreen;