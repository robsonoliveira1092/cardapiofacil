import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig'; 

const UserManagementScreen = () => {
    const { userLevel } = useAuth();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userLevel !== 0) { setIsLoading(false); return; }
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, 'users'), where('level', '==', 2));
                const snap = await getDocs(q);
                setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } finally { setIsLoading(false); }
        };
        fetchUsers();
    }, [userLevel]);

    if (userLevel !== 0) return null;

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {isLoading ? <ActivityIndicator /> : 
                <FlatList data={users} renderItem={({ item }) => <Text>{item.email}</Text>} />
            }
        </View>
    );
};

export default UserManagementScreen;