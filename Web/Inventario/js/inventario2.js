// Simulación de base de datos de productos
const productosDB = [
    {
        codigo: '123456789',
        nombre: 'Producto A',
        precioCompra: 100,
        precioVenta: 150,
        iva: '10' // Valores posibles: '10', '5', 'exento'
    },
    {
        codigo: '987654321',
        nombre: 'Producto B',
        precioCompra: 200,
        precioVenta: 250,
        iva: '5'
    },
    // Puedes agregar más productos según sea necesario
];

// Función para buscar un producto por código
function buscarProductoPorCodigo(codigo) {
    return productosDB.find(producto => producto.codigo === codigo);
}

// Evento cuando el usuario deja de escribir en el campo del código de barras
document.getElementById('codigoProducto').addEventListener('blur', function () {
    const codigoIngresado = this.value.trim();

    // Verificar si el código ingresado no está vacío
    if (codigoIngresado === '') {
        return;
    }

    const productoEncontrado = buscarProductoPorCodigo(codigoIngresado);

    if (productoEncontrado) {
        // Autocompletar los campos con los datos del producto
        document.getElementById('precioCompra').value = productoEncontrado.precioCompra;
        document.getElementById('precioVenta').value = productoEncontrado.precioVenta;

        // Seleccionar el IVA correspondiente
        const ivaOptions = document.getElementsByName('ivaOptions');
        ivaOptions.forEach(radio => {
            if (radio.value === productoEncontrado.iva) {
                radio.checked = true;
            }
        });

        // Opcional: Puedes mostrar el nombre del producto si tienes un campo para ello
        // document.getElementById('nombreProducto').value = productoEncontrado.nombre;
    } else {
        // Producto no encontrado, abrir el modal para registrar nuevo producto
        abrirModalRegistroProducto(codigoIngresado);
    }
});

// Función para abrir el modal de registro de producto y prellenar el código
function abrirModalRegistroProducto(codigoProducto) {
    // Poner el código en el campo correspondiente en el modal
    document.getElementById('codigoProductoModal').value = codigoProducto;

    // Abrir el modal
    const modalRegistroProducto = new bootstrap.Modal(document.getElementById('modalRegistroProducto'));
    modalRegistroProducto.show();
}

// Evento para guardar el nuevo producto desde el modal
document.getElementById('registrarProductoBtn').addEventListener('click', function () {
    // Obtener los datos ingresados en el modal
    const codigo = document.getElementById('codigoProductoModal').value.trim();
    const nombre = document.getElementById('nombreProductoModal').value.trim();
    const categoria = document.getElementById('categoriaProductoModal').value;
    const unidadMedida = document.getElementById('unidadMedidaModal').value.trim();
    const descripcion = document.getElementById('descripcionProductoModal').value.trim();


    // Crear el nuevo producto
    const nuevoProducto = {
        codigo: codigo,
        nombre: nombre,
        precioCompra: 0,
        precioVenta: 0,
        iva: '10' // Puedes ajustar esto según tus necesidades
    };

    // Agregar el nuevo producto a la "base de datos"
    productosDB.push(nuevoProducto);

    // Cerrar el modal
    const modalRegistroProductoEl = document.getElementById('modalRegistroProducto');
    const modalRegistroProducto = bootstrap.Modal.getInstance(modalRegistroProductoEl);
    modalRegistroProducto.hide();

    // Limpiar los campos del modal
    document.getElementById('formularioRegistroProducto').reset();

    // Autocompletar los campos del formulario principal con el nuevo producto
    document.getElementById('precioCompra').value = '';
    document.getElementById('precioVenta').value = '';

    // Deseleccionar las opciones de IVA
    const ivaOptions = document.getElementsByName('ivaOptions');
    ivaOptions.forEach(radio => {
        radio.checked = false;
    });

    // Opcional: Si tienes un campo para el nombre en el formulario principal
    // document.getElementById('nombreProducto').value = nombre;

    alert('Producto registrado exitosamente. Complete los datos restantes.');
});

