import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    doc, 
    query, 
    onSnapshot,
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ============================================
// DATOS DEL MENÚ ALEMÁN
// 10 Platos + 5 Bebidas + 5 Postres = 20 items
// ============================================

const initialMenu = [
    // === PLATOS PRINCIPALES (10) ===
    { id: 1, nombre: "Schweinshaxe", categoria: "principales", precio: "$320", descripcion: "Codillo de cerdo asado crujiente con salsa de cerveza negra y Knödel", icono: "fa-drumstick-bite", tiempo: "25-30 min", aleman: "Schweinshaxe" },
    { id: 2, nombre: "Bratwurst Platte", categoria: "principales", precio: "$240", descripcion: "Tres salchichas alemanas (Bratwurst, Currywurst, Weisswurst) con chucrut y mostaza", icono: "fa-sausage", tiempo: "15 min", aleman: "Bratwurst" },
    { id: 3, nombre: "Sauerbraten", categoria: "principales", precio: "$290", descripcion: "Carne de res marinada en vinagre y especias, con salsa agridulce y Rotkohl", icono: "fa-utensils", tiempo: "20 min", aleman: "Sauerbraten" },
    { id: 4, nombre: "Jägerschnitzel", categoria: "principales", precio: "$260", descripcion: "Filete de cerdo empanizado con salsa de champiñones y Spätzle", icono: "fa-leaf", tiempo: "20 min", aleman: "Jägerschnitzel" },
    { id: 5, nombre: "Königsberger Klopse", categoria: "principales", precio: "$230", descripcion: "Albóndigas estilo Königsberg con alcaparras y puré de papas", icono: "fa-circle", tiempo: "25 min", aleman: "Klopse" },
    { id: 6, nombre: "Rinderroulade", categoria: "principales", precio: "$310", descripcion: "Rollos de res rellenos de tocino, pepinillos y cebolla, con gravy", icono: "fa-scroll", tiempo: "30 min", aleman: "Rinderroulade" },
    { id: 7, nombre: "Käsespätzle", categoria: "principales", precio: "$190", descripcion: "Pasta suaba con queso gratinado y cebolla caramelizada", icono: "fa-cheese", tiempo: "15 min", aleman: "Käsespätzle" },
    { id: 8, nombre: "Eisbein", categoria: "principales", precio: "$280", descripcion: "Codillo de cerdo hervido con chucrut y puré de arvejas", icono: "fa-piggy-bank", tiempo: "25 min", aleman: "Eisbein" },
    { id: 9, nombre: "Fischbrötchen", categoria: "principales", precio: "$210", descripcion: "Sándwich de pescado marinado con cebolla y salsa especial", icono: "fa-fish", tiempo: "10 min", aleman: "Fischbrötchen" },
    { id: 10, nombre: "Maultaschen", categoria: "principales", precio: "$200", descripcion: "Pasta rellena de carne, espinacas y especias, servida en caldo", icono: "fa-square", tiempo: "20 min", aleman: "Maultaschen" },
    
    // === BEBIDAS (5) ===
    { id: 11, nombre: "Weißbier (0.5L)", categoria: "bebidas", precio: "$120", descripcion: "Cerveza de trigo bávara, servida en jarra tradicional", icono: "fa-beer", tiempo: "2 min", aleman: "Weißbier" },
    { id: 12, nombre: "Dunkel Bier (0.5L)", categoria: "bebidas", precio: "$120", descripcion: "Cerveza oscura tostada, notas a caramelo y malta", icono: "fa-beer-mug", tiempo: "2 min", aleman: "Dunkel" },
    { id: 13, nombre: "Radler", categoria: "bebidas", precio: "$100", descripcion: "Mezcla refrescante de cerveza con limonada", icono: "fa-lemon", tiempo: "2 min", aleman: "Radler" },
    { id: 14, nombre: "Glühwein", categoria: "bebidas", precio: "$90", descripcion: "Vino caliente especiado con canela y clavo", icono: "fa-wine-glass", tiempo: "3 min", aleman: "Glühwein" },
    { id: 15, nombre: "Apfelschorle", categoria: "bebidas", precio: "$60", descripcion: "Refresco alemán de jugo de manzana con agua mineral", icono: "fa-apple-alt", tiempo: "2 min", aleman: "Apfelschorle" },
    
    // === POSTRES (5) ===
    { id: 16, nombre: "Apfelstrudel", categoria: "postres", precio: "$110", descripcion: "Strudel de manzana con pasas y nueces, servido con crema inglesa", icono: "fa-apple-alt", tiempo: "10 min", aleman: "Apfelstrudel" },
    { id: 17, nombre: "Schwarzwälder Kirschtorte", categoria: "postres", precio: "$130", descripcion: "Tarta Selva Negra: chocolate, cerezas y crema batida", icono: "fa-cake-candles", tiempo: "10 min", aleman: "Schwarzwälder" },
    { id: 18, nombre: "Kaiserschmarrn", categoria: "postres", precio: "$120", descripcion: "Panqueque desmenuzado estilo emperador con compota de ciruela", icono: "fa-pancakes", tiempo: "15 min", aleman: "Kaiserschmarrn" },
    { id: 19, nombre: "Bienenstich", categoria: "postres", precio: "$90", descripcion: "Pastel de almendras y crema de vainilla", icono: "fa-bee", tiempo: "10 min", aleman: "Bienenstich" },
    { id: 20, nombre: "Bayerische Creme", categoria: "postres", precio: "$85", descripcion: "Crema bávara de vainilla con frutos rojos", icono: "fa-ice-cream", tiempo: "8 min", aleman: "Bayerische Creme" }
];

