import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho se necessário

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }

        setLoading(true);
        try {
            // .trim() remove espaços e .toLowerCase() evita erro com letras maiúsculas
            const cleanEmail = email.trim().toLowerCase();
            await login(cleanEmail, password);
            
            // Se o login for sucesso, o AuthContext mudará o estado do usuário
            // e o AppNavigator te levará automaticamente para a tela correta.
        } catch (error) {
            console.log("Código do erro:", error.code);
            
            let message = "E-mail ou senha incorretos.";
            
            if (error.code === 'auth/user-not-found') {
                message = "Este e-mail não está cadastrado.";
            } else if (error.code === 'auth/wrong-password') {
                message = "Senha incorreta.";
            } else if (error.code === 'auth/invalid-credential') {
                message = "Credenciais inválidas. Verifique os dados.";
            } else if (error.code === 'auth/too-many-requests') {
                message = "Muitas tentativas falhas. Tente novamente mais tarde.";
            }

            Alert.alert("Falha no Login", message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cardápio App</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="E-mail" 
                value={email} 
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <TextInput 
                style={styles.input} 
                placeholder="Senha" 
                value={password} 
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>ENTRAR</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#FFF' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#FF5733' },
    input: { backgroundColor: '#F9F9F9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
    button: { backgroundColor: '#FF5733', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;