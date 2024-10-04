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