// Datos de mesas temáticas alemanas
const initialTables = [
    { id: 1, numero: 1, capacidad: 4, estado: "disponible", nombre: "Münchner Stube", icono: "fa-chair" },
    { id: 2, numero: 2, capacidad: 6, estado: "disponible", nombre: "Bayern Halle", icono: "fa-chair" },
    { id: 3, numero: 3, capacidad: 2, estado: "ocupada", nombre: "Romantische Ecke", icono: "fa-chair" },
    { id: 4, numero: 4, capacidad: 8, estado: "disponible", nombre: "Oktoberfest Tisch", icono: "fa-chair" },
    { id: 5, numero: 5, capacidad: 4, estado: "ocupada", nombre: "Biergarten", icono: "fa-chair" },
    { id: 6, numero: 6, capacidad: 2, estado: "disponible", nombre: "Fensterplatz", icono: "fa-chair" },
    { id: 7, numero: 7, capacidad: 10, estado: "disponible", nombre: "Königssaal", icono: "fa-chair" },
    { id: 8, numero: 8, capacidad: 4, estado: "disponible", nombre: "Alpenblick", icono: "fa-chair" }
];

// Variables globales
let menuItems = [];
let tables = [];
let currentFilter = "all";

// ============================================
// INICIALIZAR DATOS EN FIRESTORE
// ============================================

async function initializeFirestoreData() {
    try {
        // Verificar menú
        const menuSnapshot = await getDocs(collection(db, "menu"));
        if (menuSnapshot.empty) {
            for (const item of initialMenu) {
                await addDoc(collection(db, "menu"), item);
            }
            console.log("🍻 Menú alemán inicializado! 20 platillos disponibles.");
        } else {
            console.log("✅ Menú ya existe en Firebase");
        }
        
        // Verificar mesas
        const tablesSnapshot = await getDocs(collection(db, "tables"));
        if (tablesSnapshot.empty) {
            for (const table of initialTables) {
                await addDoc(collection(db, "tables"), table);
            }
            console.log("🍺 Mesas tradicionales alemanas inicializadas!");
        } else {
            console.log("✅ Mesas ya existen en Firebase");
        }
    } catch (error) {
        console.error("Error inicializando datos:", error);
    }
}

// ============================================
// FUNCIONES DEL MENÚ
// ============================================

async function loadMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    try {
        const querySnapshot = await getDocs(collection(db, "menu"));
        menuItems = [];
        querySnapshot.forEach(doc => {
            menuItems.push({ firebaseId: doc.id, ...doc.data() });
        });
        displayMenu(menuItems);
    } catch (error) {
        console.error("Error cargando menú:", error);
        menuContainer.innerHTML = '<p style="text-align:center;">Error cargando el menú. Verifica Firebase.</p>';
    }
}

