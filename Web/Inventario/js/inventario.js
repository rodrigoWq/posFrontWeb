document.addEventListener('DOMContentLoaded', function() {
    const productosPorPagina = 5;
    let productos = [];
    let paginaActual = 1;

    const productosBody = document.getElementById('productosBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginaActualSpan = document.getElementById('paginaActual');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const montoTotalSpan = document.getElementById('montoTotal');

    // Evento para agregar producto
    agregarProductoBtn.addEventListener('click', function() {
        // Obtener los valores del formulario
        const codigoBarra = document.getElementById('codigoProducto').value; // Cambiado a código de barra
        const nombre = document.getElementById('nombreProducto').value;
        const cantidad = document.getElementById('cantidad').value;
        const precioUnitario = document.getElementById('precioUnitario').value;
        const fechaVencimientoLote = document.getElementById('fechaVencimientoLote').value; // Fecha de vencimiento

        // Crear un nuevo producto
        const nuevoProducto = {
            codigoBarra: codigoBarra, // Usamos el nuevo nombre "codigoBarra"
            nombre: nombre,
            cantidad: parseFloat(cantidad),
            precioUnitario: parseFloat(precioUnitario),
            fechaVencimientoLote: fechaVencimientoLote // Almacenar la fecha de vencimiento
        };

        // Agregar el producto a la lista
        productos.push(nuevoProducto);

        // Actualizar la tabla con paginación
        mostrarPagina(paginaActual);

        // Actualizar el total de la compra
        actualizarTotalCompra();
    });

    function mostrarPagina(pagina) {
        const inicio = (pagina - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productos.slice(inicio, fin);

        productosBody.innerHTML = '';

        productosPagina.forEach((producto, index) => {
            const fila = `<tr>
                <td>${producto.codigoBarra}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precioUnitario.toFixed(2)}</td>
                <td>${producto.fechaVencimientoLote}</td> <!-- Mostrar la fecha de vencimiento -->
                <td><button class="delete-btn">🗑️</button></td>
            </tr>`;
            productosBody.innerHTML += fila;
        });

        actualizarBotonesPaginacion();
    }

    function actualizarTotalCompra() {
        const total = productos.reduce((sum, producto) => {
            return sum + producto.cantidad * producto.precioUnitario;
        }, 0);
        montoTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    function actualizarBotonesPaginacion() {
        paginaActualSpan.textContent = `Página ${paginaActual}`;

        prevPageBtn.disabled = paginaActual === 1;

        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        nextPageBtn.disabled = paginaActual === totalPaginas;
    }

    prevPageBtn.addEventListener('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarPagina(paginaActual);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const registrarCompraBtn = document.getElementById('registrarCompraBtn');

    const navigationManager = new NavigationManager();


    // Agregar evento de clic al botón "Registrar Compra"
    registrarCompraBtn.addEventListener('click', function() {
        // Redireccionar a pantalla_inicial.html
        navigationManager.navigateTo('../../Ventas/HTML/pantalla_inicio.html');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const listaFacturasProveedores = document.getElementById('listaFacturasProveedores');
    const facturasProveedoresSection = document.querySelector('.facturas-proveedores'); // Obtener la sección completa

    // Cargar facturas y proveedores guardados en localStorage
    const pagosProveedores = JSON.parse(localStorage.getItem('pagosProveedores')) || [];

    if (pagosProveedores.length === 0) {
        facturasProveedoresSection.style.display = 'none'; // Ocultar la sección si no hay facturas/proveedores
    } else {
        facturasProveedoresSection.style.display = 'block'; // Mostrar la sección si hay facturas/proveedores

        pagosProveedores.forEach((pago, index) => {
            const item = document.createElement('li');
            item.classList.add('list-group-item');
            item.innerHTML = `
                Factura: ${pago.factura}, Proveedor: ${pago.proveedor}, Fecha: ${pago.fechaHora}
                <button class="btn btn-primary btn-sm float-end me-2 seleccionarBtn" data-index="${index}">
                    Seleccionar
                </button>
                <button class="btn btn-danger btn-sm float-end eliminarBtn" data-index="${index}">
                    Eliminar
                </button>
            `;
            listaFacturasProveedores.appendChild(item);
        });
    }

    // Manejar el evento de clic en los botones de selección o eliminación
    listaFacturasProveedores.addEventListener('click', function(event) {
        const index = event.target.getAttribute('data-index');

        if (event.target.classList.contains('seleccionarBtn')) {
            const pagoSeleccionado = pagosProveedores[index];

            // Prellenar los campos del formulario de compras
            document.getElementById('nroFactura').value = pagoSeleccionado.factura;
            document.getElementById('proveedor').value = pagoSeleccionado.proveedor;

        }

        if (event.target.classList.contains('eliminarBtn')) {
            // Eliminar el pago seleccionado del array y actualizar el localStorage
            pagosProveedores.splice(index, 1);
            localStorage.setItem('pagosProveedores', JSON.stringify(pagosProveedores));

            // Volver a cargar la lista actualizada
            actualizarListadoFacturasProveedores();
            alert('Elemento eliminado correctamente.');
        }
    });

    // Función para recargar la lista después de eliminar un elemento
    function actualizarListadoFacturasProveedores() {
        listaFacturasProveedores.innerHTML = ''; // Limpiar la lista

        if (pagosProveedores.length === 0) {
            facturasProveedoresSection.style.display = 'none'; // Ocultar la sección si no hay más facturas/proveedores
        } else {
            facturasProveedoresSection.style.display = 'block'; // Asegurarse de que la sección esté visible

            pagosProveedores.forEach((pago, index) => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.innerHTML = `
                    Factura: ${pago.factura}, Proveedor: ${pago.proveedor}, Fecha: ${pago.fechaHora}
                    <button class="btn btn-primary btn-sm float-end me-2 seleccionarBtn" data-index="${index}">
                        Seleccionar
                    </button>
                    <button class="btn btn-danger btn-sm float-end eliminarBtn" data-index="${index}">
                        Eliminar
                    </button>
                `;
                listaFacturasProveedores.appendChild(item);
            });
        }
    }
});


