// Limpiar el formulario y resultados cuando se abre el modal
/*const searchProductModal = document.getElementById('searchProductModal');
searchProductModal.addEventListener('shown.bs.modal', function () {
    // Limpiar los campos de entrada del formulario
    document.getElementById('productCodeSearch').value = '';
    document.getElementById('productNameSearch').value = '';

    // Limpiar los resultados de la búsqueda
    document.getElementById('searchResult').innerHTML = '';
});*/

// Lógica para buscar el producto
document.getElementById('searchProductBtn').addEventListener('click', buscarProducto);

// También capturamos la tecla 'Enter' en los campos del formulario
document.getElementById('productCodeSearch').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Evitar que se envíe el formulario automáticamente
        event.stopPropagation();
        buscarProducto();  // Llamamos a la función para buscar el producto
    }
});

document.getElementById('productNameSearch').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Evitar que se envíe el formulario automáticamente
        event.stopPropagation(); // Detener la propagación del evento
        buscarProducto();  // Llamamos a la función para buscar el producto
    }
});

// Función que maneja la búsqueda del producto
async function buscarProducto() {
    const codigo = document.getElementById('productCodeSearch').value.trim();
    const nombre = document.getElementById('productNameSearch').value.trim();
    const searchResult = document.getElementById('searchResult');

    // Limpiar resultados anteriores
    searchResult.innerHTML = '';

    if (codigo) {
        // Si hay código, buscamos por código
        try {
            const response = await fetch(`https://apimocha.com/posdespensav1/inventory/product/check/${codigo}`);

            if (!response.ok) {
                throw new Error('Error al consultar el producto por código');
            }

            const producto = await response.json();

            if (producto) {
                mostrarProducto(producto);
            } else {
                mostrarMensajeError('Producto no encontrado con el código proporcionado.');
            }

        } catch (error) {
            console.error('Error:', error);
            mostrarMensajeError('Ocurrió un error al consultar el producto por código.');
        }
    } else if (nombre) {
        // Si no hay código pero hay nombre, buscamos por nombre
        try {
            // Supongamos que la API soporta búsqueda por nombre en esta URL
            const response = await fetch(`https://apimocha.com/producttest/inventory/product/check/nombre=${encodeURIComponent(nombre)}`);

            if (!response.ok) {
                throw new Error('Error al consultar el producto por nombre');
            }

            const producto = await response.json();

            if (producto) {
                mostrarProducto(producto);
            } else {
                mostrarMensajeError('Producto no encontrado con el nombre proporcionado.');
            }

        } catch (error) {
            console.error('Error:', error);
            mostrarMensajeError('Ocurrió un error al consultar el producto por nombre.');
        }
    } else {
        // Si ambos campos están vacíos
        searchResult.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Por favor, ingresa el código o el nombre del producto.
            </div>
        `;
    }
}

// Función para mostrar el producto en los resultados
function mostrarProducto(producto) {
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = `
        <div class="alert alert-success" role="alert">
            <strong>Producto encontrado:</strong> <br>
            <strong>Nombre:</strong> ${producto.nombre} <br>
            <strong>Código:</strong> ${producto.codigo_barras} <br>
            <strong>Precio:</strong> $${producto.precio.toFixed(2)}<br>
            <strong>Stock disponible:</strong> ${producto.stock_disponible} <br>
            <strong>Unidad medida:</strong> ${producto.unidad_medida} <br>
        </div>
    `;
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    const searchResult = document.getElementById('searchResult');
    searchResult.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${mensaje}
        </div>
    `;
}
