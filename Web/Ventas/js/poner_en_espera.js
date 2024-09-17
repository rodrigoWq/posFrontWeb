let ventasEnEspera = [];  // Variable global para ventas en espera


// Escuchar cuando se abre el modal de "Ventas en Espera"
document.getElementById('onHoldSalesModal').addEventListener('show.bs.modal', function () {
    obtenerVentasEnEspera().then(ventas => {
        // Llenar el array ventasEnEspera con los datos recibidos del backend
        ventasEnEspera = ventas;
        actualizarListadoVentasEnEspera();  // Llenar la lista en el modal
    });
});



function obtenerVentasEnEspera() {
    return fetch('https://apimocha.com/producttest/obtenerLista/pending/id=33')  // Reemplaza con la URL del backend
        .then(response => response.json())
        .then(data => {
            return data.ventas;  // Suponiendo que el backend devuelve un array de ventas en "ventas"
        })
        .catch(error => {
            console.error('Error al obtener ventas en espera:', error);
            return [];
        });
}

// Función para obtener los productos de la tabla
function obtenerProductosDeLaTabla() {
    const filas = document.querySelectorAll('tbody tr');
    const productos = [];

    filas.forEach(fila => {
        const codigo = fila.cells[1].textContent;  // Código del producto (producto_id)
        const nombre = fila.cells[2].textContent;
        const cantidad = fila.cells[3].textContent;
        const unidadMedida = fila.cells[4].textContent;  // Unidad de medida
        const precio = fila.cells[5].textContent.replace('$', '').trim();  // Precio sin el símbolo $

        productos.push({
            codigo: codigo,  // producto_id
            nombre: nombre,
            cantidad: parseInt(cantidad),
            unidad_medida: unidadMedida,
            precio: parseFloat(precio)
        });
    });

    return productos;
}


// Función para poner la venta en espera
function ponerVentaEnEspera() {
    const productosEnTabla = obtenerProductosDeLaTabla();  // Obtener los productos de la tabla
    const confirmacion = confirm('¿Estás seguro de que deseas poner esta venta en espera?');
    if (confirmacion && productosEnTabla.length > 0) {
        const cliente_id = 1;  // ID del cliente (puedes ajustarlo según tu lógica)
        const monto_total = calculateTotal();  // Calcular el monto total
        const fecha_venta = new Date().toISOString().slice(0, 10);  // Formato de fecha (YYYY-MM-DD)

        // Estructura de los datos a enviar al backend
        const data = {
            venta_id: null,  // o el ID si estás retomando la venta
            cliente_id: cliente_id,
            items_venta: productosEnTabla.map(producto => ({
                producto_id: producto.codigo,  // Asumimos que "codigo" es el "producto_id"
                cantidad: producto.cantidad,
                precio: producto.precio,
                unidad_medida: producto.unidad_medida
            })),
            monto_total: monto_total,
            fecha_venta: fecha_venta
        };

        // Enviar los datos al backend
        fetch('https://apimocha.com/example122/sales/pending', {  // Reemplaza con la URL correcta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Venta puesta en espera correctamente.');

                // Limpiar la tabla después de poner en espera
                document.querySelector('tbody').innerHTML = '';
                document.getElementById('totalAmount').textContent = '$0.00';

                // Actualizar el listado de ventas en espera (opcional)
                actualizarListadoVentasEnEspera();
            } else {
                alert('Error al poner la venta en espera.');
            }
        })
        .catch(error => {
            console.error('Error al poner la venta en espera:', error);
            alert('Hubo un error al poner la venta en espera.');
        });
    } 

}


function retomarVenta(ventaId) {
    // Realizar la petición al backend para obtener los detalles de la venta en espera
    fetch(`https://apimocha.com/example122/sales/pending/id=12356`)  // Reemplaza con la URL correcta
        .then(response => response.json())
        .then(data => {
            const venta = data;  // La respuesta completa de la venta
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';  // Limpiar la tabla de productos existente

            // Iterar sobre los productos de la venta
            venta.items_venta.forEach((producto, index) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${producto.codigo_barras}</td>
                    <td>${producto.nombre_producto}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad_medida}</td>  <!-- Mostrar la unidad de medida -->
                    <td>$${producto.precio_unitario.toFixed(2)}</td>  <!-- Mostrar el precio unitario -->
                    <td>
                        <button class="btn btn-danger btn-sm btn-delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(fila);
            });

            // Asignar eventos de eliminar a los botones
            assignDeleteButtons();
            calculateTotal();  // Recalcular el total basado en los productos retomados

            // Mostrar la información del cliente (opcional)
            //document.getElementById('clientName').innerText = `${venta.nombre_cliente} ${venta.apellido_cliente}`;
            //document.getElementById('clientDocument').innerText = `Documento: ${venta.documento}`;
        })
        .catch(error => {
            console.error('Error al retomar la venta:', error);
            alert('Hubo un error al retomar la venta.');
        });
}



