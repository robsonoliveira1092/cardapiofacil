import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ThemeSettingsScreen = () => {
    const { user, logout } = useAuth(); // Importamos o logout aqui também
    const [loading, setLoading] = useState(true);
    const [taxaEntrega, setTaxaEntrega] = useState('');
    const [nomeLoja, setNomeLoja] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            // VERIFICAÇÃO DE SEGURANÇA: Se não houver user, não faz nada
            if (!user?.uid) {
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'restaurants', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNomeLoja(data.nome || '');
                    setTaxaEntrega(data.taxaEntrega?.toString() || '0');
                }
            } catch (error) {
                console.log("Erro ao carregar configurações:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, [user]);

    const salvarConfiguracoes = async () => {
        if (!user?.uid) return; // Segurança extra

        try {
            const docRef = doc(db, 'restaurants', user.uid);
            await updateDoc(docRef, {
                taxaEntrega: parseFloat(taxaEntrega.replace(',', '.')) || 0
            });
            Alert.alert("Sucesso", "Configurações da loja atualizadas!");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    };

    const handleLogout = () => {
        Alert.alert("Sair", "Deseja realmente sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", onPress: logout, style: "destructive" }
        ]);
    };

    // Se estiver carregando ou se o usuário sumiu (logout), mostra um carregamento ou nada
    if (loading || !user) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Configurar Loja</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.card}>
                <Text style={styles.label}>Nome da Loja:</Text>
                <TextInput 
                    style={[styles.input, { backgroundColor: '#EEE' }]} 
                    value={nomeLoja} 
                    editable={false} 
                />
                
                <Text style={styles.label}>Taxa de Entrega Fixa (R$):</Text>
                <View style={styles.inputRow}>
                    <Ionicons name="bicycle" size={24} color="#FF5733" style={{marginRight: 10}} />
                    <TextInput 
                        style={styles.input} 
                        keyboardType="numeric"
                        placeholder="Ex: 5.00" 
                        value={taxaEntrega}
                        onChangeText={setTaxaEntrega}
                    />
                </View>
                
                <TouchableOpacity style={styles.btnSalvar} onPress={salvarConfiguracoes}>
                    <Text style={styles.btnText}>SALVAR ALTERAÇÕES</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900' },
    logoutBtn: { padding: 5 },
    card: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 3 },
    label: { fontWeight: 'bold', marginBottom: 5, color: '#444' },
    inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#DDD', marginBottom: 20 },
    input: { flex: 1, paddingVertical: 10, fontSize: 18, color: '#000' },
    btnSalvar: { backgroundColor: '#FF5733', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ThemeSettingsScreen;