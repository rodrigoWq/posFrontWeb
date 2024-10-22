document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario

    // Obtener los valores de los campos eliminando espacios en blanco al inicio y final
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Referencias a los elementos de error
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");

    // Limpiar mensajes de error previos
    usernameError.textContent = "";
    usernameError.classList.remove("visible");
    passwordError.textContent = "";
    passwordError.classList.remove("visible");

    let hasError = false;

    // Validación de campos vacíos
    if (username === "") {
        usernameError.textContent = "Por favor, ingresa un nombre de usuario.";
        usernameError.classList.add("visible");
        hasError = true;
    }

    if (password === "") {
        passwordError.textContent = "Por favor, ingresa una contraseña.";
        passwordError.classList.add("visible");
        hasError = true;
    }

    // Validación del formato de nombre de usuario (sin espacios y al menos 3 caracteres)
    const usernameRegex = /^\S{3,}$/;
    if (!hasError && !usernameRegex.test(username)) {
        usernameError.textContent = "El nombre de usuario debe tener al menos 3 caracteres y no debe contener espacios.";
        usernameError.classList.add("visible");
        hasError = true;
    }

    // Validación de la contraseña (mínimo 5 caracteres)
    if (!hasError && password.length < 5) {
        passwordError.textContent = "La contraseña debe tener al menos 5 caracteres.";
        passwordError.classList.add("visible");
        hasError = true;
    }

    // Si no hay errores, hacer la solicitud al backend
    if (!hasError) {
        const loginData = {
            nombre_usuario: username,
            password: password
        };

        fetch(`https://apimocha.com/example122/api/auth/login/${loginData.nombre_usuario}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                console.log(data.rol_id)
                // Almacenar el token y el rol_id en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol_id', data.rol_id);
                //alert(data.message)

            // Redirigir según el rol_id
            if (data.rol_id == 1) {
                // Si el rol_id es 1 (Admin), redirigir a user_management.html
                window.location.href = "Ventas/HTML/pantalla_inicio.html";
            } else {
                // Si el rol_id es diferente, redirigir a pantalla_inicio.html
                window.location.href = "Ventas/HTML/pantalla_inicio.html";
            }
            } else {
                passwordError.textContent = "Usuario o contraseña incorrectos.";
                passwordError.classList.add("visible");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            passwordError.textContent = "Ocurrió un error al intentar iniciar sesión.";
            passwordError.classList.add("visible");
        });
    }
});
// Código para cerrar sesión automáticamente si el usuario llega a la pantalla de inicio de sesión
document.addEventListener('DOMContentLoaded', function() {
    // Eliminar token o cualquier información de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('rol_id');

    console.log('Sesión cerrada automáticamente al llegar a la pantalla de inicio de sesión.');
});
