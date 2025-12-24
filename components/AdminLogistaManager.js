import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const AdminLogistaManager = () => {
    const [logistas, setLogistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'restaurants'), (snap) => {
            setLogistas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const adicionarLoja = async () => {
        if (!novoNome) return Alert.alert("Erro", "Digite o nome");
        await addDoc(collection(db, 'restaurants'), { nome: novoNome, email: novoEmail, level: 2 });
        setNovoNome(''); setNovoEmail(''); Keyboard.dismiss();
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FF5733" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder="Nome da Loja" value={novoNome} onChangeText={setNovoNome} />
                <TouchableOpacity style={styles.btn} onPress={adicionarLoja}>
                    <Text style={{color:'#FFF', fontWeight:'bold'}}>ADICIONAR</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={logistas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nome}>{item.nome || "S/N"}</Text>
                        <TouchableOpacity onPress={() => deleteDoc(doc(db, 'restaurants', item.id))}>
                            <Ionicons name="trash" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7', padding: 10 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    form: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 5, marginBottom: 10 },
    btn: { backgroundColor: '#28A745', padding: 15, borderRadius: 5, alignItems: 'center' },
    card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, marginBottom: 5, borderRadius: 8, justifyContent: 'space-between' },
    nome: { fontWeight: 'bold' }
});

export default AdminLogistaManager;
