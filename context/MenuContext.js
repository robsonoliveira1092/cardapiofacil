import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        if (user?.uid && user?.level === 2) {
            setLoadingProducts(true);
            // FILTRO: Apenas produtos onde o restaurantId é igual ao UID do Lojista logado
            const q = query(
                collection(db, "products"), 
                where("restaurantId", "==", user.uid)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(items);
                setLoadingProducts(false);
            });

            return () => unsubscribe();
        }
    }, [user]);

    return (
        <MenuContext.Provider value={{ products, loadingProducts }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => useContext(MenuContext);