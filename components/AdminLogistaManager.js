import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, Keyboard } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const AdminLogistaManager = () => {
    const [logistas, setLogistas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Novo Lojista
    const [novoNome, setNovoNome] = useState('');
    const [novoEmail, setNovoEmail] = useState('');
    const [novaTaxa, setNovaTaxa] = useState('');

    // Estados para Edição
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLogista, setSelectedLogista] = useState(null);
    const [editNome, setEditNome] = useState('');
    const [editTaxa, setEditTaxa] = useState('');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'restaurants'), (snap) => {
            const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLogistas(list);
            setLoading(false);
        }, (error) => {
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const adicionarLogista = async () => {
        if (!novoNome || !novoEmail) {
            Alert.alert("Erro", "Nome e E-mail são obrigatórios");
            return;
        }
        try {
            await addDoc(collection(db, 'restaurants'), {
                nome: novoNome,
                email: novoEmail,
                taxaEntrega: parseFloat(novaTaxa.replace(',', '.')) || 0,
                level: 2 // Define como lojista automaticamente
            });
            setNovoNome(''); setNovoEmail(''); setNovaTaxa('');
            Keyboard.dismiss();
            Alert.alert("Sucesso", "Lojista adicionado com sucesso!");
        } catch (error) {
            Alert.alert("Erro", "Falha ao adicionar lojista.");
        }
    };

    const abrirEdicao = (logista) => {
        setSelectedLogista(logista);
        setEditNome(logista.nome || '');
        setEditTaxa(String(logista.taxaEntrega || '0'));
        setModalVisible(true);
    };

    const salvarEdicao = async () => {
        if (!selectedLogista) return;
        try {
            const docRef = doc(db, 'restaurants', selectedLogista.id);
            await updateDoc(docRef, {
                nome: editNome,
                taxaEntrega: parseFloat(editTaxa.replace(',', '.')) || 0
            });
            setModalVisible(false);
            Alert.alert("Sucesso", "Dados atualizados!");
        } catch (error) {
            Alert.alert("Erro", "Falha ao atualizar.");
        }
    };

    const excluirLogista = (id) => {
        Alert.alert("Excluir", "Deseja remover este lojista?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: async () => await deleteDoc(doc(db, 'restaurants', id)) }
        ]);
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
            {/* FORMULÁRIO DE ADICIONAR */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Novo Lojista</Text>
                <TextInput style={styles.input} placeholder="Nome da Loja" value={novoNome} onChangeText={setNovoNome} />
                <TextInput style={styles.input} placeholder="E-mail do Lojista" value={novoEmail} onChangeText={setNovoEmail} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Taxa de Entrega (R$)" value={novaTaxa} onChangeText={setNovaTaxa} keyboardType="numeric" />
                <TouchableOpacity style={styles.btnAdd} onPress={adicionarLogista}>
                    <Text style={styles.btnText}>ADICIONAR LOJA</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.listHeader}>Lojistas Cadastrados</Text>

            <FlatList
                data={logistas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => abrirEdicao(item)}>
                        <View style={styles.info}>
                            <Text style={styles.nomeLoja}>{item.nome || "Sem Nome"}</Text>
                            <Text style={styles.emailText}>{item.email || "Sem e-mail"}</Text>
                            <View style={styles.badgeTaxa}>
                                <Text style={styles.taxaText}>Taxa: R$ {Number(item.taxaEntrega || 0).toFixed(2)}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => excluirLogista(item.id)} style={styles.deleteBtn}>
                            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<View style={styles.center}><Text style={styles.emptyText}>Nenhuma loja encontrada.</Text></View>}
            />

            {/* MODAL DE EDIÇÃO */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Lojista</Text>
                        <Text style={styles.label}>Nome da Loja:</Text>
                        <TextInput style={styles.input} value={editNome} onChangeText={setEditNome} />
                        <Text style={styles.label}>Taxa de Entrega (R$):</Text>
                        <TextInput style={styles.input} value={editTaxa} onChangeText={setEditTaxa} keyboardType="numeric" />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={salvarEdicao}>
                                <Text style={styles.btnText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    formContainer: { backgroundColor: '#FFF', padding: 15, borderBottomWidth: 1, borderColor: '#DDD' },
    formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    listHeader: { fontSize: 16, fontWeight: 'bold', margin: 15, color: '#666' },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginBottom: 10, backgroundColor: '#FAFAFA' },
    btnAdd: { backgroundColor: '#28A745', padding: 12, borderRadius: 8, alignItems: 'center' },
    list: { paddingHorizontal: 15, paddingBottom: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 2 },
    info: { flex: 1 },
    nomeLoja: { fontSize: 17, fontWeight: 'bold', color: '#000' },
    emailText: { fontSize: 14, color: '#666' },
    badgeTaxa: { backgroundColor: '#E8F5E9', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 5 },
    taxaText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
    deleteBtn: { padding: 10 },
    emptyText: { color: '#999', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    label: { fontWeight: 'bold', marginBottom: 5, color: '#555' },
    modalButtons: { flexDirection: 'row', marginTop: 10 },
    btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    btnCancel: { backgroundColor: '#999' },
    btnSave: { backgroundColor: '#FF5733' },
    btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default AdminLogistaManager;