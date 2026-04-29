// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ============================================
// 🇩🇪 CONFIGURACIÓN DE FIREBASE
// REEMPLAZA CON TUS DATOS DE FIREBASE CONSOLE
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyDFi3rGUfxytvDwMtAjj3Xw4Lumrtjz-XA",
  authDomain: "restaurante-cf08b.firebaseapp.com",
  projectId: "restaurante-cf08b",
  storageBucket: "restaurante-cf08b.firebasestorage.app",
  messagingSenderId: "588547473180",
  appId: "1:588547473180:web:1ecabff994cdfa9cc5c4d9",
  measurementId: "G-1ZHNYZT8CS"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🍺 Firebase inicializado - Biergarten München 🍺");