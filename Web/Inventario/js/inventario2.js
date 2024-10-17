document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM para agregar producto
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const productosBody = document.getElementById('productosBody');
    const codigoProductoInput = document.getElementById('codigoProducto');
    const cantidadInput = document.getElementById('cantidad');
    
    // Verifica si los elementos existen antes de agregar eventos
    if (agregarProductoBtn && productosBody && codigoProductoInput && cantidadInput) {
        let productos = [];

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

        async function obtenerProductoSimulado(codigoProducto) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const producto = productosSimulados[codigoProducto];
                    if (producto) {
                        resolve(producto);
                    } else {
                        reject('Producto no encontrado');
                    }
                }, 500);
            });
        }

        agregarProductoBtn.addEventListener('click', async function() {
            const codigoProducto = codigoProductoInput.value;
            const cantidad = cantidadInput.value;

            if (!codigoProducto || !cantidad) {
                alert('Por favor, ingrese el código de producto y la cantidad.');
                return;
            }

            try {
                const producto = await obtenerProductoSimulado(codigoProducto);

                if (producto) {
                    agregarProductoATabla(producto, cantidad);
                    productos.push({ ...producto, cantidad: parseFloat(cantidad) });
                }
            } catch (error) {
                console.warn(error);
                mostrarModalRegistroProducto(codigoProducto);
            }
        });

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

        function mostrarModalRegistroProducto(codigoProducto) {
            const modalCodigoProducto = document.getElementById('codigoProductoModal');
            if (modalCodigoProducto) {
                modalCodigoProducto.value = codigoProducto;
                const modal = new bootstrap.Modal(document.getElementById('modalRegistroProducto'));
                modal.show();
            } else {
                console.error('No se pudo encontrar el modal para registrar producto.');
            }
        }
    } else {
        console.error('Uno o más elementos del DOM no fueron encontrados.');
    }

    // Código para agregar lotes
    const lotesContainer = document.getElementById('lotesContainer');
    const agregarLoteBtn = document.getElementById('agregarLoteBtn');

    if (lotesContainer && agregarLoteBtn) {
        let loteCounter = 1;

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
    } else {
        console.error('No se encontró el contenedor de lotes o el botón para agregar lotes.');
    }

    // Capturar lotes
    const registrarProductoBtn = document.getElementById('registrarProductoBtn');
    if (registrarProductoBtn) {
        registrarProductoBtn.addEventListener('click', function() {
            const lotes = capturarLotes();
            console.log('Lotes capturados:', lotes);
            alert('Producto y lotes registrados exitosamente.');
        });
    }

    function capturarLotes() {
        const lotes = [];
        const loteEntries = document.querySelectorAll('.lote-entry');
        
        loteEntries.forEach((entry) => {
            const cantidad = entry.querySelector(`.cantidad-lote`).value;
            const fechaVencimiento = entry.querySelector(`.fecha-vencimiento-lote`).value;
            if (cantidad && fechaVencimiento) {
                lotes.push({
                    cantidad: parseFloat(cantidad),
                    fecha_vencimiento: fechaVencimiento
                });
            }
        });

        return lotes;
    }
});
