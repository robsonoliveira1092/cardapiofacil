import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';

// Importações das Telas
import UserProfileScreen from '../components/UserProfileScreen'; 
import ThemeSettingsScreen from '../components/ThemeSettingsScreen';
import AdminLogistaManager from '../components/AdminLogistaManager';
import GerenciarProdutosScreen from '../components/GerenciarProdutosScreen'; 
import RestaurantListScreen from '../components/RestaurantListScreen';
import CardapioHome from '../components/CardapioHome'; 
import CartScreen from '../components/CartScreen'; 

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
    const { user, logout } = useAuth();
    
    // Trava de segurança inicial
    if (!user) return null;

    // Convertemos para número e garantimos que não seja undefined
    const level = typeof user.level !== 'undefined' ? Number(user.level) : null;

    const LogoutButton = () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
            <Ionicons name="log-out-outline" size={26} color="red" />
        </TouchableOpacity>
    );

    return (
        <Tab.Navigator
            key={`nav-level-${level}`}
            screenOptions={{
                tabBarActiveTintColor: '#FF5733', 
                tabBarInactiveTintColor: '#000', 
                headerShown: true,
                headerRight: () => <LogoutButton />, 
                tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
                tabBarStyle: { height: 70, paddingBottom: 10 }
            }}
        >
            {/* RENDERIZAÇÃO BASEADA EM FUNÇÃO PARA EVITAR STRINGS SOLTAS */}
            {(() => {
                switch (level) {
                    case 0: // ADMIN MASTER
                        return (
                            <Tab.Screen 
                                name="GerenciarLojas" 
                                component={AdminLogistaManager} 
                                options={{ 
                                    title: 'Painel Admin', 
                                    tabBarLabel: 'Lojistas', 
                                    tabBarIcon: ({ color }) => <Ionicons name="shield-checkmark" size={26} color={color} /> 
                                }} 
                            />
                        );
                    case 1: // CLIENTE
                        return (
                            <>
                                <Tab.Screen name="Marketplace" component={RestaurantListScreen} options={{ title: 'Restaurantes', tabBarLabel: 'Início', tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={26} color={color} /> }} />
                                <Tab.Screen name="CardapioHome" component={CardapioHome} options={{ tabBarButton: () => null, title: 'Cardápio' }} />
                                <Tab.Screen name="CartScreen" component={CartScreen} options={{ tabBarButton: () => null, title: 'Carrinho' }} />
                            </>
                        );
                    case 2: // LOJISTA
                        return (
                            <>
                                <Tab.Screen name="GerenciarCardapio" component={GerenciarProdutosScreen} options={{ title: 'Produtos', tabBarLabel: 'Produtos', tabBarIcon: ({ color }) => <Ionicons name="list" size={26} color={color} /> }} />
                                <Tab.Screen name="ConfiguracoesLoja" component={ThemeSettingsScreen} options={{ title: 'Configurar Loja', tabBarLabel: 'Loja', tabBarIcon: ({ color }) => <Ionicons name="storefront" size={26} color={color} /> }} />
                            </>
                        );
                    default:
                        return null;
                }
            })()}

            <Tab.Screen 
                name="Perfil" 
                component={UserProfileScreen} 
                options={{ 
                    title: 'Meu Perfil', 
                    tabBarLabel: 'Perfil', 
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} /> 
                }} 
            />
        </Tab.Navigator>
    );
};

export default AdminNavigator;