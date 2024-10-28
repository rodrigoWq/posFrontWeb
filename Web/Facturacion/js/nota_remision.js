// Variables para almacenar los productos de la nota de remisión
let productos = [];

// Función para agregar producto a la tabla
document.getElementById('agregar_producto').addEventListener('click', function() {
    // Obtener detalles del producto desde los campos de entrada
    const codigo = document.getElementById('codigo_producto').value.trim();
    const cantidad = parseFloat(document.getElementById('cantidad_mercaderia').value);
    const unidadMedida = document.getElementById('unidad_medida_mercaderia').value.trim();
    const descripcion = document.getElementById('descripcion_mercaderia').value.trim();


    // Crear un objeto del producto
    const producto = {
        codigo,
        cantidad,
        unidadMedida,
        descripcion
    };

    // Agregar el producto al arreglo
    productos.push(producto);

    // Actualizar la tabla de productos
    actualizarTablaProductos();

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

        // Crear celdas
        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = producto.cantidad;

        const unidadMedidaCell = document.createElement('td');
        unidadMedidaCell.textContent = producto.unidadMedida;

        const descripcionCell = document.createElement('td');
        descripcionCell.textContent = producto.descripcion;

        // Crear celda para las acciones (Eliminar)
        const accionesCell = document.createElement('td');

        // Botón Eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm');
        eliminarButton.addEventListener('click', function() {
            eliminarProducto(index);
        });

        // Agregar botón a la celda de acciones
        accionesCell.appendChild(eliminarButton);

        // Agregar celdas a la fila
        row.appendChild(codigoCell);
        row.appendChild(cantidadCell);
        row.appendChild(unidadMedidaCell);
        row.appendChild(descripcionCell);
        row.appendChild(accionesCell);

        // Agregar la fila al cuerpo de la tabla
        tablaBody.appendChild(row);
    });
}

// Función para limpiar los campos de entrada del producto
function limpiarCamposProducto() {
    document.getElementById('codigo_producto').value = '';
    document.getElementById('cantidad_mercaderia').value = '';
    document.getElementById('unidad_medida_mercaderia').value = '';
    document.getElementById('descripcion_mercaderia').value = '';
}

// Función para eliminar un producto de la lista
function eliminarProducto(index) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        productos.splice(index, 1);
        actualizarTablaProductos();
    }
}
// Guardar la nota de remisión en localStorage al hacer clic en el botón "Guardar Nota de Remisión"
document.getElementById('guardarNotaRemision').addEventListener('click', function() {
    // Obtener los datos de la nota de remisión
    const numeroComprobante = document.getElementById('nro_nota_remision').value.trim(); // Asegúrate de tener este campo en el HTML
    const rucCliente = document.getElementById('ruc').value.trim(); // Asegúrate de tener este campo en el HTML
    const fecha = document.getElementById('fecha_emision').value; // Asegúrate de tener este campo en el HTML
    const tipo = 'nota_remision';
    const razonSocial = document.getElementById('razon_social').value;
    const timbrado = document.getElementById('timbrado').value;
    const estado = 'activo';
    const montoTotal = 0; // Ajusta este valor si tienes un cálculo para el monto total de productos

    // Crear el objeto de la nota de remisión
    const notaRemision = {
        numeroComprobante,
        rucCliente,
        fecha,
        montoTotal,
        estado,
        tipo,
        productos,
        timbrado,
        razonSocial
    };

    // Obtener las notas de remisión existentes en localStorage o inicializar una lista vacía
    const comprobantes = JSON.parse(localStorage.getItem('comprobantes')) || [];

    // Agregar la nueva nota de remisión a la lista
    comprobantes.push(notaRemision);

    // Guardar la lista actualizada en localStorage
    localStorage.setItem('comprobantes', JSON.stringify(comprobantes));

    alert('Nota de remisión guardada correctamente.');

    // Limpiar los datos después de guardar
    productos = []; // Vaciar la lista de productos
    actualizarTablaProductos(); // Limpiar la tabla de productos
});
