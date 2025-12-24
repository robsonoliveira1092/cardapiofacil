import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (docSnap.exists()) {
                    setUser({ uid: firebaseUser.uid, ...docSnap.data() });
                } else {
                    const resSnap = await getDoc(doc(doc(db, 'restaurants', firebaseUser.uid).path === firebaseUser.uid ? db : db, 'restaurants', firebaseUser.uid));
                    setUser(resSnap.exists() ? { uid: firebaseUser.uid, ...resSnap.data() } : { uid: firebaseUser.uid, level: 1 });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
