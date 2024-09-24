class SessionManager {
    constructor(loginPageUrl) {
        this.loginPageUrl = loginPageUrl; // URL de la página de login
    }

    // Método para verificar si la sesión es válida
    verifySession() {
        const token = localStorage.getItem('token');
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
                this.redirectToLogin();
            }
        };
    }

    // Método para inicializar la verificación de sesión y manejar el historial
    init() {
        this.verifySession();     // Verificar si hay una sesión activa
        this.preventCacheAccess(); // Evitar navegación desde caché
    }
}


document.getElementById('goToInicio').addEventListener('click', function() {
    // Añade la entrada al historial
    history.pushState(null, '', '../../Ventas/HTML/pantalla_inicio.html');
    window.location.href = '../../Ventas/HTML/pantalla_inicio.html';
});

