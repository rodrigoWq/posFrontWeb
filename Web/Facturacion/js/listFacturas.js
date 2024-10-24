/* Simulated list of invoices
const facturas = [
    {
        numeroFactura: '001-001-000000001',
        rucCliente: '0999999999',
        fecha: '2023-10-01',
        montoTotal: 10000
    },
    {
        numeroFactura: '001-001-000000002',
        rucCliente: '0988888888',
        fecha: '2023-10-02',
        montoTotal: 25050
    },
    {
        numeroFactura: '001-001-000000003',
        rucCliente: '0977777777',
        fecha: '2023-10-03',
        montoTotal: 17575
    },
    // Add more invoices as needed
];*/

// Recuperar las facturas desde localStorage
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];
if (facturas.length === 0) {
    const facturasBody = document.getElementById('facturasBody');
    facturasBody.innerHTML = '<tr><td colspan="5" class="text-center">No hay facturas registradas.</td></tr>';
} else {
    // Inicialmente mostrar todas las facturas
    displayFacturas(facturas);
}


// Función para mostrar las facturas en la tabla
function displayFacturas(facturasList) {
    const facturasBody = document.getElementById('facturasBody');
    facturasBody.innerHTML = ''; // Limpiar las filas existentes

    facturasList.forEach((factura, index) => {
        const row = document.createElement('tr');

        // Crear celdas
        const numeroFacturaCell = document.createElement('td');
        numeroFacturaCell.textContent = factura.nroFactura;

        const rucClienteCell = document.createElement('td');
        rucClienteCell.textContent = factura.ruc;

        const fechaCell = document.createElement('td');
        fechaCell.textContent = factura.fechaEmision;

        const montoTotalCell = document.createElement('td');
        montoTotalCell.textContent = formatearMonto(factura.totalFactura);

        const accionesCell = document.createElement('td');

        // Botón Ver
        const verButton = document.createElement('button');
        verButton.textContent = 'Ver';
        verButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-1');
        verButton.addEventListener('click', function() {
            verDetalleFactura(index);
        });

        // Botón Eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Anular';
        eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
        eliminarButton.addEventListener('click', function() {
            eliminarFactura(index);
        });

        // Agregar botones a la celda de acciones
        accionesCell.appendChild(verButton);
        accionesCell.appendChild(eliminarButton);

        // Agregar celdas a la fila
        row.appendChild(numeroFacturaCell);
        row.appendChild(rucClienteCell);
        row.appendChild(fechaCell);
        row.appendChild(montoTotalCell);
        row.appendChild(accionesCell);

        // Agregar la fila al cuerpo de la tabla
        facturasBody.appendChild(row);
    });
}


// Initially display all invoices
displayFacturas(facturas);

// Evento para el campo de búsqueda
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', function() {
    actualizarListaFacturas();
});

// Función para actualizar la lista de facturas según el término de búsqueda
function actualizarListaFacturas() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    // Filtrar facturas por número de factura o RUC
    const filteredFacturas = facturas.filter(factura => {
        return factura.nroFactura.toLowerCase().includes(searchTerm) ||
               factura.ruc.toLowerCase().includes(searchTerm);
    });

    if (filteredFacturas.length === 0) {
        const facturasBody = document.getElementById('facturasBody');
        facturasBody.innerHTML = '<tr><td colspan="5" class="text-center">No se encontraron facturas.</td></tr>';
    } else {
        displayFacturas(filteredFacturas);
    }
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

// Función para eliminar una factura
function eliminarFactura(index) {
    if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
        // Eliminar la factura del arreglo
        facturas.splice(index, 1);

        // Actualizar el localStorage con el arreglo modificado
        localStorage.setItem('facturas', JSON.stringify(facturas));

        // Actualizar la lista de facturas según el término de búsqueda actual
        actualizarListaFacturas();

        alert('Factura eliminada correctamente.');
    }
}



function verDetalleFactura(index) {
    const factura = facturas[index];
    alert(`Detalle de la factura N° ${factura.nroFactura}:\n\nRUC: ${factura.ruc}\nRazón Social: ${factura.razonSocial}\nFecha de Emisión: ${factura.fechaEmision}\nTotal Factura: ${factura.totalFactura}`);
    // Aquí puedes implementar una mejor visualización, como abrir una nueva página o mostrar un modal.
}