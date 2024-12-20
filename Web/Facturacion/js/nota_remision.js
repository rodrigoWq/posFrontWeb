// Variables para almacenar los productos de la nota de remisión
let productos = [];

// Cargar la base de datos de productos desde localStorage o inicializar con algunos productos de ejemplo
let productDatabase = JSON.parse(localStorage.getItem('productDatabase')) || [
    {
        codigo: '12345',
        descripcion: 'Producto A',
        unidadMedida: 'kg'
    },
    {
        codigo: '54321',
        descripcion: 'Producto B',
        unidadMedida: 'lt'
    },
];

// Función para agregar producto a la tabla
document.getElementById('agregar_producto').addEventListener('click', function() {
    // Obtener detalles del producto desde los campos de entrada
    const codigo = document.getElementById('codigo_producto').value.trim();
    const descripcion = document.getElementById('descripcion_producto').value.trim();
    const cantidad = parseFloat(document.getElementById('cantidad_producto').value);
    const unidadMedida = document.getElementById('unidad_medida_producto').value.trim();


    // Crear un objeto del producto
    const producto = {
        codigo,
        descripcion,
        cantidad,
        unidadMedida
    };

    // Agregar el producto al arreglo de productos de la nota de remisión
    productos.push(producto);

    // Verificar si el producto ya existe en la base de datos
    const existingProduct = productDatabase.find(p => p.codigo === codigo);
    if (!existingProduct) {
        // Producto nuevo, agregar a la base de datos
        const newProduct = {
            codigo,
            descripcion,
            unidadMedida
        };
        productDatabase.push(newProduct);
        // Guardar la base de datos actualizada en localStorage
        localStorage.setItem('productDatabase', JSON.stringify(productDatabase));
        alert('Producto registrado en la base de datos.');
    }

    // Actualizar la tabla de productos y los totales
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

        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = producto.cantidad;

        const unidadMedidaCell = document.createElement('td');
        unidadMedidaCell.textContent = producto.unidadMedida;

        const descripcionCell = document.createElement('td');
        descripcionCell.textContent = producto.descripcion;

        // Crear celda para las acciones (Editar y Eliminar)
        const accionesCell = document.createElement('td');

        // Botón Editar
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2', 'btn-accion');
        editarButton.addEventListener('click', function() {
            habilitarEdicionFila(row, index);
        });

        // Botón Eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-accion');
        eliminarButton.addEventListener('click', function() {
            eliminarProducto(index);
        });

        // Agregar botones a la celda de acciones
        accionesCell.appendChild(editarButton);
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
// Función para habilitar la edición en línea de una fila
function habilitarEdicionFila(row, index) {
    // Obtener las celdas de la fila
    const cells = row.querySelectorAll('td');

    // Hacer que las celdas sean editables excepto la última (acciones)
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].setAttribute('contenteditable', 'true');
        cells[i].classList.add('editable-cell');
    }

    // Reemplazar botones de acciones por "Guardar" y "Cancelar"
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
    const cantidad = parseFloat(cells[1].textContent);
    const unidadMedida = cells[2].textContent.trim();
    const descripcion = cells[3].textContent.trim();

    // Actualizar el producto en el arreglo
    productos[index] = {
        codigo,
        cantidad,
        unidadMedida,
        descripcion
    };

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

// Función para cancelar la edición en una fila
function cancelarEdicionFila(row, index) {
    const producto = productos[index];
    const cells = row.querySelectorAll('td');

    // Restaurar los valores originales en las celdas
    cells[0].textContent = producto.codigo;
    cells[1].textContent = producto.cantidad;
    cells[2].textContent = producto.unidadMedida;
    cells[3].textContent = producto.descripcion;

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

// Función para limpiar los campos de entrada del producto
function limpiarCamposProducto() {
    document.getElementById('codigo_producto').value = '';
    document.getElementById('descripcion_producto').value = '';
    document.getElementById('cantidad_producto').value = '';
    document.getElementById('unidad_medida_producto').value = '';
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
    const numeroComprobante = document.getElementById('nro_nota_remision').value.trim();
    const rucCliente = document.getElementById('ruc').value.trim();
    const fecha = document.getElementById('fecha_emision').value;
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
    document.querySelector('form').reset(); // Limpiar el formulario
});

// Event listener para cuando se pierde el foco en el campo de código de producto
document.getElementById('codigo_producto').addEventListener('blur', function() {
    const codigo = this.value.trim();
    if (codigo) {
        // Buscar el producto en la base de datos
        const product = productDatabase.find(p => p.codigo === codigo);
        if (product) {
            // Producto encontrado, autocompletar los campos
            document.getElementById('descripcion_producto').value = product.descripcion;
            document.getElementById('unidad_medida_producto').value = product.unidadMedida;
        } else {
            // Producto no encontrado, permitir al usuario ingresar los detalles
            alert('Producto no encontrado. Por favor, ingrese los datos del producto para registrarlo.');

            new bootstrap.Modal(document.getElementById('modalRegistrarProducto')).show();
            // Limpiar los campos para que el usuario pueda ingresar los datos
            document.getElementById('descripcion_producto').value = '';
            document.getElementById('unidad_medida_producto').value = '';
        }
    }
});

// Guardar el nuevo producto desde el modal
document.getElementById('guardarNuevoProducto').addEventListener('click', function() {
    const nuevoCodigo = document.getElementById('nuevoCodigo').value.trim();
    const nuevaDescripcion = document.getElementById('nuevaDescripcion').value.trim();
    const nuevaUnidadMedida = document.getElementById('nuevaUnidadMedida').value.trim();

    if (nuevoCodigo && nuevaDescripcion && nuevaUnidadMedida) {
        // Agregar el nuevo producto a la base de datos local
        const newProduct = {
            codigo: nuevoCodigo,
            descripcion: nuevaDescripcion,
            unidadMedida: nuevaUnidadMedida
        };
        productDatabase.push(newProduct);
        localStorage.setItem('productDatabase', JSON.stringify(productDatabase));

        alert('Producto registrado correctamente.');
        document.getElementById('formRegistrarProducto').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalRegistrarProducto')).hide();
    } else {
        alert('Por favor, complete todos los campos.');
    }
});