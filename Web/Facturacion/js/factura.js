let productos = [];  // Array para almacenar los productos agregados
let productoActual = null;  // Variable para almacenar el índice del producto que se está editando

document.getElementById('agregar_producto').addEventListener('click', function() {
    // Capturamos los valores de los inputs
    const codigo = document.getElementById('codigo_producto').value;
    const descripcion = document.getElementById('descripcion_producto').value;
    const cantidad = document.getElementById('cantidad_producto').value;
    const valor_unitario = document.getElementById('valor_unitario_producto').value;
    const exenta = document.getElementById('exenta_producto').value;
    const iva_5 = document.getElementById('iva_5_producto').value;
    const iva_10 = document.getElementById('iva_10_producto').value;

    // Validamos que todos los campos estén llenos
    if (!codigo || !descripcion || !cantidad || !valor_unitario) {
        alert("Por favor completa todos los campos");
        return;
    }

    if (productoActual === null) {
        // Creamos un nuevo producto
        const producto = {
            codigo,
            descripcion,
            cantidad,
            valor_unitario,
            exenta,
            iva_5,
            iva_10
        };
        productos.push(producto);  // Agregamos el producto al array
    } else {
        // Actualizamos el producto existente
        productos[productoActual] = {
            codigo,
            descripcion,
            cantidad,
            valor_unitario,
            exenta,
            iva_5,
            iva_10
        };
        productoActual = null;  // Reiniciamos la variable para futuras ediciones
    }

    // Limpiamos los inputs
    limpiarInputs();

    // Mostramos los productos en la tabla
    mostrarProductos();
});

function limpiarInputs() {
    document.getElementById('codigo_producto').value = '';
    document.getElementById('descripcion_producto').value = '';
    document.getElementById('cantidad_producto').value = '';
    document.getElementById('valor_unitario_producto').value = '';
    document.getElementById('exenta_producto').value = '';
    document.getElementById('iva_5_producto').value = '';
    document.getElementById('iva_10_producto').value = '';
}

// Función para mostrar los productos en la tabla
function mostrarProductos() {
    const tablaProductos = document.getElementById('tabla_productos');
    tablaProductos.innerHTML = '';  // Limpiamos la tabla

    productos.forEach((producto, index) => {
        const fila = `<tr id="fila_${index}">
            <td><input type="text" id="codigo_${index}" value="${producto.codigo}" disabled></td>
            <td><input type="text" id="descripcion_${index}" value="${producto.descripcion}" disabled></td>
            <td><input type="text" id="cantidad_${index}" value="${producto.cantidad}" disabled></td>
            <td><input type="text" id="valor_unitario_${index}" value="${producto.valor_unitario}" disabled></td>
            <td><input type="text" id="exenta_${index}" value="${producto.exenta}" disabled></td>
            <td><input type="text" id="iva_5_${index}" value="${producto.iva_5}" disabled></td>
            <td><input type="text" id="iva_10_${index}" value="${producto.iva_10}" disabled></td>
            <td>
                <button class="btn btn-primary btn-sm" id="editar_${index}" onclick="habilitarEdicion(${index})">✏️ Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
            </td>
        </tr>`;
        tablaProductos.innerHTML += fila;  // Agregamos la fila a la tabla
    });
}

// Función para habilitar la edición de una fila
function habilitarEdicion(index) {
    // Habilitar los inputs de la fila seleccionada
    document.getElementById(`codigo_${index}`).disabled = true;
    document.getElementById(`descripcion_${index}`).disabled = false;
    document.getElementById(`cantidad_${index}`).disabled = false;
    document.getElementById(`valor_unitario_${index}`).disabled = false;
    document.getElementById(`exenta_${index}`).disabled = false;
    document.getElementById(`iva_5_${index}`).disabled = false;
    document.getElementById(`iva_10_${index}`).disabled = false;

    // Cambiar el botón de "Editar" a "Guardar"
    document.getElementById(`editar_${index}`).textContent = "Guardar";
    document.getElementById(`editar_${index}`).setAttribute('onclick', `guardarCambios(${index})`);
}

// Función para guardar los cambios después de editar
function guardarCambios(index) {
    // Capturamos los nuevos valores de los inputs
    const codigo = document.getElementById(`codigo_${index}`).value;
    const descripcion = document.getElementById(`descripcion_${index}`).value;
    const cantidad = document.getElementById(`cantidad_${index}`).value;
    const valor_unitario = document.getElementById(`valor_unitario_${index}`).value;
    const exenta = document.getElementById(`exenta_${index}`).value;
    const iva_5 = document.getElementById(`iva_5_${index}`).value;
    const iva_10 = document.getElementById(`iva_10_${index}`).value;

    // Actualizamos el array de productos con los nuevos valores
    productos[index] = {
        codigo,
        descripcion,
        cantidad,
        valor_unitario,
        exenta,
        iva_5,
        iva_10
    };

    // Deshabilitar los inputs nuevamente
    document.getElementById(`codigo_${index}`).disabled = true;
    document.getElementById(`descripcion_${index}`).disabled = true;
    document.getElementById(`cantidad_${index}`).disabled = true;
    document.getElementById(`valor_unitario_${index}`).disabled = true;
    document.getElementById(`exenta_${index}`).disabled = true;
    document.getElementById(`iva_5_${index}`).disabled = true;
    document.getElementById(`iva_10_${index}`).disabled = true;

    // Cambiar el botón de "Guardar" a "Editar"
    document.getElementById(`editar_${index}`).textContent = "✏️ Editar";
    document.getElementById(`editar_${index}`).setAttribute('onclick', `habilitarEdicion(${index})`);
}

// Función para eliminar un producto
function eliminarProducto(index) {
    productos.splice(index, 1);  // Elimina el producto del array
    mostrarProductos();  // Actualiza la tabla después de eliminar
}
