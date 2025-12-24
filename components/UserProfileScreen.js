import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, StyleSheet, TouchableOpacity, 
    ScrollView, Alert, ActivityIndicator, SafeAreaView 
} from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = () => {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setNome(data.nome || '');
                    setTelefone(data.telefone || '');
                    setEndereco(data.endereco || '');
                }
            } catch (error) {
                Alert.alert("Erro", "Falha ao carregar dados do perfil.");
            } finally {
                setLoading(false);
            }
        };
        loadUserData();
    }, [user.uid]);

    const handleUpdate = async () => {
        if (!nome || !telefone || !endereco) {
            Alert.alert("Erro", "Preencha todos os campos para garantir a entrega.");
            return;
        }
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                nome,
                telefone,
                endereco,
                updatedAt: new Date()
            });
            Alert.alert("Sucesso", "Dados atualizados!");
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar alterações.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={colors.PRIMARY} /></View>;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="person-circle" size={80} color={colors.PRIMARY || '#FF5733'} />
                    <Text style={styles.email}>{user.email}</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome} />

                    <Text style={styles.label}>Telefone / WhatsApp</Text>
                    <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

                    <Text style={styles.label}>Endereço de Entrega</Text>
                    <TextInput 
                        style={[styles.input, { height: 80 }]} 
                        value={endereco} 
                        onChangeText={setEndereco} 
                        multiline 
                        textAlignVertical="top"
                    />

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.PRIMARY || '#FF5733' }]} 
                        onPress={handleUpdate} 
                        disabled={saving}
                    >
                        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar Dados</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Ionicons name="log-out-outline" size={20} color="red" />
                        <Text style={styles.logoutText}>Sair da Conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', padding: 30, backgroundColor: '#F8F8F8' },
    email: { fontSize: 16, color: '#666', marginTop: 10 },
    form: { padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, marginBottom: 15 },
    button: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFF', fontWeight: 'bold' },
    logoutButton: { marginTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    logoutText: { color: 'red', fontWeight: 'bold', marginLeft: 8 }
});

export default UserProfileScreen;