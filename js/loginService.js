document.getElementById("formLogin").addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Validación básica del formulario
    let isValid = true;
    let errorMessage = '';
    
    // Validar username
    if (!username) {
        isValid = false;
        errorMessage = 'Por favor ingresa tu nombre de usuario.';
    }
    
    // Validar contraseña
    if (!password) {
        isValid = false;
        errorMessage = errorMessage ? errorMessage + ' Por favor ingresa tu contraseña.' : 'Por favor ingresa tu contraseña.';
    }
    
    if (isValid) {
        // Si la validación es exitosa, intentar login
        login(username, password);
    } else {
        // Mostrar mensaje de error
        alertBuilder('warning', errorMessage);
    }
})

function login(username, password) {
    let message = '';
    let alertType = '';

    // Limpiar cualquier token anterior
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Mostrar indicador de carga
    document.getElementById('loginBtn').innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Iniciando sesión...';
    document.getElementById('loginBtn').disabled = true;

    // Intentar login con FakeStoreAPI users
    fetch("https://fakestoreapi.com/users")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de usuarios. Código: ' + response.status);
            }
            return response.json();
        })
        .then(users => {
            const foundUser = users.find(user => user.username === username && user.password === password);

            if (foundUser) {
                // Login exitoso
                alertType = 'success';
                message = 'Inicio de sesión exitoso.';
                alertBuilder(alertType, message);

                const userToStore = {
                    id: foundUser.id,
                    email: foundUser.email,
                    name: `${foundUser.name.firstname} ${foundUser.name.lastname}`,
                    username: foundUser.username,
                    role: 'customer', // Rol predeterminado
                    avatar: `https://i.pravatar.cc/150?u=${foundUser.username}` // Avatar genérico basado en username
                };
                localStorage.setItem('user', JSON.stringify(userToStore));
                localStorage.setItem('token', `fake-token-for-${foundUser.username}`); // Token simulado

                // Redireccionar al dashboard
                setTimeout(() => {
                    location.href = 'admin/dashboard.html';
                }, 1500);
            } else {
                // Login fallido
                alertType = 'danger';
                message = 'Usuario o contraseña incorrectos.';
                alertBuilder(alertType, message);

                document.getElementById('loginBtn').innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
                document.getElementById('loginBtn').disabled = false;
            }
        })
        .catch(error => {
            console.error('Error en login:', error);
            alertType = 'danger';
            message = error.message || 'Ocurrió un error al intentar iniciar sesión. Por favor, intente más tarde.';
            alertBuilder(alertType, message);

            document.getElementById('loginBtn').innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
            document.getElementById('loginBtn').disabled = false;
        });
}

function alertBuilder(alertType, message) {
    const alert = `
        <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.getElementById('alert').innerHTML = alert;
}

// Mostrar información sobre las credenciales
document.addEventListener('DOMContentLoaded', function() {
    const credentialsInfo = document.getElementById('credentialsInfo');
    if (credentialsInfo) {
        credentialsInfo.innerHTML = `
            <div class="alert alert-info py-2">
                <p class="small mb-0">Puedes iniciar sesión con cualquier usuario de 
                    <a href="https://fakestoreapi.com/users" target="_blank" rel="noopener noreferrer">FakeStoreAPI Users</a>.
                </p>
                <p class="small mb-0">Ej: <code>mor_2314</code> / <code>83r5^_</code></p>
            </div>
        `;
    }
});