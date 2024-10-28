
// Obtener los comprobantes desde localStorage o inicializar un arreglo vacío
const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];
/* Recuperar los comprobantes desde localStorage o simulación si no hay datos
let comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [
    {
        numeroComprobante: '001-001-000000001',
        rucCliente: '0999999999',
        fecha: '2023-10-01',
        montoTotal: 10000,
        tipo: 'factura',
        estado: 'activo'
    },
    {
        numeroComprobante: 'NR-000000001',
        rucCliente: '0988888888',
        fecha: '2023-10-02',
        montoTotal: 25050,
        tipo: 'nota_remision',
        estado: 'activo'
    }

];*/



class Pagination {
    constructor(items, itemsPerPage, renderCallback) {
        this.items = items; // Elementos a paginar
        this.itemsPerPage = itemsPerPage; // Elementos por página
        this.currentPage = 1; // Página actual
        this.renderCallback = renderCallback; // Callback para renderizar los elementos de la página actual

        this.paginationContainer = document.getElementById('pagination'); // Contenedor para los controles
        this.displayPage(); // Mostrar la primera página al inicializar
    }

    // Calcular los elementos de la página actual y llamarlos al callback de renderización
    displayPage() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedItems = this.items.slice(start, end);

        this.renderCallback(paginatedItems); // Renderizar los elementos actuales
        this.updatePaginationControls(); // Actualizar controles de paginación
    }

    // Crear y actualizar los controles de paginación
    updatePaginationControls() {
        const totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        this.paginationContainer.innerHTML = ''; // Limpiar controles existentes

        // Botón "Anterior"
        const prevButton = document.createElement('button');
        prevButton.classList.add('btn', 'btn-secondary', 'me-2');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = this.currentPage === 1;
        prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        this.paginationContainer.appendChild(prevButton);

        // Botones de número de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('btn', 'btn-outline-secondary', 'me-2');
            pageButton.textContent = i;
            pageButton.disabled = i === this.currentPage;
            pageButton.addEventListener('click', () => this.changePage(i));
            this.paginationContainer.appendChild(pageButton);
        }

        // Botón "Siguiente"
        const nextButton = document.createElement('button');
        nextButton.classList.add('btn', 'btn-secondary');
        nextButton.textContent = 'Siguiente';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
        this.paginationContainer.appendChild(nextButton);
    }

    // Cambiar de página
    changePage(pageNumber) {
        this.currentPage = pageNumber;
        this.displayPage();
    }
}

// Inicialización de la paginación
const itemsPerPage = 5;
const pagination = new Pagination(comprobantes, itemsPerPage, displayComprobantes);

// Inicialmente mostrar todos los comprobantes
displayComprobantes(comprobantes);