function displayMenu(items) {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    if (items.length === 0) {
        menuContainer.innerHTML = '<p style="text-align:center;">No hay platillos disponibles</p>';
        return;
    }
    
    menuContainer.innerHTML = items.map(item => {
        let iconClass = item.icono || 'fa-utensils';
        return `
            <div class="menu-item" data-categoria="${item.categoria}">
                <div class="menu-item-info">
                    <i class="fas ${iconClass}"></i>
                    <h3>${item.nombre}</h3>
                    <p>${item.descripcion}</p>
                    <p><small><i class="fas fa-clock"></i> ${item.tiempo || '15-20 min'}</small></p>
                    <p class="price">${item.precio}</p>
                    <button class="btn-order" onclick="showOrderAlert('${item.nombre}', '${item.precio}')">
                        <i class="fas fa-shopping-cart"></i> Pedir - Prost!
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Función global para el alert de pedido
window.showOrderAlert = function(nombre, precio) {
    alert(`🍺 ¡Prost! ${nombre} añadido a tu orden.\nTotal parcial: ${precio}`);
};

function setupMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            currentFilter = category;
            
            if (category === 'all') {
                displayMenu(menuItems);
            } else {
                const filtered = menuItems.filter(item => item.categoria === category);
                displayMenu(filtered);
            }
        });
    });
}

// ============================================
// FUNCIONES DE MESAS (TIEMPO REAL)
// ============================================

function setupTablesRealtime() {
    const tablesContainer = document.getElementById('tablesContainer');
    if (!tablesContainer) return;
    
    const q = query(collection(db, "tables"));
    onSnapshot(q, (snapshot) => {
        tables = [];
        snapshot.forEach(doc => {
            tables.push({ firebaseId: doc.id, ...doc.data() });
        });
        displayTables();
    });
}

function displayTables() {
    const tablesContainer = document.getElementById('tablesContainer');
    if (!tablesContainer) return;
    
    tablesContainer.innerHTML = tables.map(table => `
        <div class="table-card ${table.estado}" data-id="${table.firebaseId}" data-estado="${table.estado}">
            <i class="fas ${table.icono || 'fa-chair'}"></i>
            <h3>Mesa ${table.numero}</h3>
            <p>${table.nombre || 'Mesa Tradicional'}</p>
            <p>Capacidad: ${table.capacidad} personas</p>
            <span class="status ${table.estado}">${table.estado === 'disponible' ? 'Disponible 🟢' : 'Ocupada 🔴'}</span>
        </div>
    `).join('');
    
    // Event listeners para cambiar estado
    document.querySelectorAll('.table-card').forEach(card => {
        card.addEventListener('click', async () => {
            const tableId = card.dataset.id;
            const currentState = card.dataset.estado;
            const newState = currentState === 'disponible' ? 'ocupada' : 'disponible';
            const message = currentState === 'disponible' ? 'ocupada' : 'disponible';
            
            if (confirm(`¿${message === 'ocupada' ? 'Ocupar' : 'Liberar'} esta mesa?`)) {
                try {
                    await updateDoc(doc(db, "tables", tableId), {
                        estado: newState
                    });
                    console.log(`🍺 Mesa actualizada a ${newState}`);
                } catch (error) {
                    console.error("Error actualizando mesa:", error);
                    alert("Error al actualizar la mesa");
                }
            }
        });
    });
}

// ============================================
// RESERVACIONES
// ============================================

function setupReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const reservation = {
            nombre: document.getElementById('nombre')?.value || '',
            telefono: document.getElementById('telefono')?.value || '',
            correo: document.getElementById('correo')?.value || '',
            fecha: document.getElementById('fecha')?.value || '',
            hora: document.getElementById('hora')?.value || '',
            personas: document.getElementById('personas')?.value || '',
            mensaje: document.getElementById('mensaje')?.value || '',
            timestamp: new Date().toISOString(),
            estado: 'pendiente'
        };
        
        // Validar campos
        if (!reservation.nombre || !reservation.telefono || !reservation.fecha || !reservation.hora) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        try {
            await addDoc(collection(db, "reservaciones"), reservation);
            const msgDiv = document.getElementById('reservationMessage');
            if (msgDiv) {
                msgDiv.innerHTML = '<p style="color: #2e7d32; text-align: center; padding: 1rem; background: #e8f5e9; border-radius: 10px;"><i class="fas fa-check-circle"></i> 🍺 ¡Reservación exitosa! Prost! Te esperamos.</p>';
            }
            form.reset();
            
            setTimeout(() => {
                if (msgDiv) msgDiv.innerHTML = '';
            }, 5000);
        } catch (error) {
            console.error("Error guardando reservación:", error);
            alert('Error al procesar la reservación. Intenta de nuevo.');
        }
    });
}

// ============================================
// CONTACTO
// ============================================

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = {
            nombre: document.getElementById('contactName')?.value || '',
            email: document.getElementById('contactEmail')?.value || '',
            mensaje: document.getElementById('contactMessage')?.value || '',
            timestamp: new Date().toISOString()
        };
        
        if (!message.nombre || !message.email || !message.mensaje) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        try {
            await addDoc(collection(db, "contactos"), message);
            alert('🍺 ¡Mensaje enviado con éxito! Te responderemos pronto. Prost!');
            form.reset();
        } catch (error) {
            console.error("Error enviando mensaje:", error);
            alert('Error al enviar el mensaje. Intenta de nuevo.');
        }
    });
}

// ============================================
// NEWSLETTER
// ============================================

function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input?.value || '';
        
        if (!email) {
            alert('Ingresa tu correo electrónico');
            return;
        }
        
        try {
            await addDoc(collection(db, "newsletter"), {
                email: email,
                timestamp: new Date().toISOString()
            });
            alert('🍺 ¡Suscripción exitosa! Recibirás nuestras ofertas. Prost!');
            input.value = '';
        } catch (error) {
            console.error("Error en suscripción:", error);
            alert('Error al suscribirte. Intenta de nuevo.');
        }
    });
}

// ============================================
// MENÚ HAMBURGUESA
// ============================================

function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
}

// ============================================
// SCROLL SUAVE
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ============================================
// INICIALIZAR
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🍺 Biergarten München - Inicializando sistema...");
    
    await initializeFirestoreData();
    
    // Cargar según la página actual
    const path = window.location.pathname;
    
    if (path.includes('menu.html')) {
        await loadMenu();
        setupMenuFilters();
    } else if (path.includes('mesas.html')) {
        setupTablesRealtime();
    } else if (path.includes('reservaciones.html')) {
        setupReservationForm();
    } else if (path.includes('contacto.html')) {
        setupContactForm();
    } else {
        // Página principal
        setupNewsletter();
    }
    
    // Funciones comunes
    setupHamburgerMenu();
    setupSmoothScroll();
    
    console.log("🍺 Sistema listo - ¡Willkommen im Biergarten München!");
});