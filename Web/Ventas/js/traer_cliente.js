document.addEventListener("DOMContentLoaded", function () {
    const addRUCBtn = document.getElementById('addRUCBtn');
    const rucInput = document.getElementById('rucCliente');
    const confirmRegisterBtn = document.getElementById('confirmRegisterBtn');
    const submitRegisterBtn = document.getElementById('submitRegisterBtn');
    let rucClienteNoEncontrado = '';  // Variable para almacenar el RUC no encontrado

    function fetchClientData() {
        const rucCliente = rucInput.value;
        
        if (!rucCliente) {
            alert('Por favor, ingresa un RUC válido');
            return;
        }

        // Realizamos la petición GET al backend
        fetch(`https://apimocha.com/prueba1123/clients/search/documento=${rucCliente}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Cliente no encontrado');
            }
            return response.json();
        })
        .then(data => {
            const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));

            // Si se encuentra el cliente
            if (data && data.nombre && data.apellido && data.ruc) {
                document.getElementById('clientName').innerText = data.nombre;
                document.getElementById('clientLastName').innerText = data.apellido;
                document.getElementById('clientRUC').innerText = data.ruc;
                
                document.getElementById('clientData').style.display = 'block';
                document.getElementById('clientNotFound').style.display = 'none';
                document.getElementById('clientForm').style.display = 'none';
                submitRegisterBtn.style.display = 'none';
                confirmRegisterBtn.style.display = 'none';

                clientModal.show();
            } else {
                // Cliente no encontrado
                rucClienteNoEncontrado = rucCliente; // Guardamos el RUC no encontrado
                document.getElementById('clientData').style.display = 'none';
                document.getElementById('clientNotFound').style.display = 'block';
                document.getElementById('clientForm').style.display = 'none';
                submitRegisterBtn.style.display = 'none';
                confirmRegisterBtn.style.display = 'inline-block';

                clientModal.show();
            }
        })
        .catch(error => {
            console.log(error);
            
            const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));

            rucClienteNoEncontrado = rucCliente; // Guardamos el RUC no encontrado
            document.getElementById('clientData').style.display = 'none';
            document.getElementById('clientNotFound').style.display = 'block';
            document.getElementById('clientForm').style.display = 'none';
            submitRegisterBtn.style.display = 'none';
            confirmRegisterBtn.style.display = 'inline-block';

            clientModal.show();
        });
    }

    // Mostrar el formulario cuando el usuario decida registrar al cliente
    confirmRegisterBtn.addEventListener('click', function () {
        document.getElementById('clientNotFound').style.display = 'none';
        document.getElementById('clientForm').style.display = 'block';
        document.getElementById('rucClienteForm').value = rucClienteNoEncontrado;  // Prellenar el RUC
        submitRegisterBtn.style.display = 'inline-block';
        confirmRegisterBtn.style.display = 'none';
    });

    // Lógica para enviar los datos al backend y registrar al cliente
    function registerClient() {
        const nombre = document.getElementById('nombreCliente').value;
        const apellido = document.getElementById('apellidoCliente').value;
        const ruc = document.getElementById('rucClienteForm').value;

        const data = {
            nombre,
            apellido,
            ruc,
            documento: ruc // Utilizamos el RUC como documento
        };

        fetch('https://apimocha.com/prueba1123/abx/f=123', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            const clientModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
            clientModal.hide();
        })
        .catch(error => {
            console.error('Error al registrar el cliente:', error);
            alert('Error al registrar el cliente. Inténtalo de nuevo.');
        });
    }

    addRUCBtn.addEventListener('click', fetchClientData);
    rucInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            fetchClientData();
        }
    });

     // Asignar la funcionalidad al botón de registrar cliente
    submitRegisterBtn.addEventListener('click', registerClient);

});
