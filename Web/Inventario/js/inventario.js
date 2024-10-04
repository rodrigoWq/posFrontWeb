document.addEventListener('DOMContentLoaded', function() {
    const productosPorPagina = 5; // Número de productos por página
    let productos = []; // Lista para almacenar los productos
    let paginaActual = 1; // Página actual

    // Referencias a los elementos del DOM
    const productosBody = document.getElementById('productosBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const paginaActualSpan = document.getElementById('paginaActual');
    const agregarProductoBtn = document.getElementById('agregarProductoBtn');
    const montoTotalSpan = document.getElementById('montoTotal');

    // Evento para agregar producto
    agregarProductoBtn.addEventListener('click', function() {
        // Obtener los valores del formulario
        const codigo = document.getElementById('codigoProducto').value;
        const nombre = document.getElementById('nombreProducto').value;
        const cantidad = document.getElementById('cantidad').value;
        const precioUnitario = document.getElementById('precioUnitario').value;

        // Crear un nuevo producto
        const nuevoProducto = {
            codigo: codigo,
            nombre: nombre,
            cantidad: parseFloat(cantidad),
            precioUnitario: parseFloat(precioUnitario)
        };

        // Agregar el producto a la lista
        productos.push(nuevoProducto);

        // Actualizar la tabla con paginación
        mostrarPagina(paginaActual);

        // Actualizar el total de la compra
        actualizarTotalCompra();
    });

    // Función para mostrar los productos de la página actual
    function mostrarPagina(pagina) {
        // Calcular el índice inicial y final
        const inicio = (pagina - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const productosPagina = productos.slice(inicio, fin);

        // Limpiar el cuerpo de la tabla
        productosBody.innerHTML = '';

        // Agregar los productos de la página actual a la tabla
        productosPagina.forEach((producto, index) => {
            const fila = `<tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precioUnitario.toFixed(2)}</td>
                <td><button class="delete-btn">🗑️</button></td>
            </tr>`;
            productosBody.innerHTML += fila;
        });

        // Actualizar los botones de paginación
        actualizarBotonesPaginacion();
    }

    // Función para actualizar el total de la compra
    function actualizarTotalCompra() {
        const total = productos.reduce((sum, producto) => {
            return sum + producto.cantidad * producto.precioUnitario;
        }, 0);
        montoTotalSpan.textContent = `$${total.toFixed(2)}`;
    }

    // Función para actualizar los botones de paginación
    function actualizarBotonesPaginacion() {
        // Actualizar la página actual
        paginaActualSpan.textContent = `Página ${paginaActual}`;

        // Deshabilitar el botón "Anterior" si estamos en la primera página
        prevPageBtn.disabled = paginaActual === 1;

        // Deshabilitar el botón "Siguiente" si estamos en la última página
        const totalPaginas = Math.ceil(productos.length / productosPorPagina);
        nextPageBtn.disabled = paginaActual === totalPaginas;
    }

    // Evento para cambiar a la página anterior
    prevPageBtn.addEventListener('click', function() {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPagina(paginaActual);
        }
    });

    // Evento para cambiar a la siguiente página
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


