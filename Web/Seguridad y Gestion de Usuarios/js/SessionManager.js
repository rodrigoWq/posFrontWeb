class SessionManager {
    constructor(loginPageUrl) {
        this.loginPageUrl = loginPageUrl; // URL de la página de login
    }

    // Método para verificar si la sesión es válida
    verifySession() {
        const token = localStorage.getItem('token');

        // Verificar si estamos en la página de login usando la variable global
        if (window.isLoginPage) {
            return; // No hacer nada si estamos en la página de login
        }

        if (!token) {
            alert('Debes iniciar sesión para acceder a esta página.');
            this.redirectToLogin();
        }
    }

    // Método para redirigir a la página de login
    redirectToLogin() {
        window.location.href = this.loginPageUrl;
    }

    // Método para manejar el historial del navegador (botones de atrás y adelante)
    preventCacheAccess() {
        window.onpageshow = (event) => {
            if (event.persisted || window.performance && window.performance.navigation.type === 2) {
                // Si se detecta una navegación "hacia atrás"
                const token = localStorage.getItem('token');
                if (!token) {
                    this.redirectToLogin(); // Solo redirigir al login si no hay sesión
                }
            }
        };
    }

    // Método para inicializar la verificación de sesión y manejar el historial
    init() {
        this.verifySession();     // Verificar si hay una sesión activa
        this.preventCacheAccess(); // Evitar navegación desde caché
    }
}

class NavigationManager {
    constructor() {
        this.setupPopStateListener();
    }

    // Redirigir a una nueva página y cargar el contenido
    navigateTo(url) {
        history.pushState(null, '', url); // Cambiar la URL sin recargar
        this.loadPageContent(url);        // Cargar el contenido de la página
    }

    // Manejar el evento popstate para cambiar el contenido al navegar hacia atrás o adelante
    setupPopStateListener() {
        window.addEventListener('popstate', () => {
            this.loadPageContent(location.pathname); // Cargar el contenido según la URL actual
        });
    }

    // Función genérica para cargar el contenido de la página
    loadPageContent(url) {
        // Aquí puedes manejar las rutas dinámicas del sistema
        if (url.includes('/pantalla_inicio.html')) {
            this.loadInicioContent();
        } else if (url.includes('/user_management.html')) {
            this.loadUserManagementContent();
        } else if (url.includes('/inventario.html')) {
            this.loadInventarioContent();
        } else {
            console.error('Página no encontrada.');
        }
    }

    // Función para cargar el contenido de Pantalla Inicio
    loadInicioContent() {
        // Aquí cargamos el contenido de Pantalla Inicio (puede ser dinámico)
        window.location.href = '/Ventas/HTML/pantalla_inicio.html';
    }

    // Función para cargar el contenido de User Management
    loadUserManagementContent() {
        // Aquí cargamos el contenido de User Management (puede ser dinámico)
        window.location.href = '/Seguridad y Gestion de Usuarios/HTML/user_management.html';
    }
    loadInventarioContent() {
        // Aquí cargamos el contenido de Compras (puede ser dinámico)
        window.location.href = '/Inventario/HTML/inventario.html';
    } 
}

// Inicializar el SessionManager y NavigationManager
document.addEventListener('DOMContentLoaded', function() {
    const sessionManager = new SessionManager('/index.html');
    sessionManager.init(); // Verificar la sesión

    const navigationManager = new NavigationManager();

    // Redirigir al hacer clic en "Volver a Pantalla Inicio"
    const goToInicioBtn = document.getElementById('goToInicio');
    if (goToInicioBtn) {
        goToInicioBtn.addEventListener('click', function() {
            navigationManager.navigateTo('../../Ventas/HTML/pantalla_inicio.html');
        });
    }
});
