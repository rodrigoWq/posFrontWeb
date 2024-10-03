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
    const editRoleSelect = document.getElementById('edit-role');
    const editStatusSelect = document.getElementById('edit-status');
    const editPasswordInput = document.getElementById('edit-password'); // Campo para la nueva contraseña
    const editConfirmPasswordInput = document.getElementById('edit-confirm-password'); // Campo para confirmar contraseña
    
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
            const currentRole = row.querySelector('td:nth-child(3)').textContent; // Rol actual
            const currentStatus = row.querySelector('.status').classList.contains('active') ? 'active' : 'inactive'; // Estado actual

            // Rellenar el formulario con los valores actuales del usuario
            editNameInput.value = currentName;
            editRoleSelect.value = (currentRole === 'Admin') ? '1' : (currentRole === 'Manager') ? '2' : '3';
            editStatusSelect.value = currentStatus;

            // Limpiar los campos de contraseña al abrir el modal
            editPasswordInput.value = '';
            editConfirmPasswordInput.value = '';
            
            // Mostrar el modal
            showModal();
        });
    });


    // Evento para cerrar el modal
    document.querySelector('.close-button').addEventListener('click', hideModal);

    // Manejo del envío del formulario
    editUserForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario tradicional
        
        // Obtener los datos del formulario
        const userData = {
            usuario_id: currentUserId,
            nombre: editNameInput.value,
            rol_id: editRoleSelect.value,
            status: editStatusSelect.value
        };

        // Validar si se ingresaron contraseñas
        const nuevaContraseña = editPasswordInput.value.trim();
        const confirmarContraseña = editConfirmPasswordInput.value.trim();

        if (nuevaContraseña || confirmarContraseña) {
            // Verificar que las contraseñas coincidan
            if (nuevaContraseña !== confirmarContraseña) {
                alert("Las contraseñas no coinciden.");
                return;
            }
            // Añadir la contraseña al objeto solo si es válida
            userData.password = nuevaContraseña;
        }

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