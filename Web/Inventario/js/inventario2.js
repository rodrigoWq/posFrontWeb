document.addEventListener('DOMContentLoaded', function() {
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const productosBody = document.getElementById('productosBody');
    const codigoProductoInput = document.getElementById('codigoProducto');
    const cantidadInput = document.getElementById('cantidad');

    let productos = [];

    // Simulador de base de datos local
    const productosSimulados = {
        "123456": {
            codigo_barra: "123456",
            nombre: "Producto Simulado 1",
            precio_compra: 10.00,
            precio_venta: 15.00
        },
        "654321": {
            codigo_barra: "654321",
            nombre: "Producto Simulado 2",
            precio_compra: 20.00,
            precio_venta: 30.00
        }
    };

    // Función para simular el fetch
    async function obtenerProductoSimulado(codigoProducto) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const producto = productosSimulados[codigoProducto];
                if (producto) {
                    resolve(producto);
                } else {
                    reject('Producto no encontrado');
                }
            }, 500); // Simulación de retraso de la red
        });
    }

    // Evento para agregar producto
    agregarProductoBtn.addEventListener('click', async function() {
        const codigoProducto = codigoProductoInput.value;
        const cantidad = cantidadInput.value;

        if (!codigoProducto || !cantidad) {
            alert('Por favor, ingrese el código de producto y la cantidad.');
            return;
        }

        try {
            // Usar la función simulada en lugar de fetch
            const producto = await obtenerProductoSimulado(codigoProducto);

            if (producto) {
                // Mostrar los datos del producto en la tabla
                agregarProductoATabla(producto, cantidad);
                productos.push({ ...producto, cantidad: parseFloat(cantidad) });
            }
        } catch (error) {
            console.warn(error); // Mostramos advertencia para producto no encontrado
            mostrarModalRegistroProducto(codigoProducto); // Mostrar modal si el producto no existe
        }
    });

    // Función para agregar el producto a la tabla
    function agregarProductoATabla(producto, cantidad) {
        const fila = `
            <tr>
                <td>${producto.codigo_barra}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio_compra.toFixed(2)}</td>
                <td>$${producto.precio_venta.toFixed(2)}</td>
                <td>${cantidad}</td>
                <td><button class="btn btn-danger btn-sm">Eliminar</button></td>
            </tr>`;
        productosBody.innerHTML += fila;
    }

    // Función para mostrar modal de registro de producto
    function mostrarModalRegistroProducto(codigoProducto) {
        const modalCodigoProducto = document.getElementById('codigoProductoModal');
        modalCodigoProducto.value = codigoProducto; // Mostrar el código del producto en el modal
        try {
            const modal = new bootstrap.Modal(document.getElementById('modalRegistroProducto'));
            modal.show();
        } catch (error) {
            console.error('Error al mostrar el modal:', error);
        }
    }

    // Registro de nuevo producto desde el modal
    const registrarProductoBtn = document.getElementById('registrarProductoBtn');
    registrarProductoBtn.addEventListener('click', function() {
        const codigoProducto = document.getElementById('codigoProductoModal').value;
        const nombreProducto = document.getElementById('nombreProductoModal').value;
        const categoriaProducto = document.getElementById('categoriaProductoModal').value;
        const unidadMedida = document.getElementById('unidadMedidaModal').value;
        const descripcionProducto = document.getElementById('descripcionProductoModal').value;
        const precioCompra = document.getElementById('precioCompraModal').value;
        const precioVenta = document.getElementById('precioVentaModal').value;
        const vigenciaPrecio = document.getElementById('vigenciaPrecioModal').value || new Date().toISOString().split('T')[0]; // Fecha del día si no se selecciona

        // Validar que todos los campos están llenos
        if (!nombreProducto || !precioCompra || !precioVenta) {
            alert('Por favor, complete todos los campos del producto.');
            return;
        }

        const producto = {
            codigo_barra: codigoProducto,
            categoria: categoriaProducto,
            unidad_medida: unidadMedida,
            nombre: nombreProducto,
            descripcion: descripcionProducto,
            precio_compra: parseFloat(precioCompra),
            precio_venta: parseFloat(precioVenta),
            vigencia_precio: vigenciaPrecio
        };

        // Agregar producto al almacén simulado
        productosSimulados[codigoProducto] = producto;
        alert('Producto registrado correctamente.');

        // Agregar el nuevo producto a la tabla
        agregarProductoATabla(producto, 1); // Asumimos que al registrar un nuevo producto, la cantidad será 1

        // Ocultar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistroProducto'));
        modal.hide();
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const lotesContainer = document.getElementById('lotesContainer');
    const agregarLoteBtn = document.getElementById('agregarLoteBtn');

    let loteCounter = 1;  // Contador para los lotes

    // Evento para agregar un nuevo lote
    agregarLoteBtn.addEventListener('click', function() {
        loteCounter++;
        const loteEntry = document.createElement('div');
        loteEntry.classList.add('row', 'mb-3', 'lote-entry');
        loteEntry.innerHTML = `
            <div class="col">
                <label for="cantidadLote${loteCounter}" class="form-label">Cantidad</label>
                <input type="number" class="form-control cantidad-lote" id="cantidadLote${loteCounter}" required>
            </div>
            <div class="col">
                <label for="fechaVencimientoLote${loteCounter}" class="form-label">Fecha de Vencimiento</label>
                <input type="date" class="form-control fecha-vencimiento-lote" id="fechaVencimientoLote${loteCounter}" required>
            </div>
        `;
        lotesContainer.appendChild(loteEntry);
    });

    // Función para capturar los datos de los lotes
    function capturarLotes() {
        const lotes = [];
        const loteEntries = document.querySelectorAll('.lote-entry');
        
        loteEntries.forEach((entry, index) => {
            const cantidad = entry.querySelector(`.cantidad-lote`).value;
            const fechaVencimiento = entry.querySelector(`.fecha-vencimiento-lote`).value;
            if (cantidad && fechaVencimiento) {
                lotes.push({
                    cantidad: parseFloat(cantidad),
                    fecha_vencimiento: fechaVencimiento
                });
            }
        });

        return lotes; // Devuelve un arreglo con todos los lotes
    }

    // Al registrar el producto, capturar los datos de los lotes
    document.getElementById('registrarProductoBtn').addEventListener('click', function() {
        const lotes = capturarLotes();

        // Aquí puedes enviar los datos de los lotes junto con el producto al backend
        console.log('Lotes capturados:', lotes);

        // Simular registro del producto y lotes en el backend
        alert('Producto y lotes registrados exitosamente.');
    });
});
