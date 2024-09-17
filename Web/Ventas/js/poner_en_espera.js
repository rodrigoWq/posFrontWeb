let ventasEnEspera = [];

// Función para obtener los productos de la tabla
function obtenerProductosDeLaTabla() {
    const filas = document.querySelectorAll('tbody tr');
    const productos = [];

    filas.forEach(fila => {
        const codigo = fila.cells[1].textContent;
        const nombre = fila.cells[2].textContent;
        const cantidad = fila.cells[3].textContent;
        const precio = fila.cells[4].textContent;

        productos.push({
            codigo: codigo,
            nombre: nombre,
            cantidad: cantidad,
            precio: precio
        });
    });

    return productos;
}

// Función para poner la venta en espera
function ponerVentaEnEspera() {
    const productosEnTabla = obtenerProductosDeLaTabla();
    if (productosEnTabla.length > 0) {
        ventasEnEspera.push({
            productos: productosEnTabla,
            fecha: new Date().toLocaleString()  // Guardamos la fecha y hora de la venta
        });

        // Actualizar el listado de ventas en espera
        actualizarListadoVentasEnEspera();

        // Limpiar la tabla después de poner en espera
        document.querySelector('tbody').innerHTML = '';
        document.getElementById('totalAmount').textContent = '$0.00';

        alert('Venta puesta en espera correctamente.');
    } else {
        alert('No hay productos en la venta actual.');
    }
}

// Función para actualizar el listado de ventas en espera
function actualizarListadoVentasEnEspera() {
    const listaVentas = document.getElementById('onHoldSalesList');
    listaVentas.innerHTML = '';

    ventasEnEspera.forEach((venta, index) => {
        const ventaItem = document.createElement('li');
        ventaItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        ventaItem.innerHTML = `
            Venta del ${venta.fecha}
            <button class="btn btn-primary btn-sm" onclick="retomarVenta(${index})">Retomar</button>
        `;
        listaVentas.appendChild(ventaItem);
    });
}

function retomarVenta(indiceVenta) {
    const venta = ventasEnEspera[indiceVenta];
    const tbody = document.querySelector('tbody');

    // Limpiar la tabla actual
    tbody.innerHTML = '';

    // Agregar los productos de la venta en espera a la tabla
    venta.productos.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${parseInt(producto.cantidad)}</td>
            <td>$${parseFloat(producto.precio).toFixed(2)}</td>
            <td>
                <button class="btn btn-primary btn-sm btn-edit">Editar</button>
                <button class="btn btn-danger btn-sm btn-cancel">Cancelar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Reasignar eventos a los botones de editar y cancelar
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.btn-cancel').forEach(button => {
        button.addEventListener('click', handleCancel);
    });

    // Calcular el total de la venta retomada
    calculateTotal();

    // Cerrar el modal de ventas en espera
    const modal = bootstrap.Modal.getInstance(document.getElementById('onHoldSalesModal'));
    modal.hide();

    alert('Venta retomada correctamente.');
}


// Función para calcular el total de la venta
function calculateTotal() {
    const rows = document.querySelectorAll('tbody tr');
    let total = 0;

    rows.forEach(row => {
        // Obtener la cantidad de la fila (asegúrate de que sea un número)
        const quantity = parseFloat(row.cells[3].innerText);  
        // Obtener el precio unitario y eliminar cualquier símbolo de '$'
        const unitPrice = parseFloat(row.cells[4].innerText.replace('$', '').trim());

        // Verificar si los valores se pueden convertir correctamente a números
        if (!isNaN(quantity) && !isNaN(unitPrice)) {
            const subtotal = quantity * unitPrice;
            total += subtotal;  // Acumular el subtotal al total
        }
    });

    // Actualizar el valor del total en el DOM
    document.querySelector('.total-footer-section h4 span').innerText = `$${total.toFixed(2)}`;
}

