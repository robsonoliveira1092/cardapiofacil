import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
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
      <NavigationContainer>
        <RootContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
