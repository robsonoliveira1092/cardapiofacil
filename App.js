import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { CartProvider } from './context/CartContext'; 
import { ThemeProvider } from './theme/ThemeContext'; // Importação do seu Tema
import { View, ActivityIndicator } from 'react-native';

import AdminNavigator from './navigation/AdminNavigator'; 
import AuthNavigator from './navigation/AuthNavigator'; 

const RootContent = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color="#FF5733" />
            </View>
        );
    }

    return user ? <AdminNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> {/* O Tema deve envolver o RootContent */}
        <CartProvider>
          <NavigationContainer>
            <RootContent />
          </NavigationContainer>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}