// Simulación de clientes
let clientesNormales = [
    { nombre: 'Juan Pérez', ruc: '12345678', telefono: '0987654321', direccion: 'Av. Siempre Viva 123' },
    { nombre: 'María López', ruc: '87654321', telefono: '0987654322', direccion: 'Calle Falsa 456' }
];

let clientesCredito = [
    { nombre: 'Carlos García', ruc: '65432123', telefono: '0987654323', saldo: 500, direccion: 'Calle Real 789' },
    { nombre: 'Ana Torres', ruc: '43218765', telefono: '0987654324', saldo: 300, direccion: 'Av. Libertad 321' }
];

// Variables para paginación y edición
let currentPageNormales = 1;
let currentPageCredito = 1;
const rowsPerPage = 5; // Máximo de clientes por página
let editingClienteNormal = null;
let editingClienteCredito = null;

// Renderizar clientes normales con paginación
function renderClientesNormales(page) {
    const tbody = document.getElementById('clientesNormalesBody');
    tbody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const clientesPagina = clientesNormales.slice(start, end);

    clientesPagina.forEach((cliente, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.ruc}</td>
            <td>${cliente.telefono}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarClienteNormal(${start + index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarClienteNormal(${start + index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updatePaginationNormales(page);
}

// Renderizar clientes crédito con paginación
function renderClientesCredito(page) {
    const tbody = document.getElementById('clientesCreditoBody');
    tbody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const clientesPagina = clientesCredito.slice(start, end);

    clientesPagina.forEach((cliente, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.ruc}</td>
            <td>${cliente.telefono}</td>
            <td>${cliente.saldo}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarClienteCredito(${start + index})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarClienteCredito(${start + index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    updatePaginationCredito(page);
}

// Editar cliente normal
function editarClienteNormal(index) {
    const cliente = clientesNormales[index];
    document.getElementById('nombreNormal').value = cliente.nombre;
    document.getElementById('rucNormal').value = cliente.ruc;
    document.getElementById('telefonoNormal').value = cliente.telefono;
    document.getElementById('direccionNormal').value = cliente.direccion;
    editingClienteNormal = index; // Guardar el índice del cliente en edición
}

// Editar cliente crédito
function editarClienteCredito(index) {
    const cliente = clientesCredito[index];
    document.getElementById('nombreCredito').value = cliente.nombre;
    document.getElementById('rucCredito').value = cliente.ruc;
    document.getElementById('telefonoCredito').value = cliente.telefono;
    document.getElementById('saldoCredito').value = cliente.saldo;
    document.getElementById('direccionCredito').value = cliente.direccion;
    editingClienteCredito = index; // Guardar el índice del cliente en edición
}

// Eliminar cliente normal
function eliminarClienteNormal(index) {
    clientesNormales.splice(index, 1);
    renderClientesNormales(currentPageNormales);
}

// Eliminar cliente crédito
function eliminarClienteCredito(index) {
    clientesCredito.splice(index, 1);
    renderClientesCredito(currentPageCredito);
}

// Función para registrar o actualizar cliente normal
document.getElementById('clientesNormalesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreNormal').value;
    const ruc = document.getElementById('rucNormal').value;
    const telefono = document.getElementById('telefonoNormal').value;
    const direccion = document.getElementById('direccionNormal').value;

    const cliente = { nombre, ruc, telefono, direccion };

    if (editingClienteNormal !== null) {
        clientesNormales[editingClienteNormal] = cliente; // Actualizar cliente en edición
        editingClienteNormal = null; // Resetear
    } else {
        clientesNormales.push(cliente); // Agregar nuevo cliente
    }

    renderClientesNormales(currentPageNormales);
    this.reset(); // Limpiar el formulario
});

// Función para registrar o actualizar cliente crédito
document.getElementById('clientesCreditoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombreCredito').value;
    const ruc = document.getElementById('rucCredito').value;
    const telefono = document.getElementById('telefonoCredito').value;
    const saldo = document.getElementById('saldoCredito').value;
    const direccion = document.getElementById('direccionCredito').value;

    const cliente = { nombre, ruc, telefono, saldo, direccion };

    if (editingClienteCredito !== null) {
        clientesCredito[editingClienteCredito] = cliente; // Actualizar cliente en edición
        editingClienteCredito = null; // Resetear
    } else {
        clientesCredito.push(cliente); // Agregar nuevo cliente
    }

    renderClientesCredito(currentPageCredito);
    this.reset(); // Limpiar el formulario
});

// Actualizar paginación
function updatePaginationNormales(page) {
    const totalPages = Math.ceil(clientesNormales.length / rowsPerPage);
    document.getElementById('paginacionNormales').innerHTML = `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="navigateNormales(${page - 1})">Anterior</a>
        </li>
        <li class="page-item disabled"><a class="page-link">Página ${page}</a></li>
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="navigateNormales(${page + 1})">Siguiente</a>
        </li>
    `;
}

function updatePaginationCredito(page) {
    const totalPages = Math.ceil(clientesCredito.length / rowsPerPage);
    document.getElementById('paginacionCredito').innerHTML = `
        <li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="navigateCredito(${page - 1})">Anterior</a>
        </li>
        <li class="page-item disabled"><a class="page-link">Página ${page}</a></li>
        <li class="page-item ${page === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="navigateCredito(${page + 1})">Siguiente</a>
        </li>
    `;
}

// Navegación de paginación
function navigateNormales(page) {
    if (page < 1 || page > Math.ceil(clientesNormales.length / rowsPerPage)) return;
    currentPageNormales = page;
    renderClientesNormales(page);
}

function navigateCredito(page) {
    if (page < 1 || page > Math.ceil(clientesCredito.length / rowsPerPage)) return;
    currentPageCredito = page;
    renderClientesCredito(page);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderClientesNormales(currentPageNormales);
    renderClientesCredito(currentPageCredito);
});
