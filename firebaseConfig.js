import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    initializeAuth, 
    getReactNativePersistence, 
    getAuth 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB48YgoxULMdWQmE6RctF0eO5f_mirWl-w",
    authDomain: "cardapioapp-2025.firebaseapp.com",
    projectId: "cardapioapp-2025",
    storageBucket: "cardapioapp-2025.firebasestorage.app",
    messagingSenderId: "1074347445712",
    appId: "1:1074347445712:web:0d588b1f39afcba70a7dd5",
    measurementId: "G-8XZESX186H"
};

// 1. Inicializa o App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializa o Auth EXATAMENTE como o log pede, prevenindo duplicidade
let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} catch (e) {
    auth = getAuth(app); // Se já estiver inicializado, apenas recupera
}

const db = getFirestore(app);

// Instância Secundária (Para criação de lojistas pelo Admin)
const secondaryApp = getApps().find(a => a.name === "Secondary") 
    ? getApp("Secondary") 
    : initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export { auth, db, secondaryAuth };
export default app;