import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeContext'; 

const MenuItem = ({ nome, precoBase, descricao, imagemUrl, onSelect }) => {
  // Puxa as cores do tema
  const { colors } = useTheme(); 

  // CRÍTICO: O componente TouchableOpacity envolve todo o item
  return (
    <TouchableOpacity style={styles(colors).container} onPress={onSelect}> 
      <View style={styles(colors).textContainer}>
        <Text style={styles(colors).nome}>{nome}</Text>
        <Text style={styles(colors).descricao}>{descricao}</Text>
        {/* Preço usa a cor ACCENT */}
        <Text style={styles(colors).preco}>R$ {precoBase.toFixed(2).replace('.', ',')}</Text>
      </View>
      {imagemUrl && (
        <Image 
            source={{ uri: imagemUrl }} 
            style={styles(colors).image} 
            resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );
};

// Modificamos a forma como os estilos são criados: agora é uma função que recebe as cores
const styles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.BACKGROUND_DARK,
    borderRadius: 10,
    padding: 15,
    marginVertical: 7,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textContainer: { flex: 1, paddingRight: 10 },
  nome: { fontSize: 18, fontWeight: 'bold', color: colors.TEXT_DARK, marginBottom: 5 },
  descricao: { fontSize: 14, color: colors.TEXT_MUTED, marginBottom: 5 }, // Corrigido para TEXT_MUTED
  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.ACCENT, // COR DINÂMICA
    marginTop: 'auto',
  },
  image: {
    width: 90, 
    height: 90, 
    borderRadius: 8,
    marginLeft: 10, 
  }
});

export default MenuItem;