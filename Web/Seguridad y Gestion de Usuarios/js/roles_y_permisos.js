
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el rol del usuario desde localStorage (asegúrate de que se guarda correctamente al iniciar sesión)
    const rolId = localStorage.getItem('rol_id'); // Por ejemplo, el rol 1 es "Admin", el rol 3 es "User"

    // Verificar si el rol se obtuvo correctamente
    if (!rolId) {
        console.error('No se encontró el rol del usuario');
        return;
    }

    // Función para verificar el rol y ajustar la visibilidad de los elementos
    function aplicarRestriccionesPorRol() {
        const adminOnlyElements = document.querySelectorAll('.admin-only'); // Elementos restringidos a Admin

        if (rolId == 1) {
            // Si es Admin (rol_id == 1), mostramos los elementos restringidos
            adminOnlyElements.forEach(element => {
                element.style.display = ''; // Mantener el estilo original o modificar si es necesario
            });
        } else {
            // Si NO es Admin, ocultamos los elementos restringidos
            adminOnlyElements.forEach(element => {
                element.style.display = 'none'; // Ocultar los elementos
            });
        }
    }

    // Llamar a la función al cargar la página
    aplicarRestriccionesPorRol();
});



// Función para obtener los permisos asociados a un rol
function obtenerPermisosPorRol(rolId) {
    const token = localStorage.getItem('token'); // Suponiendo que tienes el token almacenado en localStorage

    // Hacer la solicitud GET al backend
    fetch(`http://localhost:3000/api/auth/permissions/?rol_id=${rolId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 403) {
            throw new Error('No tienes permiso para visualizar los permisos');
        }
        return response.json();
    })
    .then(data => {
        mostrarPermisosEnFrontend(data); // Llamar a la función que muestra los permisos
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(error.message); // Mostrar el error en un alert o en la interfaz
    });
}

// Función para mostrar los permisos en el frontend
function mostrarPermisosEnFrontend(permisos) {
    const permisosContainer = document.getElementById('permisos-container');
    permisosContainer.innerHTML = ''; // Limpiar el contenido previo

    permisos.forEach(permiso => {
        // Crear un elemento para mostrar el permiso
        const permisoItem = document.createElement('div');
        permisoItem.classList.add('permiso-item');
        permisoItem.innerHTML = `
            <h4>${permiso.nombre_permiso}</h4>
            <p>${permiso.descripcion}</p>
        `;
        permisosContainer.appendChild(permisoItem); // Añadir el permiso al contenedor
    });
}
