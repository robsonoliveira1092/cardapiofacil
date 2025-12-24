import React, { useState } from 'react';
import { 
    View, Text, TextInput, StyleSheet, TouchableOpacity, 
    ScrollView, Alert, Image, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

const EditProductScreen = ({ route, navigation }) => {
    const { product, isNew } = route.params || {};
    const { restaurantId } = useAuth();
    const { colors } = useTheme();

    const [nome, setNome] = useState(product?.nome || '');
    const [preco, setPreco] = useState(product?.precoBase?.toString() || '');
    const [categoria, setCategoria] = useState(product?.categoria || '');
    const [imagemUrl, setImagemUrl] = useState(product?.imagemUrl || '');
    const [descricao, setDescricao] = useState(product?.descricao || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!nome || !preco || !categoria) {
            Alert.alert("Erro", "Preencha Nome, Preço e Categoria.");
            return;
        }
        setIsSaving(true);
        try {
            const productsRef = collection(db, 'restaurants', restaurantId, 'products');
            const dados = {
                nome: nome.trim(),
                precoBase: parseFloat(preco.replace(',', '.')),
                categoria: categoria.trim(),
                imagemUrl: imagemUrl.trim(),
                descricao: descricao.trim(),
                updatedAt: serverTimestamp(),
            };

            if (isNew) {
                await addDoc(productsRef, { ...dados, createdAt: serverTimestamp() });
            } else {
                await updateDoc(doc(db, 'restaurants', restaurantId, 'products', product.id), dados);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar produto.");
        } finally { setIsSaving(false); }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1 }}
        >
            <ScrollView style={[styles.container, { backgroundColor: colors.BACKGROUND_LIGHT || '#FFF' }]}>
                <View style={styles.form}>
                    <Text style={styles.label}>Prévia do Produto</Text>
                    <View style={styles.previewContainer}>
                        <Image 
                            source={{ uri: imagemUrl || 'https://via.placeholder.com/150?text=Sem+Imagem' }} 
                            style={styles.previewImage}
                        />
                    </View>

                    <Text style={styles.label}>URL da Imagem</Text>
                    <TextInput 
                        style={styles.input} 
                        value={imagemUrl} 
                        onChangeText={setImagemUrl} 
                        placeholder="Link da imagem"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Nome do Produto *</Text>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Pizza" />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>Preço *</Text>
                            <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" placeholder="0.00" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Categoria *</Text>
                            <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex: Bebidas" />
                        </View>
                    </View>

                    <Text style={styles.label}>Descrição Detalhada</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={descricao} 
                        onChangeText={setDescricao} 
                        placeholder="Ingredientes e detalhes..."
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: colors.PRIMARY || '#FF5733' }]} 
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>{isNew ? "Criar Produto" : "Salvar Alterações"}</Text>
                        )}
                    </TouchableOpacity>
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' },
    previewContainer: { alignItems: 'center', marginBottom: 15, backgroundColor: '#eee', borderRadius: 12, overflow: 'hidden', height: 180 },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', color: '#333' },
    textArea: { height: 100, paddingTop: 12 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default EditProductScreen;