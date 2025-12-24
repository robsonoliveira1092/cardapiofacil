import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebaseConfig';
import { 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função de Login Centralizada
    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        return signInWithEmailAndPassword(auth, cleanEmail, password);
    };

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                console.log("-----------------------------------------");
                console.log("📍 AUTH: UID identificado:", firebaseUser.uid);

                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        
                        // GARANTIA: Forçamos o level a ser um número para evitar conflitos de tipo
                        const userLevel = userData.level !== undefined ? Number(userData.level) : undefined;
                        
                        console.log("✅ FIRESTORE: Dados carregados. Level tratado:", userLevel);
                        
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userData,
                            level: userLevel // Sobrescreve com o valor garantido como número
                        });
                    } else {
                        console.error("⚠️ AVISO: Documento não existe em 'users' para este UID.");
                        setUser({ uid: firebaseUser.uid, level: undefined });
                    }
                } catch (error) {
                    console.error("❌ ERRO ao buscar Firestore:", error.message);
                    setUser(null);
                }
            } else {
                console.log("📍 AUTH: Nenhum usuário logado.");
                setUser(null);
            }
            setLoading(false);
            console.log("-----------------------------------------");
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {/* O app só carrega após a checagem do Firebase estar concluída */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);