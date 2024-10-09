document.addEventListener('DOMContentLoaded', () => {
    // Pago a Proveedores
    document.getElementById('guardarPagoProveedor').addEventListener('click', () => {
        const monto = document.getElementById('montoPagoProveedor').value;
        const proveedor = document.getElementById('proveedorPagoProveedor').value;
        const factura = document.getElementById('facturaPagoProveedor').value;

        const data = { monto, proveedor, factura };

        console.log('Pago a Proveedores:', data);
        // Aquí puedes hacer la llamada a tu backend con fetch
    });

    // Ingresos Varios
    document.getElementById('guardarIngresosVarios').addEventListener('click', () => {
        const monto = document.getElementById('montoIngresosVarios').value;
        const descripcion = document.getElementById('descripcionIngresosVarios').value;

        const data = { monto, descripcion };

        console.log('Ingresos Varios:', data);
        // Aquí puedes hacer la llamada a tu backend con fetch
    });

    // Egresos Varios
    document.getElementById('guardarEgresosVarios').addEventListener('click', () => {
        const monto = document.getElementById('montoEgresosVarios').value;
        const descripcion = document.getElementById('descripcionEgresosVarios').value;

        const data = { monto, descripcion };

        console.log('Egresos Varios:', data);
        // Aquí puedes hacer la llamada a tu backend con fetch
    });


        // Cobros de Facturas
    document.getElementById('guardarCobroFacturas').addEventListener('click', () => {
        const monto = document.getElementById('montoCobroFacturas').value;
        const cliente = document.getElementById('clienteCobroFacturas').value;
        const factura = document.getElementById('facturaCobroFacturas').value;

        const data = { monto, cliente, factura };

        console.log('Cobros de Facturas:', data);
        // Aquí podrías hacer la llamada al backend
    });
    
    
});
document.getElementById('guardarPagoProveedor').addEventListener('click', function() {
    const monto = document.getElementById('montoPagoProveedor').value;
    const proveedor = document.getElementById('proveedorPagoProveedor').value;
    const factura = document.getElementById('facturaPagoProveedor').value;

    if (monto && proveedor && factura) {
        const pagosProveedores = JSON.parse(localStorage.getItem('pagosProveedores')) || [];

        // Añadir fecha y hora actual
        const fechaHora = new Date().toLocaleString(); // Genera fecha y hora en formato local

        // Guardar los datos del pago en localStorage
        pagosProveedores.push({ monto, proveedor, factura, fechaHora });
        localStorage.setItem('pagosProveedores', JSON.stringify(pagosProveedores));

        alert('Pago guardado correctamente.');

        // Opcional: limpiar los campos del formulario del modal
        document.getElementById('formPagoProveedores').reset();
    } else {
        alert('Por favor, completa todos los campos.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Cargar proveedores existentes en el modal de pago a proveedores
    function cargarProveedores() {
        fetch('/api/proveedores')  // Cambia por tu endpoint
            .then(response => response.json())
            .then(proveedores => {
                const proveedorSelect = document.getElementById('proveedorPagoProveedor');
                proveedorSelect.innerHTML = '<option value="">Seleccionar proveedor</option>';
                proveedores.forEach(proveedor => {
                    const option = document.createElement('option');
                    option.value = proveedor.id;
                    option.textContent = proveedor.nombre;
                    proveedorSelect.appendChild(option);
                });
            });
    }

    // Cuando se hace clic en "Registrar nuevo proveedor"
    document.getElementById('registrarProveedorBtn').addEventListener('click', () => {
        // Cerrar el modal de Pago a Proveedores antes de abrir el de Registrar Proveedor
        const modalPagoProveedores = bootstrap.Modal.getInstance(document.getElementById('modalPagoProveedores'));
        modalPagoProveedores.hide();  // Cerrar modal de Pago a Proveedores

        // Abrir el modal de Registrar Proveedor
        const modalRegistrarProveedor = new bootstrap.Modal(document.getElementById('modalRegistrarProveedor'));
        modalRegistrarProveedor.show();
    });

     // Guardar proveedor
    document.getElementById('guardarProveedor').addEventListener('click', () => {
        const nombre = document.getElementById('nombreProveedor').value;
        const telefono = document.getElementById('telefonoProveedor').value;
        const direccion = document.getElementById('direccionProveedor').value;

        // Llamada al backend para registrar un nuevo proveedor
        fetch('/api/proveedores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, telefono, direccion })
        })
        .then(response => response.json())
        .then(nuevoProveedor => {
            alert('Proveedor registrado exitosamente.');
            // Actualizar el listado de proveedores
            cargarProveedores();

            // Cerrar el modal de Registrar Proveedor
            const modalRegistrarProveedor = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarProveedor'));
            modalRegistrarProveedor.hide();

            // Reabrir el modal de Pago a Proveedores después de registrar al proveedor
            const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
            modalPagoProveedores.show();
        })
        .catch(error => console.error('Error:', error));
    });

    // Cargar proveedores cuando se abra el modal de Pago a Proveedores
    document.getElementById('modalPagoProveedores').addEventListener('shown.bs.modal', cargarProveedores);
});

document.addEventListener('DOMContentLoaded', () => {
    // Manejo del registro de nueva factura
    document.getElementById('guardarFactura').addEventListener('click', () => {
        const numeroFactura = document.getElementById('numeroFactura').value;
        const fechaEmision = document.getElementById('fechaEmision').value;
        const tipoFactura = document.getElementById('tipoFactura').value;
        const iva = document.querySelector('input[name="iva"]:checked').value;

        // Validar los campos
        if (!numeroFactura || !fechaEmision || !tipoFactura || !iva) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Crear objeto de factura
        const facturaData = {
            numeroFactura,
            fechaEmision,
            tipoFactura,
            iva
        };

        // Llamada al backend para registrar la factura
        fetch('/api/facturas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(facturaData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Factura registrada exitosamente.');

            // Colocar el número de factura en el campo correspondiente en el modal de Pago a Proveedores
            document.getElementById('facturaPagoProveedor').value = numeroFactura;
            
            // Cerrar el modal de Registrar Factura
            const modalRegistrarFactura = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarFactura'));
            modalRegistrarFactura.hide();

            // Reabrir el modal de Pago a Proveedores después de registrar la factura
            const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
            modalPagoProveedores.show();
        })
        .catch(error => {
            console.error('Error al registrar la factura:', error);
            alert('Error al registrar la factura.');
        });
    });

    // Reabrir el modal de Pago a Proveedores cuando se cierra el modal de Registrar Proveedor
    document.getElementById('modalRegistrarProveedor').addEventListener('hide.bs.modal', () => {
        const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
        modalPagoProveedores.show();
    });

    // Reabrir el modal de Pago a Proveedores cuando se cierra el modal de Registrar Factura
    document.getElementById('modalRegistrarFactura').addEventListener('hide.bs.modal', () => {
        const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
        modalPagoProveedores.show();
    });

});

