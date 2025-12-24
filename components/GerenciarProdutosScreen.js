import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const GerenciarProdutosScreen = () => {
    const { user } = useAuth();
    
    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    // Estados de Controle
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    // --- FILTRO DE SEGURANÇA COM TRAVA DE LOGOUT ---
    useEffect(() => {
        // Se o usuário deslogar, o 'user' vira null. Essa trava impede o crash.
        if (!user || !user.uid) {
            setProdutos([]); // Limpa a lista ao sair
            return;
        }

        const q = query(
            collection(db, 'products'), 
            where('restaurantId', '==', user.uid)
        );

        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setProdutos(list);
        }, (error) => {
            console.error("Erro ao carregar cardápio:", error);
        });

        return () => unsub();
    }, [user?.uid]); // Monitora especificamente o UID

    const handleSave = async () => {
        if (!user?.uid) return; // Segurança extra
        if (!nome || !preco) {
            Alert.alert("Erro", "Nome e Preço são obrigatórios.");
            return;
        }

        setLoading(true);
        const dadosProduto = {
            nome: nome,
            preco: parseFloat(preco.replace(',', '.')),
            descricao: descricao,
            imageUrl: imageUrl || 'https://via.placeholder.com/150',
            restaurantId: user.uid,
            updatedAt: serverTimestamp()
        };

        try {
            if (editId) {
                await updateDoc(doc(db, 'products', editId), dadosProduto);
                Alert.alert("Sucesso", "Produto atualizado!");
            } else {
                await addDoc(collection(db, 'products'), { 
                    ...dadosProduto, 
                    createdAt: serverTimestamp() 
                });
                Alert.alert("Sucesso", "Produto criado!");
            }
            limparFormulario();
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    const limparFormulario = () => {
        setEditId(null); setNome(''); setPreco(''); setDescricao(''); setImageUrl('');
    };

    const prepararEdicao = (item) => {
        setEditId(item.id);
        setNome(item.nome);
        setPreco(item.preco.toString());
        setDescricao(item.descricao || '');
        setImageUrl(item.imageUrl || '');
    };

    const handleDelete = (id) => {
        Alert.alert("Excluir", "Deseja remover este item?", [
            { text: "Não" },
            { text: "Sim", onPress: async () => await deleteDoc(doc(db, 'products', id)) }
        ]);
    };

    // Se o usuário sumir (Logout), não renderiza nada para evitar erros de interface
    if (!user) return null;

    return (
        <View style={styles.container}>
            <FlatList 
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>{editId ? "✏️ Editando Produto" : "➕ Novo Produto"}</Text>
                        
                        <TextInput style={styles.input} placeholder="Nome do produto" placeholderTextColor="#495057" value={nome} onChangeText={setNome} />
                        <TextInput style={styles.input} placeholder="Preço (ex: 29.90)" placeholderTextColor="#495057" value={preco} onChangeText={setPreco} keyboardType="numeric" />
                        <TextInput style={styles.input} placeholder="Link da Imagem (URL)" placeholderTextColor="#495057" value={imageUrl} onChangeText={setImageUrl} />
                        <TextInput style={[styles.input, {height: 60}]} placeholder="Descrição" placeholderTextColor="#495057" value={descricao} onChangeText={setDescricao} multiline />
                        
                        <TouchableOpacity 
                            style={[styles.btn, { backgroundColor: editId ? '#007AFF' : '#28A745' }]} 
                            onPress={handleSave} 
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{editId ? "ATUALIZAR" : "SALVAR"}</Text>}
                        </TouchableOpacity>

                        {editId && (
                            <TouchableOpacity style={styles.btnCancel} onPress={limparFormulario}>
                                <Text style={styles.btnCancelText}>CANCELAR</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.listTitle}>Meu Cardápio:</Text>
                    </View>
                }
                data={produtos}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.productItem} onPress={() => prepararEdicao(item)}>
                        <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }} style={styles.productImage} />
                        <View style={{flex: 1, marginLeft: 10}}>
                            <Text style={styles.productName}>{item.nome}</Text>
                            <Text style={styles.productPrice}>R$ {Number(item.preco).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{padding: 5}}>
                            <Ionicons name="trash-outline" size={24} color="#D00000" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E9ECEF' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#DDD' },
    title: { fontSize: 20, fontWeight: '900', marginBottom: 15, color: '#000' },
    listTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#000' },
    input: { backgroundColor: '#FFF', color: '#000', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 2, borderColor: '#ADB5BD', fontSize: 16, fontWeight: 'bold' },
    btn: { padding: 15, borderRadius: 8, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
    btnCancel: { marginTop: 10, padding: 10, alignItems: 'center' },
    btnCancelText: { color: '#FF3B30', fontWeight: 'bold' },
    productItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginHorizontal: 15, marginBottom: 10, borderRadius: 12, alignItems: 'center', elevation: 3 },
    productImage: { width: 50, height: 50, borderRadius: 8 },
    productName: { fontSize: 16, fontWeight: '900', color: '#000' },
    productPrice: { fontSize: 15, color: '#28A745', fontWeight: '700' }
});

export default GerenciarProdutosScreen;