// Función para mostrar los comprobantes en la tabla
function displayComprobantes(comprobantesList) {
    const comprobantesBody = document.getElementById('comprobantesBody');
    comprobantesBody.innerHTML = ''; // Limpiar las filas existentes

    comprobantesList.forEach((comprobante, index) => {
        const row = document.createElement('tr');

        // Crear celdas
        const numeroComprobanteCell = document.createElement('td');
        numeroComprobanteCell.textContent = comprobante.numeroComprobante;

        const rucClienteCell = document.createElement('td');
        rucClienteCell.textContent = comprobante.rucCliente;

        const fechaCell = document.createElement('td');
        fechaCell.textContent = comprobante.fecha;

        const montoTotalCell = document.createElement('td');
        montoTotalCell.textContent = formatearMonto(comprobante.montoTotal);

        const estadoCell = document.createElement('td');
        estadoCell.textContent = comprobante.estado;

        const tipoCell = document.createElement('td');
        tipoCell.textContent = comprobante.tipo === 'factura' ? 'Factura' : 'Nota de Remisión';

        const accionesCell = document.createElement('td');

        // Botón Ver
        const verButton = document.createElement('button');
        verButton.textContent = 'Ver';
        verButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-1');
        verButton.addEventListener('click', function() {
            verDetalleComprobante(index);
        });

        // Botón Anular
        const anularButton = document.createElement('button');
        anularButton.textContent = 'Anular';
        anularButton.classList.add('btn', 'btn-danger', 'btn-sm');
        anularButton.disabled = comprobante.estado === 'anulado'; // Desactivar si ya está anulado
        anularButton.addEventListener('click', function() {
            anularComprobante(index);
        });

        // Agregar botones a la celda de acciones
        accionesCell.appendChild(verButton);
        accionesCell.appendChild(anularButton);

        // En la función displayComprobantes que muestra las filas de comprobantes
        const generarFacturaButton = document.createElement('button');
        generarFacturaButton.textContent = 'Generar Factura';
        generarFacturaButton.classList.add('btn', 'btn-info', 'btn-sm');
        generarFacturaButton.disabled = comprobante.tipo !== 'nota_remision';
        generarFacturaButton.addEventListener('click', function() {
            generarFacturaDesdeNotaRemision(comprobante);
        });

        // Agregar el botón al cell de acciones solo para notas de remisión
        if (comprobante.tipo === 'nota_remision') {
            accionesCell.appendChild(generarFacturaButton);
        }

        // Agregar celdas a la fila
        row.appendChild(numeroComprobanteCell);
        row.appendChild(rucClienteCell);
        row.appendChild(fechaCell);
        row.appendChild(montoTotalCell);
        row.appendChild(estadoCell);
        row.appendChild(tipoCell);
        row.appendChild(accionesCell);

        // Agregar la fila al cuerpo de la tabla
        comprobantesBody.appendChild(row);
    });
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


// Evento para el campo de búsqueda
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', actualizarListaComprobantes);

// Evento para los botones de filtro por tipo
const filterButtons = document.querySelectorAll('.filter-type');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        actualizarListaComprobantes();
    });
});


// Función para actualizar la lista de comprobantes según el término de búsqueda y filtro de tipo
function actualizarListaComprobantes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const activeFilter = document.querySelector('.filter-type.active').getAttribute('data-type');

    // Filtrar comprobantes por número de comprobante, RUC, y tipo de comprobante
    const filteredComprobantes = comprobantes.filter(comprobante => {
        const matchesSearch = comprobante.numeroComprobante.toLowerCase().includes(searchTerm) ||
                              comprobante.rucCliente.toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilter === 'all' ||
                              (activeFilter === 'factura' && comprobante.tipo === 'factura') ||
                              (activeFilter === 'nota_remision' && comprobante.tipo === 'nota_remision');
        return matchesSearch && matchesFilter;
    });

    if (filteredComprobantes.length === 0) {
        const comprobantesBody = document.getElementById('comprobantesBody');
        comprobantesBody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron comprobantes.</td></tr>';
    } else {
        displayComprobantes(filteredComprobantes);
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

// Función para anular un comprobante en el array simulado
function anularComprobante(index) {
    if (confirm('¿Está seguro de que desea anular este comprobante?')) {
        // Cambiar el estado del comprobante a "anulado" en el array simulado
        comprobantes[index].estado = 'anulado';

        // Actualizar la lista de comprobantes en pantalla
        displayComprobantes(comprobantes);

        alert('Comprobante anulado correctamente.');
    }
}



// Función para ver el detalle de un comprobante
function verDetalleComprobante(index) {
    const comprobante = comprobantes[index];
    alert(`Detalle del comprobante N° ${comprobante.numeroComprobante}:\n\nRUC: ${comprobante.rucCliente}\nFecha: ${comprobante.fecha}\nTotal: ${comprobante.montoTotal}\nTipo: ${comprobante.tipo === 'factura' ? 'Factura' : 'Nota de Remisión'}\nEstado: ${comprobante.estado}`);
}

// Función para generar factura desde nota de remisión
function generarFacturaDesdeNotaRemision(notaRemision) {
    const facturaData = {
        ruc: notaRemision.rucCliente,
        razonSocial: notaRemision.razonSocial,
        fechaEmision: new Date().toISOString().split('T')[0],
        productos: notaRemision.productos || [],
        totalFactura: notaRemision.montoTotal,
        condicionVenta: 'contado', // Asignado por defecto
        direccion: notaRemision.direccion || 'Sin dirección'
    };

    // Guardar los datos en localStorage
    localStorage.setItem('facturaData', JSON.stringify(facturaData));

    // Redireccionar a factura.html para que cargue los datos
    window.location.href = 'factura.html';
}
