

// Simulación de facturas pendientes de cobro
const facturasCobrar = [
    {
        numero: 'C001',
        cliente: 'Cliente X',
        monto: 1200
    },
    {
        numero: 'C002',
        cliente: 'Cliente Y',
        monto: 1800
    },
    {
        numero: 'C003',
        cliente: 'Cliente Z',
        monto: 2500
    }
];
document.addEventListener('DOMContentLoaded', function () {
    // Inicialmente ocultar el campo de Número de Factura
    const campoNumeroFactura = document.getElementById('campoNumeroFactura');
    if (campoNumeroFactura) {
        campoNumeroFactura.style.display = 'none';
    }

    // Agregar evento al select de tipo de documento
    const tipoDocumento = document.getElementById('tipoDocumento');
    if (tipoDocumento) {
        tipoDocumento.addEventListener('change', function() {
            const tipoDocumentoValue = this.value;
            if (tipoDocumentoValue === 'nota_remision') {
                // Ocultar el campo de Número de Factura
                if (campoNumeroFactura) {
                    campoNumeroFactura.style.display = 'none';
                }
                // Mostrar el modal para datos adicionales
                const modalNotaRemision = new bootstrap.Modal(document.getElementById('modalDatosNotaRemision'));
                modalNotaRemision.show();
            } else if (tipoDocumentoValue === 'factura') {
                // Mostrar el campo de Número de Factura
                if (campoNumeroFactura) {
                    campoNumeroFactura.style.display = 'block';
                }
            } else {
                // Si no hay selección, ocultar el campo de Número de Factura
                if (campoNumeroFactura) {
                    campoNumeroFactura.style.display = 'none';
                }
            }
        });
    }

    // Guardar los datos de la Nota de Remisión
    const guardarDatosNotaRemision = document.getElementById('guardarDatosNotaRemision');
    if (guardarDatosNotaRemision) {
        guardarDatosNotaRemision.addEventListener('click', function() {
            const nroComprobante = document.getElementById('nroComprobante').value;
            const timbrado = document.getElementById('timbrado').value;
            const ruc = document.getElementById('ruc').value;

            if (nroComprobante && timbrado && ruc) {
                // Aquí puedes manejar el almacenamiento de los datos o asignarlos a campos ocultos
                const modalNotaRemision = bootstrap.Modal.getInstance(document.getElementById('modalDatosNotaRemision'));
                modalNotaRemision.hide();
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }

    // Cargar facturas en el select al abrir el modal
    const modalCobrosFacturas = document.getElementById('modalCobrosFacturas');
    if (modalCobrosFacturas) {
        modalCobrosFacturas.addEventListener('shown.bs.modal', function () {
            const facturaSelect = document.getElementById('facturaCobroFacturas');
            if (facturaSelect) {
                facturaSelect.innerHTML = '<option value="">Seleccionar factura</option>'; // Resetear opciones
                facturasCobrar.forEach(factura => {
                    const option = document.createElement('option');
                    option.value = factura.numero;
                    option.textContent = factura.numero;
                    facturaSelect.appendChild(option);
                });
            }
        });
    }

    // Manejar el cambio de selección de factura
    const facturaCobroFacturas = document.getElementById('facturaCobroFacturas');
    if (facturaCobroFacturas) {
        facturaCobroFacturas.addEventListener('change', function () {
            const facturaSeleccionada = facturasCobrar.find(factura => factura.numero === this.value);
            if (facturaSeleccionada) {
                document.getElementById('clienteCobroFacturas').value = facturaSeleccionada.cliente;
                document.getElementById('montoCobroFacturas').value = facturaSeleccionada.monto;
            } else {
                document.getElementById('clienteCobroFacturas').value = '';
                document.getElementById('montoCobroFacturas').value = '';
            }
        });
    }

    // Inicializar otras funcionalidades similares
    // ...
});

// Cargar facturas en el select al abrir el modal
document.getElementById('modalCobrosFacturas').addEventListener('shown.bs.modal', function () {
    const facturaSelect = document.getElementById('facturaCobroFacturas');
    facturaSelect.innerHTML = '<option value="">Seleccionar factura</option>'; // Resetear opciones
    facturasCobrar.forEach(factura => {
        const option = document.createElement('option');
        option.value = factura.numero;
        option.textContent = factura.numero;
        facturaSelect.appendChild(option);
    });
});

// Manejar el cambio de selección de factura
document.getElementById('facturaCobroFacturas').addEventListener('change', function () {
    const facturaSeleccionada = facturasCobrar.find(factura => factura.numero === this.value);
    if (facturaSeleccionada) {
        document.getElementById('clienteCobroFacturas').value = facturaSeleccionada.cliente;
        document.getElementById('montoCobroFacturas').value = facturaSeleccionada.monto;
    } else {
        document.getElementById('clienteCobroFacturas').value = '';
        document.getElementById('montoCobroFacturas').value = '';
    }
});






// Definición de los endpoints de la API
const API_ENDPOINTS = {
    proveedores: '/api/proveedores',
    facturas: '/api/facturas',
    pagoProveedores: '/api/pagoProveedores',
    ingresosVarios: '/api/ingresosVarios',
    egresosVarios: '/api/egresosVarios',
    cobrosFacturas: '/api/cobrosFacturas'
};

const CajaApp = (() => {
    function init() {
        // Inicializar todas las funciones al cargar el DOM
        document.addEventListener('DOMContentLoaded', () => {
            initPagoProveedores();
            initIngresosVarios();
            initEgresosVarios();
            initCobrosFacturas();
            initProveedores();
            initFacturas();
        });
    }

    // Funciones relacionadas con Pago a Proveedores
    function initPagoProveedores() {
        // Evento para guardar pago a proveedores
        document.getElementById('guardarPagoProveedor').addEventListener('click', handleGuardarPagoProveedor);

        // Cargar proveedores y facturas al mostrar el modal
        document.getElementById('modalPagoProveedores').addEventListener('shown.bs.modal', () => {
            cargarProveedores();
            cargarFacturas();
        });

    }

    async function handleGuardarPagoProveedor() {
        const monto = document.getElementById('montoPagoProveedor').value;
        const proveedor = document.getElementById('proveedorPagoProveedor').value;
        const factura = document.getElementById('facturaPagoProveedor').value;

        if (monto && proveedor && factura) {
            const data = { monto, proveedor, factura };

            try {
                const response = await fetch(API_ENDPOINTS.pagoProveedores, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Pago registrado correctamente.');
                    document.getElementById('formPagoProveedores').reset();
                    const modalPagoProveedores = bootstrap.Modal.getInstance(document.getElementById('modalPagoProveedores'));
                    modalPagoProveedores.hide();
                } else {
                    const errorData = await response.json();
                    alert(`Error al registrar el pago: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al registrar el pago:', error);
                alert('Error al registrar el pago.');
            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    }

    // Funciones relacionadas con Ingresos Varios
    function initIngresosVarios() {
        document.getElementById('guardarIngresosVarios').addEventListener('click', async () => {
            const monto = document.getElementById('montoIngresosVarios').value;
            const descripcion = document.getElementById('descripcionIngresosVarios').value;

            if (monto && descripcion) {
                const data = { monto, descripcion };

                try {
                    const response = await fetch(API_ENDPOINTS.ingresosVarios, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert('Ingreso registrado correctamente.');
                        document.getElementById('formIngresosVarios').reset();
                        const modalIngresosVarios = bootstrap.Modal.getInstance(document.getElementById('modalIngresosVarios'));
                        modalIngresosVarios.hide();
                    } else {
                        const errorData = await response.json();
                        alert(`Error al registrar el ingreso: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error al registrar el ingreso:', error);
                    alert('Error al registrar el ingreso.');
                }
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }

    // Funciones relacionadas con Egresos Varios
    function initEgresosVarios() {
        document.getElementById('guardarEgresosVarios').addEventListener('click', async () => {
            const monto = document.getElementById('montoEgresosVarios').value;
            const descripcion = document.getElementById('descripcionEgresosVarios').value;

            if (monto && descripcion) {
                const data = { monto, descripcion };

                try {
                    const response = await fetch(API_ENDPOINTS.egresosVarios, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert('Egreso registrado correctamente.');
                        document.getElementById('formEgresosVarios').reset();
                        const modalEgresosVarios = bootstrap.Modal.getInstance(document.getElementById('modalEgresosVarios'));
                        modalEgresosVarios.hide();
                    } else {
                        const errorData = await response.json();
                        alert(`Error al registrar el egreso: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error al registrar el egreso:', error);
                    alert('Error al registrar el egreso.');
                }
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }

    // Funciones relacionadas con Cobros de Facturas
    function initCobrosFacturas() {
        document.getElementById('guardarCobroFacturas').addEventListener('click', async () => {
            const monto = document.getElementById('montoCobroFacturas').value;
            const cliente = document.getElementById('clienteCobroFacturas').value;
            const factura = document.getElementById('facturaCobroFacturas').value;

            if (monto && cliente && factura) {
                const data = { monto, cliente, factura };

                try {
                    const response = await fetch(API_ENDPOINTS.cobrosFacturas, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        alert('Cobro registrado correctamente.');
                        document.getElementById('formCobrosFacturas').reset();
                        const modalCobrosFacturas = bootstrap.Modal.getInstance(document.getElementById('modalCobrosFacturas'));
                        modalCobrosFacturas.hide();
                    } else {
                        const errorData = await response.json();
                        alert(`Error al registrar el cobro: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error al registrar el cobro:', error);
                    alert('Error al registrar el cobro.');
                }
            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }

    // Funciones relacionadas con Proveedores
    function initProveedores() {
        document.getElementById('guardarProveedor').addEventListener('click', handleGuardarProveedor);

        document.getElementById('modalRegistrarProveedor').addEventListener('hide.bs.modal', () => {
            const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
            modalPagoProveedores.show();
        });
    }

    async function handleGuardarProveedor() {
        const nombre = document.getElementById('nombreProveedor').value;
        const telefono = document.getElementById('telefonoProveedor').value;

        if (nombre && telefono) {
            try {
                const response = await fetch(API_ENDPOINTS.proveedores, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, telefono })
                });

                if (response.ok) {
                    alert('Proveedor registrado exitosamente.');
                    cargarProveedores();

                    const modalRegistrarProveedor = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarProveedor'));
                    modalRegistrarProveedor.hide();

                    const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
                    modalPagoProveedores.show();
                } else {
                    const errorData = await response.json();
                    alert(`Error al registrar el proveedor: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al registrar el proveedor:', error);
                alert('Error al registrar el proveedor.');
            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    }

    async function cargarProveedores() {
        try {
            const response = await fetch(API_ENDPOINTS.proveedores);
            if (response.ok) {
                const proveedores = await response.json();
                const proveedorSelect = document.getElementById('proveedorPagoProveedor');
                proveedorSelect.innerHTML = '<option value="">Seleccionar proveedor</option>';
                proveedores.forEach(proveedor => {
                    const option = document.createElement('option');
                    option.value = proveedor.id;
                    option.textContent = proveedor.nombre;
                    proveedorSelect.appendChild(option);
                });
            } else {
                const errorData = await response.json();
                console.error('Error al cargar proveedores:', errorData.message);
            }
        } catch (error) {
            console.error('Error al cargar proveedores:', error);
        }
    }

    // Funciones relacionadas con Facturas
    function initFacturas() {
        document.getElementById('guardarFactura').addEventListener('click', handleGuardarFactura);

        document.getElementById('modalRegistrarFactura').addEventListener('hide.bs.modal', () => {
            const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
            modalPagoProveedores.show();
        });
    }

    async function handleGuardarFactura() {
        const numeroFactura = document.getElementById('numeroFactura').value;
        const fechaEmision = document.getElementById('fechaEmision').value;
        const tipoFactura = document.getElementById('tipoFactura').value;
        const ivaElement = document.querySelector('input[name="iva"]:checked');

        if (numeroFactura && fechaEmision && tipoFactura && ivaElement) {
            const iva = ivaElement.value;
            const facturaData = {
                numeroFactura,
                fechaEmision,
                tipoFactura,
                iva
            };

            try {
                const response = await fetch(API_ENDPOINTS.facturas, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(facturaData)
                });

                if (response.ok) {
                    alert('Factura registrada exitosamente.');
                    cargarFacturas();

                    document.getElementById('facturaPagoProveedor').value = numeroFactura;

                    const modalRegistrarFactura = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarFactura'));
                    modalRegistrarFactura.hide();

                    const modalPagoProveedores = new bootstrap.Modal(document.getElementById('modalPagoProveedores'));
                    modalPagoProveedores.show();
                } else {
                    const errorData = await response.json();
                    alert(`Error al registrar la factura: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error al registrar la factura:', error);
                alert('Error al registrar la factura.');
            }
        } else {
            alert('Por favor, completa todos los campos.');
        }
    }

    async function cargarFacturas() {
        try {
            const response = await fetch(API_ENDPOINTS.facturas);
            if (response.ok) {
                const facturas = await response.json();
                const facturaSelect = document.getElementById('facturaPagoProveedor');
                facturaSelect.innerHTML = '<option value="">Seleccionar factura</option>';
                facturas.forEach(factura => {
                    const option = document.createElement('option');
                    option.value = factura.numeroFactura;
                    option.textContent = `Factura ${factura.numeroFactura} - ${factura.fechaEmision}`;
                    facturaSelect.appendChild(option);
                });
            } else {
                const errorData = await response.json();
                console.error('Error al cargar facturas:', errorData.message);
            }
        } catch (error) {
            console.error('Error al cargar facturas:', error);
        }
    }

    // Exponer la función init
    return {
        init
    };
})();



// Inicializar la aplicación
CajaApp.init();
