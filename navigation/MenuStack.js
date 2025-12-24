import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RestaurantListScreen from '../components/RestaurantListScreen';
import HomeScreen from '../components/HomeScreen';
import ProductDetailsScreen from '../components/ProductDetailsScreen';

const Stack = createStackNavigator();

const MenuStack = () => {
    return (
        <Stack.Navigator initialRouteName="ListaRestaurantes">
            <Stack.Screen 
                name="ListaRestaurantes" 
                component={RestaurantListScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="CardapioHome" 
                component={HomeScreen} 
                options={{ title: 'Cardápio' }} 
            />
            <Stack.Screen 
                name="ProductDetails" 
                component={ProductDetailsScreen} 
                options={{ title: 'Detalhes do Produto' }} 
            />
        </Stack.Navigator>
    );
};

export default MenuStack;