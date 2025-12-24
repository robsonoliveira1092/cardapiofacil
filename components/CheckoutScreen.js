import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
// IMPORTAMOS useCart e useNavigation
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

// OBRIGATÓRIO: Esta função é necessária para exibir o total no header do Stack Navigator
// O Stack Navigator chama esta função para obter as opções de cabeçalho
export const getCheckoutScreenOptions = ({ route }) => {
    const total = route.params?.total; // Puxa o total passado via rota
    
    return {
        title: 'Finalizar Pedido',
        headerRight: () => (
            <View style={{ marginRight: 10 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                    Total: R$ {total ? total.toFixed(2).replace('.', ',') : '0,00'}
                </Text>
            </View>
        ),
    };
};

const CheckoutScreen = ({ route, navigation }) => {
  // Puxa as funções do Contexto de Carrinho
  const { cartItems, cartCount, clearCart } = useCart();
  
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');

  const { total, subtotal, deliveryFee } = useCart();

  const handleFinishOrder = () => {
    if (!deliveryAddress || deliveryAddress.length < 5) {
      Alert.alert("Erro", "Por favor, preencha um endereço de entrega válido.");
      return;
    }
    
    Alert.alert(
      "Pedido Finalizado!",
      `Total: R$ ${total.toFixed(2).replace('.', ',')}\nMétodo: ${paymentMethod}\nSeu pedido será entregue em breve!`,
      [
        { text: "Ver Cardápio", onPress: () => {
            clearCart(); // Limpa o carrinho
            navigation.popToTop(); // Volta para a tela principal
        }},
      ]
    );
  };
  
  // Lista de itens no checkout (simples)
  const renderItem = (item) => (
    <View key={item.cartId} style={styles.itemRow}>
        <Text style={styles.itemTitle}>{item.nome}</Text>
        <Text style={styles.itemDetails}>R$ {item.finalPrice.toFixed(2).replace('.', ',')}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      
      {/* 1. Detalhes do Pedido */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seu Pedido ({cartCount} Itens)</Text>
        {cartItems.map(renderItem)}
      </View>
      
      {/* 2. Endereço de Entrega */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Endereço de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Rua da Paz, 123, Apto 505"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
        />
      </View>
      
      {/* 3. Método de Pagamento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Escolha o Pagamento</Text>
        {['Pix', 'Cartão de Crédito/Débito', 'Dinheiro (Troco)'].map(method => (
          <TouchableOpacity
            key={method}
            style={[styles.paymentButton, paymentMethod === method && styles.paymentSelected]}
            onPress={() => setPaymentMethod(method)}
          >
            <Ionicons 
              name={paymentMethod === method ? 'radio-button-on' : 'radio-button-off'} 
              size={20} 
              color={paymentMethod === method ? '#FF6347' : '#999'} 
            />
            <Text style={styles.paymentText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Resumo Final e Botão de Ação */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Entrega</Text>
          <Text style={styles.summaryValue}>R$ {deliveryFee.toFixed(2).replace('.', ',')}</Text>
        </View>
        
        <View style={styles.summaryTotalRow}>
          <Text style={styles.summaryLabelTotal}>Total</Text>
          <Text style={styles.summaryValueTotal}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </View>

        <TouchableOpacity 
          style={styles.finishButton} 
          onPress={handleFinishOrder}
        >
          <Text style={styles.finishButtonText}>Pagar e Enviar Pedido</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
};
// ATENÇÃO: É necessário exportar a função de opções para o App.js
CheckoutScreen.options = getCheckoutScreenOptions;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
  section: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', borderBottomWidth: 1, borderBottomColor: '#EDEDED', paddingBottom: 5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  itemTitle: { fontSize: 15, color: '#666', flex: 1 },
  itemDetails: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, fontSize: 16 },
  paymentButton: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, marginBottom: 8 },
  paymentSelected: { borderColor: '#FF6347', backgroundColor: '#FFF0F0' },
  paymentText: { marginLeft: 10, fontSize: 16, fontWeight: '500' },
  summaryContainer: { padding: 15, backgroundColor: '#FFFFFF', borderRadius: 10, marginBottom: 15, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { fontSize: 16, color: '#666' },
  summaryValue: { fontSize: 16, fontWeight: '600' },
  summaryTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 10 },
  summaryLabelTotal: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  summaryValueTotal: { fontSize: 20, fontWeight: 'bold', color: '#FF6347' },
  finishButton: { marginTop: 20, padding: 15, backgroundColor: '#32CD32', borderRadius: 8, alignItems: 'center' },
  finishButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});

export default CheckoutScreen;