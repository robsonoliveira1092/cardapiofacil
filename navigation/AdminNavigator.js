import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { TouchableOpacity } from 'react-native';

import UserProfileScreen from '../components/UserProfileScreen'; 
import AdminLogistaManager from '../components/AdminLogistaManager';
import RestaurantListScreen from '../components/RestaurantListScreen';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
    const { user, logout } = useAuth();
    if (!user) return null;
    
    // Convertendo para número para evitar erros de tipagem
    const level = Number(user.level);

    return (
        <Tab.Navigator screenOptions={{ 
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Ionicons name="log-out-outline" size={26} color="red" />
                </TouchableOpacity>
            )
        }}>
            {/* Usando ternário para evitar renderização de '0' ou espaços vazios */}
            {level === 0 ? (
                <Tab.Screen 
                    name="Admin" 
                    component={AdminLogistaManager} 
                    options={{ title: 'Painel Master', tabBarLabel: 'Lojistas' }} 
                />
            ) : (
                <Tab.Screen 
                    name="Home" 
                    component={RestaurantListScreen} 
                    options={{ title: 'Início' }} 
                />
            )}
            <Tab.Screen name="Perfil" component={UserProfileScreen} />
        </Tab.Navigator>
    );
}
