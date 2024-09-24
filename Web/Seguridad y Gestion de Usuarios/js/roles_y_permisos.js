document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token del usuario almacenado en localStorage
    const token = localStorage.getItem('token');

    // URL de la página de login
    const sessionManager = new SessionManager('../../Seguridad y Gestion de Usuarios/HTML/iniciar_session'); 
    sessionManager.init(); // Iniciar verificación de sesión y manejo de historial
    

    // Obtener todos los botones de editar
    const editButtons = document.querySelectorAll('.edit-btn');
    
    // Referencias al modal y sus campos
    const editUserModal = document.getElementById('editUserModal');
    const editUserForm = document.getElementById('editUserForm');
    const editNameInput = document.getElementById('edit-name');
    const editEmailInput = document.getElementById('edit-email');
    const editRoleSelect = document.getElementById('edit-role');
    const editStatusSelect = document.getElementById('edit-status');
    
    let currentUserId; // Para almacenar el ID del usuario que se está editando

    // Función para mostrar el modal
    function showModal() {
        editUserModal.classList.remove('hidden');
    }

    // Función para ocultar el modal
    function hideModal() {
        editUserModal.classList.add('hidden');
    }

    // Asignar evento de clic a los botones de edición
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr'); // Obtener la fila del botón
            currentUserId = row.dataset.usuarioId; // Obtener el ID del usuario desde el atributo data-usuario-id
            const currentName = row.querySelector('td:nth-child(1)').textContent; // Nombre actual
            const currentEmail = row.querySelector('td:nth-child(2)').textContent; // Email actual
            const currentRole = row.querySelector('td:nth-child(3)').textContent; // Rol actual
            const currentStatus = row.querySelector('.status').classList.contains('active') ? 'active' : 'inactive'; // Estado actual

            // Rellenar el formulario con los valores actuales del usuario
            editNameInput.value = currentName;
            editEmailInput.value = currentEmail;
            editRoleSelect.value = (currentRole === 'Admin') ? '1' : (currentRole === 'Manager') ? '2' : '3';
            editStatusSelect.value = currentStatus;
            
            // Mostrar el modal
            showModal();
        });
    });

    // Evento para cerrar el modal
    document.querySelector('.close-button').addEventListener('click', hideModal);

    // Manejo del envío del formulario
    editUserForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario tradicional
        
        // Datos a enviar
        const userData = {
            usuario_id: currentUserId,
            nombre: editNameInput.value,
            email: editEmailInput.value,
            rol_id: editRoleSelect.value,
            status: editStatusSelect.value
        };

        // Enviar la solicitud de actualización
        fetch(`http://localhost:3000/api/users/update`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Usuario actualizado exitosamente');
                hideModal();
                // Actualiza la tabla o recarga la página para reflejar los cambios
            } else {
                alert('Error al actualizar el usuario');
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al modal de edición
    const editUserModal = document.getElementById('editUserModal');
    const closeEditUserModalButton = document.getElementById('closeEditUserModal');

    // Función para ocultar el modal de Editar Usuario
    function hideEditUserModal() {
        editUserModal.classList.add('hidden'); // Añadir la clase hidden para ocultar
    }

    // Asociar el evento de clic al botón de cerrar del modal de edición
    if (closeEditUserModalButton) {
        closeEditUserModalButton.addEventListener('click', hideEditUserModal);
    }

    // Evento para abrir el modal de edición cuando se haga clic en el botón de editar
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            editUserModal.classList.remove('hidden'); // Mostrar el modal de edición
        });
    });
});


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
