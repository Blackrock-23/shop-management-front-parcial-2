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
    
    // Intentar login con la Fake Store API
    fetch("https://api.escuelajs.co/api/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ email: username + '@mail.com', password })
    })
    .then((response) => {
        if (response.ok) {
            return response.json().then((data) => {
                // Login exitoso
                alertType = 'success';
                message = 'Inicio de sesión exitoso';
                alertBuilder(alertType, message);
                
                // Guardar token en localStorage
                localStorage.setItem('token', data.access_token);
                
                // Obtener información del usuario
                return fetch("https://api.escuelajs.co/api/v1/auth/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${data.access_token}`
                    }
                });
            })
            .then(response => {
                if (response && response.ok) {
                    return response.json();
                }
                throw new Error('No se pudo obtener el perfil');
            })
            .then(userData => {
                // Guardar datos del usuario
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Redireccionar al dashboard
                setTimeout(() => {
                    location.href = 'admin/dashboard.html';
                }, 1500);
            });
        } else {
            // Login fallido
            alertType = 'danger';
            message = 'Correo o contraseña incorrectos.';
            alertBuilder(alertType, message);
            
            // Restaurar botón
            document.getElementById('loginBtn').innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
            document.getElementById('loginBtn').disabled = false;
            
            return Promise.reject('Credenciales inválidas');
        }
    })
    .catch((error) => {
        console.error('Error en login:', error);
        
        // Para fines de la actividad práctica, permitimos un login simulado
        // si la API no está disponible o hay algún error
        if (username === 'jhonde' && password === 'changeme') {
            alertType = 'success';
            message = 'Inicio de sesión simulado exitoso';
            alertBuilder(alertType, message);
            
            // Crear datos simulados
            const mockUser = {
                id: 1,
                email: 'jhonde@mail.com',
                name: 'John Doe',
                role: 'customer',
                avatar: 'https://api.escuelajs.co/api/v1/files/e5e87890-15ad-4051-8339-913a0c3b6424.jpg'
            };
            
            // Guardar datos simulados
            localStorage.setItem('token', 'mock-token-12345');
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            // Redireccionar al dashboard
            setTimeout(() => {
                location.href = 'admin/dashboard.html';
            }, 1500);
        } else {
            alertType = 'danger';
            message = 'Error en el servidor. Intente más tarde o use las credenciales de prueba.';
            alertBuilder(alertType, message);
            
            // Restaurar botón
            document.getElementById('loginBtn').innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión';
            document.getElementById('loginBtn').disabled = false;
        }
    })
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

// Mostrar información de credenciales de prueba
document.addEventListener('DOMContentLoaded', function() {
    const credentialsInfo = document.getElementById('credentialsInfo');
    if (credentialsInfo) {
        credentialsInfo.innerHTML = `
            <div class="alert alert-info py-2">
                <p class="small mb-0">Para pruebas, usa: <br>
                    <code>jhonde</code> / <code>changeme</code>
                </p>
            </div>
        `;
    }
});