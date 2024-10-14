document.addEventListener('DOMContentLoaded', function() {
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const productosBody = document.getElementById('productosBody');
    const codigoProductoInput = document.getElementById('codigoProducto');
    const cantidadInput = document.getElementById('cantidad');

    // Captura de los campos de la factura o nota de remisión
    const timbradoInput = document.getElementById('timbrado');
    const rucInput = document.getElementById('ruc');
    const razonSocialInput = document.getElementById('razonSocial');
    const ivaInput = document.getElementById('iva');
    const montoTotalInput = document.getElementById('montoTotalFactura');
    const fechaFacturaInput = document.getElementById('fechaFactura');

    let productos = [];

    // Evento para agregar producto
    agregarProductoBtn.addEventListener('click', async function() {
        const codigoProducto = codigoProductoInput.value;
        const cantidad = cantidadInput.value;

        if (!codigoProducto || !cantidad) {
            alert('Por favor, ingrese el código de producto y la cantidad.');
            return;
        }

        try {
            // Realizar la petición GET para obtener los datos del producto
            const response = await fetch(`/api/productos/${codigoProducto}`);
            if (response.ok) {
                const producto = await response.json();
                
                // Verificar si el producto existe
                if (producto) {
                    // Mostrar los datos del producto en la tabla
                    agregarProductoATabla(producto, cantidad);
                    productos.push({ ...producto, cantidad: parseFloat(cantidad) });
                } else {
                    // Si no existe, abrir modal para registrar nuevo producto
                    mostrarModalRegistroProducto(codigoProducto);
                }
            } else {
                console.error('Producto no encontrado');
                mostrarModalRegistroProducto(codigoProducto); // Mostrar modal si el producto no existe
            }
        } catch (error) {
            console.error('Error al obtener los datos del producto:', error);
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
        const modal = new bootstrap.Modal(document.getElementById('modalRegistroProducto'));
        modal.show();
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

        // Capturar lotes
        const lotes = [];
        const loteEntries = document.querySelectorAll('.lote-entry');
        loteEntries.forEach((entry) => {
            const cantidad = entry.querySelector('.cantidad-lote').value;
            const fechaVencimiento = entry.querySelector('.fecha-vencimiento-lote').value;
            lotes.push({ cantidad, fecha_vencimiento: fechaVencimiento });
        });

        // Validar que todos los campos están llenos
        if (!nombreProducto || !precioCompra || !precioVenta || lotes.length === 0) {
            alert('Por favor, complete todos los campos del producto y agregue al menos un lote.');
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
            vigencia_precio: vigenciaPrecio,
            lotes: lotes
        };

        // Realizar la petición POST para registrar el producto
        fetch('/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(producto),
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto registrado correctamente.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistroProducto'));
            modal.hide();
        })
        .catch(error => {
            console.error('Error al registrar el producto:', error);
            alert('Hubo un error al registrar el producto.');
        });
    });

    // Función para registrar toda la compra
    const registrarCompraBtn = document.getElementById('registrarCompraBtn');
    registrarCompraBtn.addEventListener('click', function() {
        // Capturar los datos de la factura y los productos agregados
        const factura = {
            timbrado: timbradoInput.value,
            ruc: rucInput.value,
            razon_social: razonSocialInput.value,
            iva: parseFloat(ivaInput.value),
            monto_total: parseFloat(montoTotalInput.value),
            fecha: fechaFacturaInput.value,
            productos: productos,
        };

        // Validar los campos de la factura antes de enviar
        if (!factura.timbrado || !factura.ruc || !factura.razon_social || !factura.iva || !factura.monto_total || !factura.fecha || productos.length === 0) {
            alert('Por favor, complete todos los campos de la factura y agregue productos.');
            return;
        }

        // Enviar los datos de la factura y los productos al servidor
        fetch('/api/compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(factura),
        })
        .then(response => response.json())
        .then(data => {
            alert('Compra registrada correctamente.');
            // Puedes limpiar el formulario o redirigir al usuario después del registro
        })
        .catch(error => {
            console.error('Error al registrar la compra:', error);
            alert('Hubo un error al registrar la compra.');
        });
    });

    // Función para agregar un nuevo lote en el modal
    const agregarLoteBtn = document.getElementById('agregarLoteBtn');
    agregarLoteBtn.addEventListener('click', function() {
        const lotesContainer = document.getElementById('lotesContainer');
        const loteCounter = lotesContainer.querySelectorAll('.lote-entry').length + 1;

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
});