// Opcional: Evento para manejar el botón "Agregar Producto"
document.getElementById('agregarProductoBtn').addEventListener('click', function () {
    // Aquí puedes agregar la lógica para agregar el producto a la tabla de productos añadidos
    // Validar que todos los campos necesarios estén completos

    const codigoProducto = document.getElementById('codigoProducto').value.trim();
    const precioCompra = document.getElementById('precioCompra').value.trim();
    const precioVenta = document.getElementById('precioVenta').value.trim();
    const vigenciaPrecio = document.getElementById('vigenciaPrecio').value;
    const ivaSeleccionado = document.querySelector('input[name="ivaOptions"]:checked');


    // Obtener la información de los lotes
    const lotes = [];
    const loteEntries = document.querySelectorAll('.lote-entry');
    loteEntries.forEach((lote, index) => {
        const cantidad = lote.querySelector('.cantidad-lote').value.trim();
        const fechaVencimiento = lote.querySelector('.fecha-vencimiento-lote').value;


        lotes.push({
            cantidad: parseInt(cantidad),
            fechaVencimiento: fechaVencimiento
        });
    });

    // Agregar el producto a la tabla
    agregarProductoATabla({
        codigo: codigoProducto,
        precioCompra: parseFloat(precioCompra),
        precioVenta: parseFloat(precioVenta),
        vigenciaPrecio: vigenciaPrecio || new Date().toISOString().split('T')[0],
        iva: ivaSeleccionado.value,
        lotes: lotes
    });

    // Limpiar el formulario
    document.getElementById('formularioCompra').reset();

    // Opcional: Limpiar los lotes existentes y dejar solo uno
    document.getElementById('lotesContainer').innerHTML = `
        <h5>Lotes</h5>
        <div class="row mb-3 lote-entry">
            <div class="col-md-6">
                <label for="cantidadLote1" class="form-label">Cantidad</label>
                <input type="number" class="form-control cantidad-lote" required>
            </div>
            <div class="col-md-6">
                <label for="fechaVencimientoLote1" class="form-label">Fecha de Vencimiento</label>
                <input type="date" class="form-control fecha-vencimiento-lote" required>
            </div>
        </div>
        <div class="text-end">
            <button type="button" id="agregarLoteBtn" class="btn btn-secondary"><i
                    class="bi bi-plus-circle"></i> Agregar Lote
            </button>
        </div>
    `;
});

