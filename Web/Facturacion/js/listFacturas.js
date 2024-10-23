// Simulación de "base de datos" de facturas con datos predefinidos
let facturas = [
    { numero: '001', ruc: '12345678', fecha: '2024-10-01', monto: 1200 },
    { numero: '002', ruc: '87654321', fecha: '2024-10-02', monto: 2500 },
    { numero: '003', ruc: '65432123', fecha: '2024-10-03', monto: 3200 }
];

let facturaActual = null; // Para saber si estamos editando o creando una nueva factura

// Función para renderizar las facturas en la tabla
function renderFacturas(filtradas = facturas) {
    const tbody = document.getElementById('facturasBody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de renderizar

    filtradas.forEach((factura, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${factura.numero}</td>
            <td>${factura.ruc}</td>
            <td>${factura.fecha}</td>
            <td>$${formatearMonto(factura.monto)}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarFactura(${index})">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarFactura(${index})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para guardar una factura (nueva o editada)
document.getElementById('facturaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir recarga de la página

    const numero = document.getElementById('numeroFactura').value;
    const ruc = document.getElementById('rucCliente').value;
    const fecha = document.getElementById('fechaFactura').value;
    const monto = document.getElementById('montoTotal').value;

    if (facturaActual === null) {
        // Si no hay facturaActual, es una nueva factura
        facturas.push({ numero, ruc, fecha, monto });
    } else {
        // Si hay facturaActual, estamos editando una factura existente
        facturas[facturaActual] = { numero, ruc, fecha, monto };
    }

    renderFacturas(); // Actualizar la tabla con los nuevos datos
    const modal = bootstrap.Modal.getInstance(document.getElementById('facturaModal'));
    modal.hide(); // Cerrar el modal
    limpiarFormularioFactura(); // Limpiar el formulario después de guardar
});

// Función para editar una factura
function editarFactura(index) {
    facturaActual = index; // Guardamos el índice de la factura que estamos editando

    const factura = facturas[index];
    document.getElementById('numeroFactura').value = factura.numero;
    document.getElementById('rucCliente').value = factura.ruc;
    document.getElementById('fechaFactura').value = factura.fecha;
    document.getElementById('montoTotal').value = factura.monto;

    document.getElementById('facturaModalLabel').textContent = 'Editar Factura';
    const modal = new bootstrap.Modal(document.getElementById('facturaModal'));
    modal.show();
}

// Función para eliminar una factura
function eliminarFactura(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
        facturas.splice(index, 1); // Eliminar factura del array
        renderFacturas(); // Actualizar la tabla después de eliminar
    }
}

// Función para filtrar facturas por número de factura o RUC
document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    const facturasFiltradas = facturas.filter(factura => 
        factura.numero.toLowerCase().includes(query) || 
        factura.ruc.toLowerCase().includes(query)
    );
    
    renderFacturas(facturasFiltradas); // Renderizar las facturas filtradas
});

// Función para limpiar el formulario de factura
function limpiarFormularioFactura() {
    document.getElementById('facturaForm').reset(); // Limpiar todos los inputs
    facturaActual = null; // Limpiar facturaActual para nuevo registro
}

function formatearMonto(monto) {
    // Convierte el monto en un string, separa la parte entera de la decimal si hay decimales
    let partes = monto.toString().split('.');
    let parteEntera = partes[0];
    let parteDecimal = partes[1] ? ',' + partes[1] : '';

    // Añadir los puntos de miles
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retornar la parte entera con puntos de miles y la parte decimal si la hay
    return parteEntera + parteDecimal;
}

// Renderizar las facturas al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderFacturas(); // Renderizar todas las facturas inicialmente
});
