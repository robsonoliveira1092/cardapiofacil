import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext'; 

const CartIcon = () => {
  const { cartCount } = useCart();

  if (cartCount === 0) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cart-outline" size={28} color="#FFFFFF" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{cartCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5, 
    backgroundColor: '#32CD32', 
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartIcon;