function verifyAsesores() {
    const selectedPrincipalId = document.getElementById('asesor-principal').value;
    const selectedSecundarioId = document.getElementById('asesor-secundario').value;
    const errorMessageDiv = document.getElementById('error-message');

    if (selectedPrincipalId && selectedSecundarioId && selectedPrincipalId === selectedSecundarioId) {
        errorMessageDiv.textContent = 'No se puede seleccionar el mismo asesor como principal y secundario.';
        errorMessageDiv.style.display = 'block';
        return false;
    } else {
        errorMessageDiv.style.display = 'none';
        return true;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Cargar asesores
        const asesoresResponse = await fetch('/api/asesores');
        const asesores = await asesoresResponse.json();
        const asesorPrincipalSelect = document.getElementById('asesor-principal');
        const asesorSecundarioSelect = document.getElementById('asesor-secundario');
        
        asesores.forEach(asesor => {
            const option = document.createElement('option');
            option.value = asesor.id_asesor;
            option.textContent = asesor.nombre_de_usuario;
            asesorPrincipalSelect.appendChild(option);

            const optionClone = option.cloneNode(true);
            asesorSecundarioSelect.appendChild(optionClone);
        });

        asesorPrincipalSelect.addEventListener('change', verifyAsesores);
        asesorSecundarioSelect.addEventListener('change', verifyAsesores);

        // Cargar etiquetas
        const etiquetasResponse = await fetch('/api/etiquetas');
        const etiquetas = await etiquetasResponse.json();
        const etiquetasDiv = document.getElementById('etiquetas');
        etiquetas.forEach(etiqueta => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = etiqueta.id_etiqueta;
            checkbox.name = 'etiquetas';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(etiqueta.nombre_etiqueta));
            etiquetasDiv.appendChild(label);
            etiquetasDiv.appendChild(document.createElement('br'));
        });
    } catch (error) {
        console.error('Error loading asesores or etiquetas:', error);
    }

    // Manejar el inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const userType = document.getElementById('userType').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, userType }),
            });

            const data = await response.json();

            if (data.success) {
                if (userType === 'admin') {
                    window.location.href = '/adminIndex';
                } else if (userType === 'asesor') {
                    window.location.href = '/asesorIndex';
                }
            } else {
                document.getElementById('errorMessage').textContent = data.message;
            }
        } catch (error) {
            document.getElementById('errorMessage').textContent = 'An error occurred. Please try again later.';
        }
    });
});

function addAuthor() {
    const autoresContainer = document.getElementById('autores-container');
    const newAutor = document.createElement('div');
    newAutor.className = 'autor';
    newAutor.innerHTML = `
        <input type="text" placeholder="Apellido Paterno" class="apellido-paterno" required>
        <input type="text" placeholder="Apellido Materno" class="apellido-materno" required>
        <input type="text" placeholder="Nombres" class="nombres" required>
        <button type="button" onclick="removeAuthor(this)">Eliminar</button>
    `;
    autoresContainer.appendChild(newAutor);
}

function removeAuthor(button) {
    button.parentElement.remove();
}

document.getElementById('thesis-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Verificar selección de asesores antes de continuar
    if (!verifyAsesores()) {
        return;
    }

    const formData = new FormData();
    formData.append('titulo_de_tesis', document.getElementById('titulo').value);
    formData.append('fecha_de_publicacion', document.getElementById('fecha').value);
    formData.append('carrera', document.getElementById('carrera').value);
    formData.append('archivo_pdf', document.getElementById('archivo').files[0]);

    const autores = Array.from(document.getElementsByClassName('autor')).map(autor => ({
        apellido_paterno: autor.querySelector('.apellido-paterno').value,
        apellido_materno: autor.querySelector('.apellido-materno').value,
        nombres: autor.querySelector('.nombres').value
    }));

    const asesorPrincipal = parseInt(document.getElementById('asesor-principal').value);
    const asesorSecundario = document.getElementById('asesor-secundario').value ? parseInt(document.getElementById('asesor-secundario').value) : null;
    const asesores = [asesorPrincipal];
    if (asesorSecundario) {
        asesores.push(asesorSecundario);
    }

    const etiquetas = Array.from(document.querySelectorAll('input[name="etiquetas"]:checked')).map(checkbox => parseInt(checkbox.value));

    const body = {
        titulo_de_tesis: document.getElementById('titulo').value,
        fecha_de_publicacion: document.getElementById('fecha').value,
        carrera: document.getElementById('carrera').value,
        archivo_pdf: document.getElementById('archivo').files[0],
        autores,
        asesores,
        etiquetas
    };

    try {
        const response = await fetch('/api/register-thesis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        if (result.success) {
            alert('Tesis registrada exitosamente');
            document.getElementById('thesis-form').reset(); // Limpiar formulario
            document.getElementById('error-message').style.display = 'none'; // Ocultar mensaje de error
        } else {
            alert('Error al registrar la tesis');
        }
    } catch (error) {
        console.error(error);
        alert('Error al registrar la tesis');
    }
});
