// Variables para almacenar los productos y los totales
let productos = [];

let totalFactura = 0;
let totalIva5 = 0;
let totalIva10 = 0;
let totalIvaExenta = 0;


// Autocompletar formulario si hay datos guardados
document.addEventListener('DOMContentLoaded', () => {
    const savedFacturaData = JSON.parse(localStorage.getItem('facturaData'));

    if (savedFacturaData) {

        document.getElementById('ruc').value = savedFacturaData.ruc || '';
        document.getElementById('razon_social').value = savedFacturaData.razonSocial || '';
        document.getElementById('fecha_emision').value = savedFacturaData.fechaEmision || '';
        document.getElementById('direccion').value = savedFacturaData.direccion || '';
        document.getElementById('total_factura').value = savedFacturaData.totalFactura || '';

        // Cargar los productos en la tabla
        savedFacturaData.productos.forEach(producto => agregarProductoATabla(producto));

        // Limpiar los datos de localStorage después de cargarlos
        localStorage.removeItem('facturaData');
    }
});


// Función para agregar cada producto a la tabla de productos
function agregarProductoATabla(producto) {
    const tablaBody = document.getElementById('tabla_productos');
    const row = document.createElement('tr');

    // Crear y rellenar celdas con datos del producto
    row.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.valorUnitario}</td>
        <td>${producto.exenta || 0}</td>
        <td>${producto.iva5 || 0}</td>
        <td>${producto.iva10 || 0}</td>
    `;

    // Crear celda para las acciones (Editar y Eliminar)
    const accionesCell = document.createElement('td');

    // Botón Editar
    const editarButton = document.createElement('button');
    editarButton.textContent = 'Editar';
    editarButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    editarButton.addEventListener('click', function() {
        habilitarEdicionFila(row, productos.indexOf(producto));
    });

    // Botón Eliminar
    const eliminarButton = document.createElement('button');
    eliminarButton.textContent = 'Eliminar';
    eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
    eliminarButton.addEventListener('click', function() {
        eliminarProducto(productos.indexOf(producto));
    });

    // Agregar los botones a la celda de acciones
    accionesCell.appendChild(editarButton);
    accionesCell.appendChild(eliminarButton);
    row.appendChild(accionesCell);

    // Agregar la fila al cuerpo de la tabla
    tablaBody.appendChild(row);
}



// Función para agregar producto a la tabla
document.getElementById('agregar_producto').addEventListener('click', function() {
    // Obtener detalles del producto desde los campos de entrada
    const codigo = document.getElementById('codigo_producto').value.trim();
    const descripcion = document.getElementById('descripcion_producto').value.trim();
    const cantidad = parseFloat(document.getElementById('cantidad_producto').value);
    const valorUnitario = parseFloat(document.getElementById('valor_unitario_producto').value);
    const exenta = parseFloat(document.getElementById('exenta_producto').value) || 0;
    const iva5 = parseFloat(document.getElementById('iva_5_producto').value) || 0;
    const iva10 = parseFloat(document.getElementById('iva_10_producto').value) || 0;


    // Calcular el total del producto
    const totalProducto = valorUnitario * cantidad;

     // Crear un objeto del producto
     const producto = {
        codigo,
        descripcion,
        cantidad,
        valorUnitario,
        exenta: exenta > 0 ? totalProducto : 0,
        iva5: iva5 > 0 ? totalProducto : 0,
        iva10: iva10 > 0 ? totalProducto : 0,
        totalProducto
    };

    // Agregar el producto al arreglo
    productos.push(producto);

    // Actualizar la tabla de productos y los totales
    actualizarTablaProductos();
    actualizarTotales();

    // Limpiar los campos de entrada del producto
    limpiarCamposProducto();
});

// Función para actualizar la tabla de productos
function actualizarTablaProductos() {
    const tablaBody = document.getElementById('tabla_productos');
    tablaBody.innerHTML = ''; // Limpiar las filas existentes

    productos.forEach((producto, index) => {
        const row = document.createElement('tr');

        // Crear celdas
        const codigoCell = document.createElement('td');
        codigoCell.textContent = producto.codigo;

        const descripcionCell = document.createElement('td');
        descripcionCell.textContent = producto.descripcion;

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = producto.cantidad;

        const valorUnitarioCell = document.createElement('td');
        valorUnitarioCell.textContent = producto.valorUnitario;

        // Mostrar el total en la columna que corresponda según el tipo de impuesto
        const exentaCell = document.createElement('td');
        exentaCell.textContent = producto.exenta > 0 ? producto.totalProducto.toFixed(2) : '';

        const iva5Cell = document.createElement('td');
        iva5Cell.textContent = producto.iva5 > 0 ? producto.totalProducto.toFixed(2) : '';

        const iva10Cell = document.createElement('td');
        iva10Cell.textContent = producto.iva10 > 0 ? producto.totalProducto.toFixed(2) : '';

        // Crear celda para las acciones (Editar y Eliminar)
        const accionesCell = document.createElement('td');

        // Botón Editar
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
        editarButton.addEventListener('click', function() {
            habilitarEdicionFila(row, index);
        });

        // Botón Eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
        eliminarButton.addEventListener('click', function() {
            eliminarProducto(index);
        });

        // Agregar botones a la celda de acciones
        accionesCell.appendChild(editarButton);
        accionesCell.appendChild(eliminarButton);

        // Agregar celdas a la fila
        row.appendChild(codigoCell);
        row.appendChild(descripcionCell);
        row.appendChild(cantidadCell);
        row.appendChild(valorUnitarioCell);
        row.appendChild(exentaCell);
        row.appendChild(iva5Cell);
        row.appendChild(iva10Cell);
        row.appendChild(accionesCell);

        // Agregar la fila al cuerpo de la tabla
        tablaBody.appendChild(row);
    });
}

// Función para habilitar la edición en línea de una fila
// Función para habilitar la edición en línea de una fila
function habilitarEdicionFila(row, index) {
    const cells = row.querySelectorAll('td');

    // Permitir que las celdas sean editables, excepto las de IVA
    for (let i = 0; i < cells.length - 1; i++) {
        if (i <= 3) { // Hacemos editables solo las primeras cuatro celdas
            cells[i].setAttribute('contenteditable', 'true');
            cells[i].classList.add('editable-cell');
        }
    }

    // Reemplazar los botones de acciones por "Guardar" y "Cancelar"
    const accionesCell = cells[cells.length - 1];
    accionesCell.innerHTML = '';

    const guardarButton = document.createElement('button');
    guardarButton.textContent = 'Guardar';
    guardarButton.classList.add('btn', 'btn-success', 'btn-sm', 'me-2');
    guardarButton.addEventListener('click', function() {
        guardarEdicionFila(row, index);
    });

    const cancelarButton = document.createElement('button');
    cancelarButton.textContent = 'Cancelar';
    cancelarButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    cancelarButton.addEventListener('click', function() {
        cancelarEdicionFila(row, index);
    });

    accionesCell.appendChild(guardarButton);
    accionesCell.appendChild(cancelarButton);
}


// Función para guardar los cambios de edición en una fila
function guardarEdicionFila(row, index) {
    const cells = row.querySelectorAll('td');

    // Obtener los nuevos valores de las celdas
    const codigo = cells[0].textContent.trim();
    const descripcion = cells[1].textContent.trim();
    const cantidad = parseFloat(cells[2].textContent);
    const valorUnitario = parseFloat(cells[3].textContent);
    const exenta = parseFloat(cells[4].textContent) || 0;
    const iva5 = parseFloat(cells[5].textContent) || 0;
    const iva10 = parseFloat(cells[6].textContent) || 0;

    // Calcular el total del producto
    const totalProducto = valorUnitario * cantidad;

    // Asignar el valor al tipo de impuesto correspondiente
    const producto = {
        codigo,
        descripcion,
        cantidad,
        valorUnitario,
        exenta: exenta > 0 ? totalProducto : 0,
        iva5: iva5 > 0 ? totalProducto : 0,
        iva10: iva10 > 0 ? totalProducto : 0,
        totalProducto
    };

    // Actualizar el producto en el arreglo
    productos[index] = producto;

    // Deshabilitar la edición y restaurar botones de acciones
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].setAttribute('contenteditable', 'false');
        cells[i].classList.remove('editable-cell');
    }
    const accionesCell = cells[cells.length - 1];
    accionesCell.innerHTML = '';

    const editarButton = document.createElement('button');
    editarButton.textContent = 'Editar';
    editarButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    editarButton.addEventListener('click', function() {
        habilitarEdicionFila(row, index);
    });

    const eliminarButton = document.createElement('button');
    eliminarButton.textContent = 'Eliminar';
    eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
    eliminarButton.addEventListener('click', function() {
        eliminarProducto(index);
    });

    accionesCell.appendChild(editarButton);
    accionesCell.appendChild(eliminarButton);

    // Actualizar los totales después de guardar
    actualizarTotales();
}


// Función para cancelar la edición en una fila
function cancelarEdicionFila(row, index) {
    const producto = productos[index];
    const cells = row.querySelectorAll('td');

    // Restaurar los valores originales en las celdas
    cells[0].textContent = producto.codigo;
    cells[1].textContent = producto.descripcion;
    cells[2].textContent = producto.cantidad;
    cells[3].textContent = producto.valorUnitario;
    cells[4].textContent = producto.exenta;
    cells[5].textContent = producto.iva5;
    cells[6].textContent = producto.iva10;

    // Deshabilitar la edición de las celdas
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].setAttribute('contenteditable', 'false');
        cells[i].classList.remove('editable-cell');
    }

    // Restaurar los botones de acciones
    const accionesCell = cells[cells.length - 1];
    accionesCell.innerHTML = '';

    const editarButton = document.createElement('button');
    editarButton.textContent = 'Editar';
    editarButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
    editarButton.addEventListener('click', function() {
        habilitarEdicionFila(row, index);
    });

    const eliminarButton = document.createElement('button');
    eliminarButton.textContent = 'Eliminar';
    eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
    eliminarButton.addEventListener('click', function() {
        eliminarProducto(index);
    });

    accionesCell.appendChild(editarButton);
    accionesCell.appendChild(eliminarButton);
}


// Función para actualizar los campos de totales
function actualizarTotales() {
    totalFactura = productos.reduce((sum, prod) => sum + prod.totalProducto, 0);
    totalIva5 = productos.reduce((sum, prod) => sum + (prod.iva5 > 0 ? prod.totalProducto : 0), 0);
    totalIva10 = productos.reduce((sum, prod) => sum + (prod.iva10 > 0 ? prod.totalProducto : 0), 0);
    totalIvaExenta = productos.reduce((sum, prod) => sum + (prod.exenta > 0 ? prod.totalProducto : 0), 0);

    document.getElementById('total_factura').value = totalFactura.toFixed(2);
    document.getElementById('iva_5').value = totalIva5.toFixed(2);
    document.getElementById('iva_10').value = totalIva10.toFixed(2);
    document.getElementById('iva_exenta').value = totalIvaExenta.toFixed(2);
}


// Función para limpiar los campos de entrada del producto
function limpiarCamposProducto() {
    document.getElementById('codigo_producto').value = '';
    document.getElementById('descripcion_producto').value = '';
    document.getElementById('cantidad_producto').value = '';
    document.getElementById('valor_unitario_producto').value = '';
    document.getElementById('exenta_producto').value = '';
    document.getElementById('iva_5_producto').value = '';
    document.getElementById('iva_10_producto').value = '';
    document.getElementById('iva_exenta').value = '';
}

// Función para editar un producto existente
function editarProducto(index) {
    const producto = productos[index];

    // Rellenar los campos de entrada con los datos del producto a editar
    document.getElementById('codigo_producto').value = producto.codigo;
    document.getElementById('descripcion_producto').value = producto.descripcion;
    document.getElementById('cantidad_producto').value = producto.cantidad;
    document.getElementById('valor_unitario_producto').value = producto.valorUnitario;
    document.getElementById('exenta_producto').value = producto.exenta;
    document.getElementById('iva_5_producto').value = producto.iva5;
    document.getElementById('iva_10_producto').value = producto.iva10;

    // Eliminar el producto de la lista y actualizar la tabla y los totales
    productos.splice(index, 1);
    actualizarTablaProductos();
    actualizarTotales();
}

// Función para eliminar un producto de la lista
function eliminarProducto(index) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        productos.splice(index, 1);
        actualizarTablaProductos();
        actualizarTotales();
    }
}

// Manejar el envío del formulario
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Recopilar todos los datos del formulario y los productos
    const facturaData = {
        nroFactura: document.getElementById('nro_factura').value.trim(),
        ruc: document.getElementById('ruc').value.trim(),
        razonSocial: document.getElementById('razon_social').value.trim(),
        fechaEmision: document.getElementById('fecha_emision').value,
        timbrado: document.getElementById('timbrado').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        condicionVenta: document.getElementById('condicion_venta').value,
        productos: productos,  // Todos los productos de la factura
        totalFactura: parseFloat(document.getElementById('total_factura').value) || 0,
        iva5: totalIva5,
        iva10: totalIva10,
        tipo: 'factura' 
    };

    // Obtener las facturas existentes en localStorage
    let comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];

    // Agregar la nueva factura al arreglo de facturas guardadas
    comprobantes.push(facturaData);

    // Guardar el arreglo actualizado en localStorage
    localStorage.setItem('comprobantes', JSON.stringify(comprobantes));

    // Limpiar formulario y datos
    this.reset();
    productos = [];  // Reinicia el arreglo de productos para una nueva factura
    totalFactura = 0;
    totalIva5 = 0;
    totalIva10 = 0;
    actualizarTablaProductos();
    actualizarTotales();

    alert('Factura guardada correctamente.');
});
