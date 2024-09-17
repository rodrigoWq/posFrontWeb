document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.save').addEventListener('click', (event) => {
        // Mostrar cuadro de confirmación
        const confirmation = window.confirm("¿Estás seguro de que deseas guardar este producto?");
        
        if (confirmation) {
            // Si el usuario confirma, procedemos con la lógica del formulario

            // Obtener valores del formulario
            const nombre = document.getElementById('nombre').value;
            const codigo = document.getElementById('codigo').value;
            const unidad = document.getElementById('unidad').value;
            const descripcion = document.getElementById('descripcion').value;
            const categoria = document.getElementById('categoria').value;
            const fecha = document.getElementById('fecha').value;
            const precioCompra = document.getElementById('precio-compra').value;
            const precioVenta = document.getElementById('precio-venta').value;
            const tipoDescuento = document.getElementById('tipo-descuento').value;
            const valorDescuento = document.getElementById('valor-descuento').value;
            const cantidad = document.getElementById('cantidad').value;
            const cantidadMinima = document.getElementById('cantidad-minima').value;
            const alertaVencimiento = document.getElementById('alerta-vencimiento').value;
            const alertaCantidad = document.getElementById('alerta-cantidad').value;

            // Crear objeto JSON con los datos del formulario
            const producto = {
                nombre,
                codigo,
                unidad,
                descripcion,
                categoria,
                fecha,
                precioCompra,
                precioVenta,
                tipoDescuento,
                valorDescuento,
                cantidad,
                cantidadMinima,
                alertaVencimiento,
                alertaCantidad
            };

            // Convertir el objeto a JSON
            const productoJSON = JSON.stringify(producto);

            // Mostrar el JSON en la consola
            console.log(productoJSON);

            // Ejemplo de cómo enviar el JSON usando fetch (descomentar si se necesita)
            /*
            fetch('/ruta-del-servidor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: productoJSON
            })
            .then(response => response.json())
            .then(data => console.log('Éxito:', data))
            .catch((error) => console.error('Error:', error));
            */
        } else {
            // Si el usuario cancela, evitamos que se envíe el formulario
            event.preventDefault();
        }
    });
});
/*Script para el hmtl de Crear Producto*/