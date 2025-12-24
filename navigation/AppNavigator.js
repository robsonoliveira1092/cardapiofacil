import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Importações (Certifique-se de que os nomes dos arquivos estão corretos)
import LoginScreen from './LoginScreen'; 
import AdminLogistaManager from './AdminLogistaManager';
import RestaurantListScreen from './RestaurantListScreen';
import CardapioHome from './CardapioHome'; 

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useAuth();

    // 1. Enquanto o Firebase está buscando os dados
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    // 2. Se NÃO está logado, mostra apenas o Login
    if (!user) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        );
    }

    // 3. Se ESTÁ logado, decide qual STACK mostrar baseado no level
    // Usamos o 'key' para forçar o React Navigation a resetar quando o level mudar
    return (
        <Stack.Navigator key={user.level} screenOptions={{ headerShown: true }}>
            {user.level == 0 ? (
                <Stack.Screen name="AdminHome" component={AdminLogistaManager} options={{ title: 'Painel Admin' }} />
            ) : user.level == 1 ? (
                <>
                    <Stack.Screen name="Marketplace" component={RestaurantListScreen} options={{ title: 'Lojas' }} />
                    <Stack.Screen name="CardapioHome" component={CardapioHome} options={{ title: 'Cardápio' }} />
                </>
            ) : user.level == 2 ? (
                <Stack.Screen name="LogistaHome" component={CardapioHome} options={{ title: 'Minha Loja' }} />
            ) : (
                <Stack.Screen name="Aguardando" component={WaitingScreen} />
            )}
        </Stack.Navigator>
    );
};

// Componente simples de fallback
const WaitingScreen = () => (
    <View style={styles.center}>
        <Text style={styles.title}>Perfil Carregado</Text>
        <Text>Aguardando definição de rota para o nível: 0</Text>
    </View>
);

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold' }
});

export default AppNavigator;