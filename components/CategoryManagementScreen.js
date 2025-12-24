import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useMenu } from '../context/MenuContext';
import { useTheme } from '../theme/ThemeContext';

const CategoryManagementScreen = () => {
    const { categories, isLoading } = useMenu();
    const { colors } = useTheme();

    const renderCategory = ({ item }) => (
        <View style={[styles.card, { backgroundColor: colors.BACKGROUND_DARK }]}>
            <Text style={[styles.categoryText, { color: colors.TEXT_DARK }]}>{item}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.PRIMARY} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND_LIGHT }]}>
            <Text style={[styles.title, { color: colors.PRIMARY }]}>Categorias</Text>
            <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCategory}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={{ color: colors.TEXT_MUTED, textAlign: 'center' }}>Nenhuma categoria cadastrada.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
    listContent: { paddingHorizontal: 20 },
    card: { padding: 18, borderRadius: 10, marginBottom: 10 },
    categoryText: { fontSize: 16, fontWeight: '600' }
});

export default CategoryManagementScreen;