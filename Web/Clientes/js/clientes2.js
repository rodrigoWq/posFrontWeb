// Simulación de "base de datos" de clientes con datos predefinidos
let clientes = [
    { nombre: 'Juan Pérez', ruc: '12345678', telefono: '0987654321', tipo: 'normal', saldo: null },
    { nombre: 'María López', ruc: '87654321', telefono: '0987654322', tipo: 'credito', saldo: 5000 },
    { nombre: 'Carlos García', ruc: '65432123', telefono: '0987654323', tipo: 'normal', saldo: null },
    { nombre: 'Ana Torres', ruc: '43218765', telefono: '0987654324', tipo: 'credito', saldo: 3000 }
];

let clienteActual = null; // Para saber si estamos editando o creando un nuevo cliente

// Función para normalizar strings (para ignorar mayúsculas, minúsculas y acentos)
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Renderizar los clientes en la tabla con filtros aplicados
function renderClientes(filtrados = clientes) {
    const tbody = document.getElementById('clientesBody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar

    filtrados.forEach((cliente, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.ruc}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.tipo}</td>
            <td>${cliente.tipo === 'credito' ? cliente.saldo : '-'}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarCliente(${index})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${index})">🗑️</button>
                ${
                    cliente.tipo === 'credito' 
                    ? `<button class="btn btn-warning btn-sm">Línea de Crédito</button>` 
                    : ''
                }
            </td>
        `;
        tbody.appendChild(row);
    });
}
// Función para guardar un cliente (nuevo o editado)
document.getElementById('clienteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir recarga de la página

    const nombre = document.getElementById('nombreCliente').value;
    const ruc = document.getElementById('rucCliente').value;
    const telefono = document.getElementById('telefonoCliente').value;
    const tipo = document.getElementById('tipoCliente').value;
    const saldo = tipo === 'credito' ? document.getElementById('saldoCliente').value : null;

    if (clienteActual === null) {
        // Si no hay clienteActual, es un nuevo cliente
        clientes.push({ nombre, ruc, telefono, tipo, saldo });
    } else {
        // Si hay clienteActual, estamos editando un cliente existente
        clientes[clienteActual] = { nombre, ruc, telefono, tipo, saldo };
    }

    renderClientes(); // Actualizar la tabla con los nuevos datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('clienteModal'));
    modal.hide(); // Cerrar el modal
    limpiarFormularioCliente(); // Limpiar el formulario después de guardar
});

// Función para editar un cliente
function editarCliente(index) {
    clienteActual = index; // Guardamos el índice del cliente que estamos editando

    const cliente = clientes[index];
    document.getElementById('nombreCliente').value = cliente.nombre;
    document.getElementById('rucCliente').value = cliente.ruc;
    document.getElementById('telefonoCliente').value = cliente.telefono;
    document.getElementById('tipoCliente').value = cliente.tipo;

    if (cliente.tipo === 'credito') {
        document.getElementById('saldoClienteContainer').style.display = 'block';
        document.getElementById('saldoCliente').value = cliente.saldo;
    } else {
        document.getElementById('saldoClienteContainer').style.display = 'none';
    }

    document.getElementById('clienteModalLabel').textContent = 'Editar Cliente';
    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
}


// Función para buscar clientes por nombre y RUC y aplicar el filtro de tipo de cliente
function aplicarFiltros() {
    const searchInput = document.getElementById('search-input').value;
    const filtroTipo = document.querySelector('.filter-role.active') ? document.querySelector('.filter-role.active').getAttribute('data-role') : 'all';

    // Filtrar clientes por nombre, RUC y tipo de cliente
    const filtrados = clientes.filter(cliente => {
        const nombreClienteNormalizado = normalizeString(cliente.nombre);
        const rucClienteNormalizado = normalizeString(cliente.ruc);
        const searchQueryNormalizado = normalizeString(searchInput);

        const tipoCoincide = filtroTipo === 'all' || cliente.tipo === filtroTipo;
        const nombreCoincide = nombreClienteNormalizado.includes(searchQueryNormalizado);
        const rucCoincide = rucClienteNormalizado.includes(searchQueryNormalizado);

        return tipoCoincide && (nombreCoincide || rucCoincide);
    });

    renderClientes(filtrados); // Renderizar la tabla con los clientes filtrados
}


// Añadir eventos a los botones de filtros de tipo de cliente
document.querySelectorAll('.filter-role').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-role').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        aplicarFiltros(); // Aplicar los filtros al cambiar el tipo
    });
});

// Filtrar al escribir en el campo de búsqueda
document.getElementById('search-input').addEventListener('input', aplicarFiltros);

// Renderizar clientes al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderClientes(); // Renderizar todos los clientes inicialmente
});

function editarCliente(index) {
    const cliente = clientes[index];

    // Poner los datos del cliente en los inputs del modal
    document.getElementById('nombreCliente').value = cliente.nombre;
    document.getElementById('rucCliente').value = cliente.ruc;
    document.getElementById('telefonoCliente').value = cliente.telefono;
    document.getElementById('tipoCliente').value = cliente.tipo;

    // Mantener visible el campo de saldo sin importar el tipo de cliente
    document.getElementById('saldoCliente').value = cliente.saldo || ''; // Mantén vacío si no es de crédito

    // Cambiar el título del modal a "Editar Cliente"
    document.getElementById('clienteModalLabel').textContent = 'Editar Cliente';

    // Abrir el modal de registrar cliente
    const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
    modal.show();
}

// Función para limpiar los inputs del formulario de cliente
function limpiarFormularioCliente() {
    document.getElementById('clienteForm').reset(); // Limpiar todos los inputs
    document.getElementById('saldoClienteContainer').style.display = 'none'; // Ocultar el campo de saldo por defecto
    clienteActual = null; // Limpiar clienteActual
}



// Función para eliminar cliente
function eliminarCliente(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        clientes.splice(index, 1); // Eliminar cliente del array
        aplicarFiltros(); // Actualizar la tabla después de eliminar
    }
}


// Función para mostrar/ocultar el campo de línea de crédito según el tipo de cliente
function toggleSaldo() {
    const tipoCliente = document.getElementById('tipoCliente').value;
    const saldoClienteContainer = document.getElementById('saldoClienteContainer');

    if (tipoCliente === 'credito') {
        saldoClienteContainer.style.display = 'block'; // Mostrar el campo de saldo
    } else {
        saldoClienteContainer.style.display = 'none'; // Ocultar el campo de saldo
        document.getElementById('saldoCliente').value = ''; // Limpiar el saldo si no es crédito
    }
}

// Vincular la función al select
document.getElementById('tipoCliente').addEventListener('change', toggleSaldo);




// Escuchar el evento de apertura del modal
document.getElementById('clienteModal').addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Botón que abrió el modal
    if (button && button.classList.contains('btn-success')) {
        // Si el botón que activó el modal es el de "Registrar Cliente" (clase btn-success), limpiar los inputs
        limpiarFormularioCliente();
    }
});