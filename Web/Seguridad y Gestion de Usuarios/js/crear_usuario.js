document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const estadoButtons = document.querySelectorAll('.estado-buttons .estado');

    estadoButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar la clase 'selected' de todos los botones
            estadoButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.classList.remove('activo', 'inactivo');
            });

            // Agregar la clase 'selected' al botón clickeado
            this.classList.add('selected');

            // Agregar la clase correspondiente al estado
            if (this.getAttribute('data-estado') === 'activo') {
                this.classList.add('activo');
            } else {
                this.classList.add('inactivo');
            }
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        // Mostrar un mensaje de confirmación antes de enviar
        const confirmacion = confirm('¿Estás seguro de que deseas enviar este formulario?');
        if (!confirmacion) {
            return; // Si el usuario cancela, no se envía el formulario
        }

        // Captura los datos del formulario
        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Agregar el estado al objeto de datos
        const estadoActivo = document.querySelector('.estado-buttons .estado.activo');
        const estadoInactivo = document.querySelector('.estado-buttons .estado.inactivo');
        if (estadoActivo && estadoActivo.classList.contains('selected')) {
            data['estado'] = 'activo';
        } else if (estadoInactivo && estadoInactivo.classList.contains('selected')) {
            data['estado'] = 'inactivo';
        } else {
            data['estado'] = 'desconocido'; // Por si acaso, en caso de que no haya botón seleccionado
        }

        // Imprimir el JSON en la consola
        console.log('Datos del formulario:', JSON.stringify(data, null, 2));

        /*
        // Enviar los datos como JSON (comentado por ahora)
        fetch('https://your-server-endpoint.com/api/crear-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Usuario creado exitosamente');
            // Aquí puedes añadir código para manejar la respuesta, como redirigir o mostrar un mensaje
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Hubo un error al crear el usuario');
            // Aquí puedes manejar el error, mostrar un mensaje, etc.
        });
        */
    });
});
/* Script para crear usuario*/