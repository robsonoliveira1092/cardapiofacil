import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importe as suas telas de login e a nova de cadastro
import LoginScreen from '../components/LoginScreen'; 
import SignUpScreen from '../components/SignUpScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Primeira tela que aparece é o Login */}
      <Stack.Screen name="Login" component={LoginScreen} />
      
      {/* Tela de Cadastro que criamos antes */}
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;