function agregarProductoATabla(producto) {
    const tablaBody = document.getElementById('productosBody');
    const fila = document.createElement('tr');

    // Si el nombre no está definido, obtenerlo
    if (!producto.nombre) {
        producto.nombre = obtenerNombreProducto(producto.codigo);
    }

    // Calcular la cantidad total sumando las cantidades de los lotes
    const cantidadTotal = producto.lotes.reduce((total, lote) => total + lote.cantidad, 0);

    fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.nombre}</td>
        <td>${producto.precioCompra}</td>
        <td>${producto.precioVenta}</td>
        <td>${cantidadTotal}</td>
        <td>
            <button class="btn btn-sm btn-primary editar-producto-btn">Editar</button>
            <button class="btn btn-sm btn-danger eliminar-producto-btn">Eliminar</button>
        </td>
    `;

    // Añadir eventos a los botones
    fila.querySelector('.editar-producto-btn').addEventListener('click', function () {
        cargarProductoEnFormulario(producto, fila);
    });

    fila.querySelector('.eliminar-producto-btn').addEventListener('click', function () {
        fila.remove();
    });


    tablaBody.appendChild(fila);
}

// Función para obtener el nombre del producto por código
function obtenerNombreProducto(codigo) {
    const producto = buscarProductoPorCodigo(codigo);
    return producto ? producto.nombre : 'Nombre no disponible';
}

// Evento para agregar más lotes
document.getElementById('lotesContainer').addEventListener('click', function (event) {
    if (event.target.id === 'agregarLoteBtn') {
        agregarLote();
    }
});

// Función para agregar un nuevo lote
function agregarLote() {
    const lotesContainer = document.getElementById('lotesContainer');
    const numLotes = lotesContainer.querySelectorAll('.lote-entry').length + 1;

    const loteHTML = `
        <div class="row mb-3 lote-entry">
            <div class="col-md-6">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-control cantidad-lote" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Fecha de Vencimiento</label>
                <input type="date" class="form-control fecha-vencimiento-lote" required>
            </div>
        </div>
    `;

    // Insertar el nuevo lote antes del botón "Agregar Lote"
    lotesContainer.insertAdjacentHTML('beforeend', loteHTML);
}


function cargarProductoEnFormulario(producto, fila) {
    // Guardamos referencias al producto y fila en edición
    productoEnEdicion = producto;
    filaEnEdicion = fila;

    // Cargamos los datos en el formulario principal
    document.getElementById('codigoProducto').value = producto.codigo;
    document.getElementById('precioCompra').value = producto.precioCompra;
    document.getElementById('precioVenta').value = producto.precioVenta;
    document.getElementById('vigenciaPrecio').value = producto.vigenciaPrecio || '';
    
    // Seleccionamos el IVA correspondiente
    const ivaOptions = document.getElementsByName('ivaOptions');
    ivaOptions.forEach(radio => {
        radio.checked = (radio.value === producto.iva);
    });

    // Cargar lotes
    const lotesContainer = document.getElementById('lotesContainer');
    lotesContainer.innerHTML = '<h5>Lotes</h5>';
    producto.lotes.forEach((lote) => {
        const loteHTML = `
            <div class="row mb-3 lote-entry">
                <div class="col-md-6">
                    <label class="form-label">Cantidad</label>
                    <input type="number" class="form-control cantidad-lote" value="${lote.cantidad}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Fecha de Vencimiento</label>
                    <input type="date" class="form-control fecha-vencimiento-lote" value="${lote.fechaVencimiento}" required>
                </div>
            </div>
        `;
        lotesContainer.insertAdjacentHTML('beforeend', loteHTML);
    });

    // Añadimos el botón de agregar lote nuevamente
    const agregarLoteBtnHTML = `
        <div class="text-end">
            <button type="button" id="agregarLoteBtn" class="btn btn-secondary">
                <i class="bi bi-plus-circle"></i> Agregar Lote
            </button>
        </div>
    `;
    lotesContainer.insertAdjacentHTML('beforeend', agregarLoteBtnHTML);

    // Cambiamos el texto del botón 'Agregar Producto' a 'Guardar Cambios'
    document.getElementById('agregarProductoBtn').textContent = 'Guardar Cambios';
}

document.getElementById('agregarProductoBtn').addEventListener('click', function () {
    if (productoEnEdicion) {
        // Estamos editando un producto existente
        guardarCambiosProducto();
    } else {
        // Agregar un nuevo producto
        agregarNuevoProducto();
    }
});

function guardarCambiosProducto() {
    // Obtener los valores del formulario
    const precioCompra = document.getElementById('precioCompra').value.trim();
    const precioVenta = document.getElementById('precioVenta').value.trim();
    const vigenciaPrecio = document.getElementById('vigenciaPrecio').value;
    const ivaSeleccionado = document.querySelector('input[name="ivaOptions"]:checked');
    
    // Actualizar el objeto producto
    productoEnEdicion.precioCompra = precioCompra;
    productoEnEdicion.precioVenta = precioVenta;
    productoEnEdicion.vigenciaPrecio = vigenciaPrecio || new Date().toISOString().split('T')[0];
    productoEnEdicion.iva = ivaSeleccionado ? ivaSeleccionado.value : productoEnEdicion.iva;

    // Actualizar lotes
    const lotes = [];
    const loteEntries = document.querySelectorAll('.lote-entry');
    loteEntries.forEach((lote) => {
        const cantidad = lote.querySelector('.cantidad-lote').value.trim();
        const fechaVencimiento = lote.querySelector('.fecha-vencimiento-lote').value;
        if (cantidad !== '' && fechaVencimiento !== '') {
            lotes.push({
                cantidad: parseInt(cantidad),
                fechaVencimiento: fechaVencimiento
            });
        }
    });
    productoEnEdicion.lotes = lotes;

    // Actualizar la fila en la tabla
    const cantidadTotal = productoEnEdicion.lotes.reduce((total, lote) => total + lote.cantidad, 0);
    filaEnEdicion.cells[2].textContent = productoEnEdicion.precioCompra;
    filaEnEdicion.cells[3].textContent = productoEnEdicion.precioVenta;
    filaEnEdicion.cells[4].textContent = cantidadTotal;

    // Limpiar el formulario
    document.getElementById('formularioCompra').reset();
    // Restablecer lotes
    document.getElementById('lotesContainer').innerHTML = `
        <h5>Lotes</h5>
        <div class="row mb-3 lote-entry">
            <div class="col-md-6">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-control cantidad-lote" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Fecha de Vencimiento</label>
                <input type="date" class="form-control fecha-vencimiento-lote" required>
            </div>
        </div>
        <div class="text-end">
            <button type="button" id="agregarLoteBtn" class="btn btn-secondary">
                <i class="bi bi-plus-circle"></i> Agregar Lote
            </button>
        </div>
    `;

    // Restablecer variables de edición
    productoEnEdicion = null;
    filaEnEdicion = null;

    // Cambiar el texto del botón a 'Agregar Producto'
    document.getElementById('agregarProductoBtn').textContent = 'Agregar Producto';
}
function agregarNuevoProducto() {
    // Obtener los valores del formulario
    const codigoProducto = document.getElementById('codigoProducto').value.trim();
    const precioCompra = document.getElementById('precioCompra').value.trim();
    const precioVenta = document.getElementById('precioVenta').value.trim();
    const vigenciaPrecio = document.getElementById('vigenciaPrecio').value;
    const ivaSeleccionado = document.querySelector('input[name="ivaOptions"]:checked');

    // Obtener lotes
    const lotes = [];
    const loteEntries = document.querySelectorAll('.lote-entry');
    loteEntries.forEach((lote) => {
        const cantidad = lote.querySelector('.cantidad-lote').value.trim();
        const fechaVencimiento = lote.querySelector('.fecha-vencimiento-lote').value;
        if (cantidad !== '' && fechaVencimiento !== '') {
            lotes.push({
                cantidad: parseInt(cantidad),
                fechaVencimiento: fechaVencimiento
            });
        }
    });

    // Crear el objeto producto
    const nuevoProducto = {
        codigo: codigoProducto,
        nombre: obtenerNombreProducto(codigoProducto),
        precioCompra: precioCompra,
        precioVenta: precioVenta,
        vigenciaPrecio: vigenciaPrecio || new Date().toISOString().split('T')[0],
        iva: ivaSeleccionado ? ivaSeleccionado.value : '',
        lotes: lotes
    };

    // Agregar el producto a la tabla
    agregarProductoATabla(nuevoProducto);

    // Limpiar el formulario
    document.getElementById('formularioCompra').reset();
    // Restablecer lotes
    document.getElementById('lotesContainer').innerHTML = `
        <h5>Lotes</h5>
        <div class="row mb-3 lote-entry">
            <div class="col-md-6">
                <label class="form-label">Cantidad</label>
                <input type="number" class="form-control cantidad-lote" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Fecha de Vencimiento</label>
                <input type="date" class="form-control fecha-vencimiento-lote" required>
            </div>
        </div>
        <div class="text-end">
            <button type="button" id="agregarLoteBtn" class="btn btn-secondary">
                <i class="bi bi-plus-circle"></i> Agregar Lote
            </button>
        </div>
    `;
}
