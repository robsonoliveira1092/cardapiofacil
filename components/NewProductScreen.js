// C:\...\cardapio-app - Copia\components\NewProductScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useMenu } from '../context/MenuContext'; 
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext'; 
import { Ionicons } from '@expo/vector-icons';

const NewProductScreen = ({ navigation }) => {
    // Obtém funções e dados
    const { categories, addProduct } = useMenu(); 
    const { colors } = useTheme();
    
    // CRÍTICO: Obtém o restaurantId e o estado de carregamento do AuthContext
    const { restaurantId, isLoading: authLoading } = useAuth(); 

    const [nome, setNome] = useState('');
    const [precoBase, setPrecoBase] = useState('');
    // Garante que a categoria inicial seja definida, se houver categorias
    const [categoria, setCategoria] = useState(categories.length > 0 ? categories[0] : ''); 
    const [novaCategoria, setNovaCategoria] = useState(''); 
    const [descricao, setDescricao] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false); 


    const handleSave = async () => {
        // A checagem mais robusta para garantir que a permissão e o ID estejam prontos
        if (authLoading || !restaurantId) { 
             Alert.alert("Carregando", "ID do restaurante não sincronizado. Aguarde e tente novamente.");
             return; 
        }
        
        if (isSaving || !nome || !precoBase || (!categoria && !novaCategoria)) {
            Alert.alert("Aviso", "Preencha todos os campos obrigatórios.");
            return;
        }

        setIsSaving(true);
        
        const finalCategory = novaCategoria.trim() || categoria;
        
        const newProduct = {
            nome: nome.trim(),
            precoBase: parseFloat(precoBase.replace(',', '.')),
            categoria: finalCategory.trim(),
            descricao: descricao.trim(),
            imagemUrl: imagemUrl.trim(),
        };

        try {
            // Chama a função addProduct do MenuContext, que já injeta o restaurantId
            const success = await addProduct(newProduct); 

            if (success) {
                Alert.alert("Sucesso", "Produto adicionado ao cardápio!"); 
                navigation.goBack();
            } 
        } catch (error) {
             console.error("Erro ao salvar produto:", error);
             Alert.alert("Erro", "Falha crítica ao salvar o produto.");
        } finally {
            setIsSaving(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.BACKGROUND_LIGHT, padding: 20 },
        title: { fontSize: 24, fontWeight: 'bold', color: colors.PRIMARY, marginBottom: 20 },
        input: { 
            backgroundColor: colors.BACKGROUND_DARK, 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 15, 
            color: colors.TEXT_DARK 
        },
        saveButton: {
            backgroundColor: colors.SUCCESS,
            padding: 15,
            borderRadius: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            opacity: (authLoading || !restaurantId || isSaving) ? 0.6 : 1, 
        },
        saveButtonText: { color: colors.TEXT_LIGHT, fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
    });
    
    // ----------------------------------------------------
    // CONDIÇÕES DE RENDERIZAÇÃO DE ESTADO
    // ----------------------------------------------------
    
    if (authLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.PRIMARY} />
                <Text style={{color: colors.TEXT_MUTED, marginTop: 10}}>Carregando permissões do restaurante...</Text>
            </View>
        );
    }
    
    // MENSAGEM DE ERRO (Apenas se o carregamento terminou e o ID é nulo)
    if (!restaurantId) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="alert-circle-outline" size={40} color={colors.DANGER} />
                <Text style={{color: colors.TEXT_DARK, marginTop: 10, textAlign: 'center'}}>
                    ERRO: ID do restaurante não encontrado.
                </Text>
                <Text style={{color: colors.TEXT_DARK, textAlign: 'center'}}>
                    Verifique sua conta no Firestore ou faça login novamente.
                </Text>
            </View>
        );
    }
    
    // FORMULÁRIO COMPLETO
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Adicionar Novo Produto</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                value={nome}
                onChangeText={setNome}
                editable={!isSaving}
            />
            <TextInput
                style={styles.input}
                placeholder="Preço Base (Ex: 19.90)"
                keyboardType="numeric"
                value={precoBase}
                onChangeText={setPrecoBase}
                editable={!isSaving}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição (Opcional)"
                multiline
                numberOfLines={4}
                value={descricao}
                onChangeText={setDescricao}
                editable={!isSaving}
            />
            <TextInput
                style={styles.input}
                placeholder="URL da Imagem (Opcional)"
                value={imagemUrl}
                onChangeText={setImagemUrl}
                editable={!isSaving}
            />

            <Text style={{color: colors.TEXT_DARK, marginBottom: 5}}>Categoria Atual:</Text>
            <TextInput
                style={styles.input}
                placeholder="Ou digite Nova Categoria"
                value={novaCategoria || categoria}
                onChangeText={setNovaCategoria}
                onFocus={() => setCategoria('')}
                editable={!isSaving}
            />

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={isSaving} 
            >
                {isSaving ? (
                    <ActivityIndicator size="small" color={colors.TEXT_LIGHT} />
                ) : (
                    <>
                        <Ionicons name="add-circle-outline" size={24} color={colors.TEXT_LIGHT} />
                        <Text style={styles.saveButtonText}>Adicionar Produto</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default NewProductScreen;