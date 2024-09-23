document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value.trim();
    const rol = document.getElementById("rol").value;
    const estado = document.querySelector(".estado.active").dataset.estado;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !telefono || !puesto || !direccion || !fecha_nacimiento || !rol || !estado) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear el objeto de datos para enviar al backend
    const userData = {
        nombre_usuario: nombre,  // Puedes ajustar este campo según lo que pida tu backend
        password: "defaultPassword",  // Define cómo manejar la contraseña, aquí es un valor por defecto
        rol_id: obtenerIdRol(rol), // Convertir el rol a su respectivo ID
        estado: estado  // Activo o inactivo
    };

    // Obtener el token JWT almacenado en localStorage
    const token = localStorage.getItem('token');

    // Hacer la solicitud al backend
    fetch('https://apimocha.com/example122/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Enviar el token JWT
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = "../../Ventas/HTML/pantalla_inicio.html"; // Redirigir a la lista de usuarios o una página de confirmación
        } else {
            alert("Error al registrar el usuario");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ocurrió un error al intentar registrar el usuario.");
    });
});

// Función para mapear los roles a sus IDs
function obtenerIdRol(rol) {
    switch (rol) {
        case "administrador":
            return 1;
        case "gerente":
            return 2;
        case "cajero":
            return 3;
        default:
            return 0; // Manejar el caso en el que el rol no esté definido
    }
}

// Agregar funcionalidad para cambiar el estado
document.querySelectorAll('.estado').forEach(button => {
    button.addEventListener('click', function() {
        // Remover la clase 'active' de todos los botones
        document.querySelectorAll('.estado').forEach(btn => btn.classList.remove('active'));

        // Agregar la clase 'active' al botón seleccionado
        this.classList.add('active');
    });
});

// Seleccionar el botón "Create User" y el modal
const createUserButton = document.querySelector(".create-user-btn");
const modal = document.getElementById("createUserModal");
const closeButton = document.querySelector(".close-button");

// Evento para abrir el modal
createUserButton.addEventListener("click", function() {
    modal.classList.remove("hidden"); // Mostrar el modal al quitar la clase 'hidden'
});

// Evento para cerrar el modal cuando se hace clic en el botón de cerrar
closeButton.addEventListener("click", function() {
    modal.classList.add("hidden"); // Ocultar el modal al añadir la clase 'hidden'
});

// Opcional: Cerrar el modal si el usuario hace clic fuera del mismo
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.classList.add("hidden");
    }
});

// Agregar funcionalidad para cambiar el estado
document.querySelectorAll('.estado').forEach(button => {
    button.addEventListener('click', function() {
        // Remover la clase 'active' de todos los botones
        document.querySelectorAll('.estado').forEach(btn => btn.classList.remove('active'));

        // Agregar la clase 'active' al botón seleccionado
        this.classList.add('active');
    });
});

//Filtros
document.addEventListener('DOMContentLoaded', function() {
    let currentRoleFilter = 'all'; // Filtro de rol, por defecto "all"
    let currentStatusFilter = 'all'; // Filtro de estado, por defecto "all"

    // Seleccionar los elementos del DOM
    const roleButtons = document.querySelectorAll('.filter-role');
    const statusButtons = document.querySelectorAll('.filter-status');
    const rows = document.querySelectorAll('tbody tr');
    const searchInput = document.getElementById('search-input');

    // Función para aplicar los filtros
    function applyFilters() {
        const searchQuery = searchInput.value.toLowerCase(); // Obtener la búsqueda por nombre

        rows.forEach(row => {
            const role = row.querySelector('td:nth-child(3)').textContent.trim(); // Rol en la fila
            const status = row.querySelector('.status').classList.contains('active') ? 'active' : 'inactive'; // Estado en la fila
            const name = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase(); // Nombre en la fila

            // Si se seleccionó un filtro de estado, ignorar el filtro de rol
            if (currentStatusFilter !== 'all') {
                const statusMatches = status === currentStatusFilter;
                const nameMatches = searchQuery === '' || name.includes(searchQuery);

                // Mostrar la fila si cumple con el estado y la búsqueda
                row.style.display = (statusMatches && nameMatches) ? '' : 'none';
                return;
            }

            // Si no hay filtro de estado, aplicar el filtro de rol y nombre
            const roleMatches = currentRoleFilter === 'all' || role === currentRoleFilter;
            const nameMatches = searchQuery === '' || name.includes(searchQuery);

            // Mostrar la fila si cumple con el rol y la búsqueda
            row.style.display = (roleMatches && nameMatches) ? '' : 'none';
        });
    }

    // Manejo de los eventos de los botones de roles
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentRoleFilter = this.getAttribute('data-role'); // Actualizar el filtro de rol
            currentStatusFilter = 'all'; // Resetear el filtro de estado
            applyFilters(); // Aplicar los filtros
        });
    });

    // Manejo de los eventos de los botones de estado
    statusButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStatusFilter = this.getAttribute('data-status'); // Actualizar el filtro de estado
            currentRoleFilter = 'all'; // Resetear el filtro de rol
            applyFilters(); // Aplicar los filtros
        });
    });

    // Filtrar al escribir en el campo de búsqueda
    searchInput.addEventListener('input', applyFilters);
});



