import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================
// REGISTRO DE USUARIO
// ============================================

export async function registerUser(email, password, nombre, telefono) {
    try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Actualizar perfil con nombre
        await updateProfile(user, { displayName: nombre });
        
        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            nombre: nombre,
            email: email,
            telefono: telefono,
            fechaRegistro: new Date().toISOString(),
            rol: "cliente",
            reservaciones: []
        });
        
        console.log("✅ Usuario registrado exitosamente");
        return { success: true, user };
    } catch (error) {
        console.error("Error en registro:", error);
        let mensaje = "Error al registrarse";
        if (error.code === 'auth/email-already-in-use') {
            mensaje = "Este correo ya está registrado";
        } else if (error.code === 'auth/weak-password') {
            mensaje = "La contraseña debe tener al menos 6 caracteres";
        } else if (error.code === 'auth/invalid-email') {
            mensaje = "Correo electrónico inválido";
        }
        return { success: false, error: mensaje };
    }
}

// ============================================
// INICIO DE SESIÓN
// ============================================

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Inicio de sesión exitoso");
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("Error en login:", error);
        let mensaje = "Error al iniciar sesión";
        if (error.code === 'auth/user-not-found') {
            mensaje = "Usuario no encontrado";
        } else if (error.code === 'auth/wrong-password') {
            mensaje = "Contraseña incorrecta";
        } else if (error.code === 'auth/invalid-email') {
            mensaje = "Correo electrónico inválido";
        } else if (error.code === 'auth/too-many-requests') {
            mensaje = "Demasiados intentos. Intenta más tarde";
        }
        return { success: false, error: mensaje };
    }
}

// ============================================
// CERRAR SESIÓN
// ============================================

export async function logoutUser() {
    try {
        await signOut(auth);
        console.log("✅ Sesión cerrada");
        window.location.href = '../index.html';
        return { success: true };
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return { success: false, error: error.message };
    }
}

// ============================================
// OBTENER DATOS DEL USUARIO
// ============================================

export async function getUserData(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error("Error obteniendo datos:", error);
        return { success: false, error: error.message };
    }
}

// ============================================
// ACTUALIZAR DATOS DEL USUARIO
// ============================================

export async function updateUserData(uid, data) {
    try {
        await updateDoc(doc(db, "users", uid), data);
        return { success: true };
    } catch (error) {
        console.error("Error actualizando datos:", error);
        return { success: false, error: error.message };
    }
}

// ============================================
// VERIFICAR ESTADO DE AUTENTICACIÓN
// ============================================

export function checkAuthState(callback) {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Usuario logueado
            const userData = await getUserData(user.uid);
            callback({ 
                isLoggedIn: true, 
                user: user, 
                userData: userData.success ? userData.data : null 
            });
        } else {
            // Usuario no logueado
            callback({ isLoggedIn: false, user: null, userData: null });
        }
    });
}

// ============================================
// RESTABLECER CONTRASEÑA
// ============================================

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: "Correo de restablecimiento enviado" };
    } catch (error) {
        console.error("Error enviando correo:", error);
        return { success: false, error: error.message };
    }
}

// ============================================
// AGREGAR RESERVACIÓN AL USUARIO
// ============================================

export async function addReservationToUser(uid, reservationId, reservationData) {
    try {
        await updateDoc(doc(db, "users", uid), {
            reservaciones: arrayUnion({
                id: reservationId,
                fecha: reservationData.fecha,
                hora: reservationData.hora,
                personas: reservationData.personas,
                mesa: reservationData.mesa || 'Mesa no especificada',
                timestamp: new Date().toISOString()
            })
        });
        return { success: true };
    } catch (error) {
        console.error("Error agregando reservación:", error);
        return { success: false, error: error.message };
    }
}