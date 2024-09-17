let ventasEnEspera = [];  // Variable global para ventas en espera

document.addEventListener("DOMContentLoaded", function () {
    // Calcular el total cuando la página carga por primera vez
    calculateTotal();

    // Asignar el evento click al botón de "Poner venta en espera"
    const holdSaleBtn = document.getElementById('holdSaleBtn');
    holdSaleBtn.addEventListener('click', ponerVentaEnEspera);

    // Asignar el evento click al botón de "Cancelar venta"
    const cancelSaleBtn = document.getElementById('cancelSaleBtn');
    cancelSaleBtn.addEventListener('click', cancelarVenta);
});

// Función para calcular el total de la venta
function calculateTotal() {
    const rows = document.querySelectorAll('tbody tr');
    let total = 0;

    rows.forEach(row => {
        const quantity = parseFloat(row.cells[3].innerText);  // Cantidad
        const unitPrice = parseFloat(row.cells[5].innerText.replace('$', '').trim());  // Precio unitario sin el símbolo $

        if (!isNaN(quantity) && !isNaN(unitPrice)) {
            total += quantity * unitPrice;
        }
    });

    document.querySelector('.total-footer-section h4 span').innerText = `$${total.toFixed(2)}`;
}

// Función para eliminar una fila con confirmación
function handleDelete(event) {
    const row = event.target.closest('tr');

    const confirmation = confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmation) {
        row.remove(); // Eliminar la fila
        calculateTotal(); // Recalcular el total
    }
}

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

    const confirmacion = confirm('¿Estás seguro de que deseas poner esta venta en espera?');
    if (confirmacion && productosEnTabla.length > 0) {
        ventasEnEspera.push({
            productos: productosEnTabla,
            fecha: new Date().toLocaleString()  // Guardamos la fecha y hora de la venta
        });

        actualizarListadoVentasEnEspera();
        document.querySelector('tbody').innerHTML = '';
        document.getElementById('totalAmount').textContent = '$0.00';

        alert('Venta puesta en espera correctamente.');
    } else if (!confirmacion) {
        alert('Operación cancelada.');
    } else {
        alert('No hay productos en la venta actual.');
    }
}

// Función para cancelar la venta (con confirmación)
function cancelarVenta() {
    const confirmacion = confirm('¿Estás seguro de que deseas cancelar esta venta? Esto eliminará todos los productos.');
    if (confirmacion) {
        // Limpiar la tabla de productos
        document.querySelector('tbody').innerHTML = '';
        // Reiniciar el total a $0.00
        document.getElementById('totalAmount').textContent = '$0.00';

        alert('Venta cancelada correctamente.');
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
            <div>
                <button class="btn btn-primary btn-sm me-2" onclick="retomarVenta(${index})">Retomar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarVentaEnEspera(${index})">Eliminar</button>
            </div>
        `;
        listaVentas.appendChild(ventaItem);
    });
}

// Función para eliminar una venta en espera
function eliminarVentaEnEspera(indiceVenta) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta venta en espera? Esta acción no se puede deshacer.');
    if (confirmacion) {
        ventasEnEspera.splice(indiceVenta, 1);  // Eliminar la venta en espera del array
        actualizarListadoVentasEnEspera();  // Actualizar la lista visualmente
        alert('Venta en espera eliminada correctamente.');
    }
}

// Función para retomar una venta en espera
function retomarVenta(indiceVenta) {
    const venta = ventasEnEspera[indiceVenta];
    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';

    venta.productos.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${producto.codigo}</td>
            <td>${producto.nombre}</td>
            <td>${parseInt(producto.cantidad)}</td>
            <td>$${parseFloat(producto.precio.replace('$', '')).toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm btn-delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    assignDeleteButtons();  // Asignar la funcionalidad a los botones de eliminar
    calculateTotal();  // Calcular el total de la venta retomada

    alert('Venta retomada correctamente.');
}

// Función para asignar los eventos de eliminar a cada botón
function assignDeleteButtons() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
}

// Manejar la adición de productos
document.addEventListener("DOMContentLoaded", function () {
    const addProductBtn = document.getElementById('addProductBtn');
    
    addProductBtn.addEventListener('click', function() {
        const productCode = document.getElementById('productCode').value;
        const productQuantity = document.getElementById('productQuantity').value;

        // Verifica que se haya ingresado un código de producto
        if (!productCode) {
            alert('Por favor, ingresa un código de producto');
            return;
        }

        // Simular la obtención del producto del backend
        fetch(`https://apimocha.com/producttest/inventory/product/check/codigo_barras=${productCode}`)
            .then(response => response.json())
            .then(product => {
                if (product) {
                    agregarProductoATabla(product, productQuantity);
                } else {
                    alert('Producto no encontrado');
                }
            })
            .catch(error => console.error('Error al obtener el producto:', error));
    });
    // Escuchar la tecla "Enter"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Simular el clic en el botón "Agregar producto"
            event.preventDefault(); // Prevenir comportamiento predeterminado
            event.stopPropagation(); // Detener la propagación del evento
            addProductBtn.click();
        }
    });
});

function agregarProductoATabla(producto, cantidad) {
    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    // Calcula el precio total por la cantidad seleccionada
    const totalPrice = (producto.precio * cantidad).toFixed(2);

    // Crear la nueva fila con los datos del producto, incluyendo la nueva columna de "Unidad de Medida"
    newRow.innerHTML = `
        <td>${tbody.rows.length + 1}</td>
        <td>${producto.producto_id}</td>
        <td>${producto.nombre}</td>
        <td>${cantidad}</td>
        <td>${producto.unidad_medida}</td>  <!-- Columna de Unidad de Medida -->
        <td>$${producto.precio.toFixed(2)}</td>
        <td>
            <button class="btn btn-danger btn-sm btn-delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;

    tbody.appendChild(newRow);

    // Recalcular el total de la venta
    calculateTotal();

    // Asigna la funcionalidad de eliminar a los nuevos botones
    assignDeleteButtons();
}
