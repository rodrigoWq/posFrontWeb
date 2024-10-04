document.addEventListener("DOMContentLoaded", function () {
    // URL de la página de login
    const sessionManager = new SessionManager('index.html'); 
    sessionManager.init(); // Iniciar verificación de sesión y manejo de historial
    
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

        // Convertimos la fecha completa en un objeto Date para extraer tanto la fecha como la hora
        const fechaCompleta = new Date(venta.fecha);
        const fecha = fechaCompleta.toLocaleDateString();  // Extraer la fecha en formato local
        const hora = fechaCompleta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // Extraer la hora en formato de 2 dígitos


        const ventaItem = document.createElement('li');
        ventaItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        ventaItem.innerHTML = `
            Venta del ${fecha} a las ${hora}
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
                    console.log(product)
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
//Cerrar Session
document.addEventListener('DOMContentLoaded', function() {
    const closeSessionBtn = document.getElementById('closeSessionBtn');

    closeSessionBtn.addEventListener('click', function() {
        // Mostrar advertencia para confirmar cierre de sesión
        const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
        
        if (confirmLogout) {
            // Eliminar token o cualquier información de sesión
            localStorage.removeItem('token');
            localStorage.removeItem('rol_id');
            
            // Redirigir al usuario a la pantalla de login
            window.location.href = '../../index.html';
        }
    });
});

// Función para confirmar la venta
async function confirmarVenta() {
    const productosEnTabla = obtenerProductosDeLaTabla();
    const rucCliente = document.getElementById('rucCliente').value;

    if (!rucCliente) {
        alert('Por favor, ingresa el RUC o CI del cliente.');
        return;
    }

    if (productosEnTabla.length === 0) {
        alert('No hay productos en la venta actual.');
        return;
    }

    const montoTotal = calculateTotal();
    const fechaVenta = new Date().toISOString();

    const venta = {
        cliente_id: rucCliente,  // Suponiendo que el RUC o CI es el ID del cliente
        items_venta: productosEnTabla.map(producto => ({
            producto_id: producto.codigo,
            cantidad: producto.cantidad,
            precio: parseFloat(producto.precio)
        })),
        monto_total: montoTotal,
        fecha_venta: fechaVenta
    };

    try {
        // Enviar la venta al backend mediante POST
        const response = await fetch('https://apimocha.com/example122/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de enviar el token si es necesario
            },
            body: JSON.stringify(venta)
        });

        if (response.ok) {
            const data = await response.json();
            //alert('Venta confirmada correctamente.');

            // Limpiar la tabla y el total
            //document.querySelector('tbody').innerHTML = '';
            //document.getElementById('totalAmount').textContent = '$0.00';
        } else {
            const errorData = await response.json();
            alert('Error al confirmar la venta: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error al confirmar la venta:', error);
        alert('Error al confirmar la venta.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Asignar el evento click al botón "Confirmar Venta" usando su id
    const confirmSaleBtn = document.getElementById('confirmSaleBtn');
    confirmSaleBtn.addEventListener('click', confirmarVenta);

    // Capturar la tecla F12 para confirmar la venta
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F12') {
            event.preventDefault();  // Prevenir que el navegador abra la consola de desarrollo
            event.stopPropagation(); // Detener la propagación del evento
            confirmarVenta();  // Llamar a la función de confirmar venta
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const confirmSaleBtn = document.getElementById('confirmSaleBtn');
    const finalizarVentaBtn = document.getElementById('finalizarVentaBtn');
    const montoRecibidoInput = document.getElementById('montoRecibido');
    const vueltoClienteInput = document.getElementById('vueltoCliente');

    // Mostrar el modal con los datos de la venta y cliente
    confirmSaleBtn.addEventListener('click', function() {
        // Obtener el texto del total
        const totalText = document.querySelector('#totalAmount').textContent.replace('$', '').trim();
        
        // Convertir a número
        const total = parseFloat(totalText);
    
        // Verificar si el total es un número válido
        if (!isNaN(total)) {
            document.getElementById('modalMontoTotal').textContent = `$${total.toFixed(2)}`;
        } else {
            console.error('El valor del total es inválido:', totalText);
            alert('No se puede calcular el total de la venta.');
        }
    
        const rucCliente = document.getElementById('rucCliente').value;  // Obtener el RUC del cliente
        const nombreCliente = "Nombre del Cliente"; // Simular el nombre del cliente
    
        // Cargar los datos en el modal
        document.getElementById('modalNombreCliente').textContent = nombreCliente;
        document.getElementById('modalRUCCliente').textContent = rucCliente;
    
        // Mostrar el modal
        const confirmarVentaModal = new bootstrap.Modal(document.getElementById('confirmarVentaModal'));
        confirmarVentaModal.show();
    });
    

    // Calcular el vuelto cuando el usuario ingresa el monto recibido
    montoRecibidoInput.addEventListener('input', function() {
        const montoRecibido = parseFloat(montoRecibidoInput.value);
        const totalVenta = parseFloat(document.getElementById('modalMontoTotal').textContent.replace('$', ''));

        if (!isNaN(montoRecibido) && montoRecibido >= totalVenta) {
            const vuelto = montoRecibido - totalVenta;
            vueltoClienteInput.value = `$${vuelto.toFixed(2)}`;
        } else {
            vueltoClienteInput.value = '';
        }
    });

    // Al hacer clic en "Finalizar Venta"
    finalizarVentaBtn.addEventListener('click', function() {
        alert('Venta finalizada correctamente.');
        // Aquí puedes agregar la funcionalidad para imprimir ticket o factura en el futuro
    });
});
