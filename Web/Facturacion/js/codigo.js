// Datos simulados para pruebas
const productosMock = [
    {
        codigo: "12345",
        descripcion: "Producto Ejemplo A",
        valorUnitario: 100,
        exenta: 0,
        iva5: 0,
        iva10: 10
    },
    {
        codigo: "67890",
        descripcion: "Producto Ejemplo B",
        valorUnitario: 200,
        exenta: 5,
        iva5: 0,
        iva10: 0
    }
];

// Función para buscar un producto en los datos simulados
function buscarProductoPorCodigo(codigo) {
    return productosMock.find(producto => producto.codigo === codigo);
}

// Evento de cambio en el campo de código del producto
document.getElementById('codigo_producto').addEventListener('change', function () {
    const codigo = this.value;
    const producto = buscarProductoPorCodigo(codigo);

    if (producto) {
        // Autocompletar campos si el producto existe
        document.getElementById('descripcion_producto').value = producto.descripcion;
        document.getElementById('valor_unitario_producto').value = producto.valorUnitario;
        document.getElementById('exenta_producto').value = producto.exenta;
        document.getElementById('iva_5_producto').value = producto.iva5;
        document.getElementById('iva_10_producto').value = producto.iva10;


        // Seleccionar el tipo de impuesto
        if (producto.exenta > 0) {
            document.getElementById('exenta_producto').checked = true;
        } else if (producto.iva5 > 0) {
            document.getElementById('iva_5_producto').checked = true;
        } else if (producto.iva10 > 0) {
            document.getElementById('iva_10_producto').checked = true;
        }
    } else {
        // Mostrar modal si el producto no existe
        const modal = new bootstrap.Modal(document.getElementById('modalRegistrarProducto'));
        modal.show();

        // Rellenar el campo de código en el modal para registro
        document.getElementById('codigo_producto_modal').value = codigo;
    }
});

// Evento para simular el guardado del producto en el modal
document.getElementById('guardarProducto').addEventListener('click', function () {
    const codigo = document.getElementById('codigo_producto_modal').value;
    const descripcion = document.getElementById('descripcion_producto_modal').value;
    const valorUnitario = document.getElementById('valor_unitario_producto_modal').value;
    const exenta = document.getElementById('exenta_producto_modal').value;
    const iva5 = document.getElementById('iva_5_producto_modal').value;
    const iva10 = document.getElementById('iva_10_producto_modal').value;

    // Simular el guardado en la lista de productosMock
    productosMock.push({ codigo, descripcion, valorUnitario, exenta, iva5, iva10 });

    alert('Producto registrado con éxito en la lista de prueba');

    // Ocultar el modal después de guardar
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistrarProducto'));
    modal.hide();
});
