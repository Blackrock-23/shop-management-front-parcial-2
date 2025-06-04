// URL base de la API
const API_URL = 'https://api.escuelajs.co/api/v1';

// Función para obtener y mostrar usuarios
function getUsers() {
    document.getElementById('cardHeader').innerHTML = '<h4 class="mb-0"><i class="bi bi-people me-2"></i>Listado de usuarios</h4>';
    
    // Mostrar indicador de carga
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Actualizar contador en el dashboard
    updateUserCount();
    
    // Obtener usuarios desde la API
    fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }
        return response.json();
    })
    .then(users => {
        if (!users || users.length === 0) {
            document.getElementById('info').innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">No se encontraron usuarios</h4>
                    <p>No hay usuarios disponibles en este momento.</p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">Volver</button>
                </div>
            `;
            return;
        }
        
        let usersHtml = `
            <div class="d-flex justify-content-between mb-3">
                <h5>Total usuarios: ${users.length}</h5>
                <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">
                    <i class="bi bi-arrow-left me-1"></i>Volver
                </button>
            </div>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        `;
        
        users.forEach(user => {
            usersHtml += `
                <div class="col">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">${user.name}</h6>
                            <span class="badge bg-${getRoleBadgeColor(user.role)}">${user.role}</span>
                        </div>
                        <div class="card-body text-center">
                            <img src="${user.avatar || 'https://api.lorem.space/image/face?w=150&h=150'}" 
                                class="rounded-circle mb-3" width="100" height="100" 
                                alt="Avatar de ${user.name}">
                            <p class="card-text mb-1">
                                <i class="bi bi-envelope me-2 text-primary"></i>${user.email}
                            </p>
                            <p class="card-text">
                                <i class="bi bi-person-badge me-2 text-primary"></i>ID: ${user.id}
                            </p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 text-center">
                            <button class="btn btn-sm btn-primary" onclick="showUserDetails(${user.id})">
                                <i class="bi bi-eye me-1"></i>Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        usersHtml += `
            </div>
        `;
        
        document.getElementById('info').innerHTML = usersHtml;
    })
    .catch(error => {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar usuarios</h4>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
                <button class="btn btn-primary" onclick="showWelcomeMessage()">Volver al inicio</button>
            </div>
        `;
    });
}

// Función para obtener el color del badge según el rol
function getRoleBadgeColor(role) {
    switch(role) {
        case 'admin':
            return 'danger';
        case 'customer':
            return 'success';
        default:
            return 'secondary';
    }
}

// Función para mostrar detalles de un usuario en modal
function showUserDetails(userId) {
    // Mostrar indicador de carga en el modal
    document.getElementById('detailsModalLabel').textContent = 'Detalles del Usuario';
    document.getElementById('detailsModalBody').innerHTML = `
        <div class="d-flex justify-content-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
    
    // Obtener detalles del usuario desde la API
    fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener detalles del usuario');
        }
        return response.json();
    })
    .then(user => {
        // Mostrar detalles del usuario en el modal
        document.getElementById('detailsModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${user.avatar || 'https://api.lorem.space/image/face?w=150&h=150'}" 
                         class="img-fluid rounded-circle mb-3" style="max-width: 150px;" 
                         alt="Avatar de ${user.name}">
                    <h5>${user.name}</h5>
                    <span class="badge bg-${getRoleBadgeColor(user.role)} mb-3">${user.role}</span>
                </div>
                <div class="col-md-8">
                    <div class="mb-3">
                        <h6 class="text-muted mb-2">Información de contacto</h6>
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-envelope me-2 text-primary"></i>
                            <span>${user.email}</span>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-person-badge me-2 text-primary"></i>
                            <span>ID: ${user.id}</span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <h6 class="text-muted mb-2">Información adicional</h6>
                        <div class="d-flex align-items-center mb-2">
                            <i class="bi bi-calendar-check me-2 text-success"></i>
                            <span>Fecha de registro: ${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="d-flex align-items-center">
                            <i class="bi bi-shield-check me-2 text-success"></i>
                            <span>Estado: <span class="badge bg-success">Activo</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('detailsModalBody').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h5 class="alert-heading">Error al cargar detalles</h5>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
            </div>
        `;
    });

}

// Función para mostrar el formulario de edición de usuario
function editUser(userId) {
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    fetch(`https://reqres.in/api/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            'x-api-key': 'reqres-free-v1'
        }
    })
    .then(result => result.json())
    .then(data => {
        const user = data.data;
        document.getElementById('info').innerHTML = `
            <div class="card shadow">
                <div class="card-header bg-warning text-white">
                    <h5 class="mb-0">Editar usuario</h5>
                </div>
                <div class="card-body">
                    <form id="editUserForm">
                        <input type="hidden" id="userId" value="${user.id}">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="firstName" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="firstName" value="${user.first_name}" required>
                            </div>
                            <div class="col-md-6">
                                <label for="lastName" class="form-label">Apellido</label>
                                <input type="text" class="form-control" id="lastName" value="${user.last_name}" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" value="${user.email}" required>
                        </div>
                        <div class="d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" onclick="getUsers()">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="updateUser()">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    })
    .catch(error => {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar el usuario</h4>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
                <button class="btn btn-primary" onclick="getUsers()">Volver a la lista</button>
            </div>
        `;
    });
}

// Función para actualizar un usuario
function updateUser() {
    const userId = document.getElementById('userId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Actualizando...</span>
            </div>
        </div>
    `;
    
    fetch(`https://reqres.in/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            'x-api-key': 'reqres-free-v1'
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email
        })
    })
    .then(response => {
        if (response.status === 200) {
            // Mostrar mensaje de éxito
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
            alertDiv.setAttribute('role', 'alert');
            alertDiv.innerHTML = `
                <strong>¡Éxito!</strong> Usuario actualizado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            document.body.appendChild(alertDiv);
            
            // Eliminar alerta después de 3 segundos
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
            
            // Volver a la lista de usuarios
            getUsers();
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    })
    .catch(error => {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al actualizar el usuario</h4>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
                <button class="btn btn-primary" onclick="getUsers()">Volver a la lista</button>
            </div>
        `;
    });
}

// Función para mostrar el formulario de añadir usuario
function showAddUserForm() {
    document.getElementById('info').innerHTML = `
        <div class="card shadow">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">Añadir nuevo usuario</h5>
            </div>
            <div class="card-body">
                <form id="addUserForm">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="newFirstName" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="newFirstName" required>
                        </div>
                        <div class="col-md-6">
                            <label for="newLastName" class="form-label">Apellido</label>
                            <input type="text" class="form-control" id="newLastName" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="newEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="newEmail" required>
                    </div>
                    <div class="mb-3">
                        <label for="newJob" class="form-label">Puesto</label>
                        <input type="text" class="form-control" id="newJob" required>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" onclick="getUsers()">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="addUser()">Crear usuario</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Función para añadir un nuevo usuario
function addUser() {
    const firstName = document.getElementById('newFirstName').value;
    const lastName = document.getElementById('newLastName').value;
    const email = document.getElementById('newEmail').value;
    const job = document.getElementById('newJob').value;
    
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Creando usuario...</span>
            </div>
        </div>
    `;
    
    fetch('https://reqres.in/api/users', {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            'x-api-key': 'reqres-free-v1'
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            job: job
        })
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar mensaje de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>¡Éxito!</strong> Usuario creado correctamente con ID: ${data.id}.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Eliminar alerta después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
        
        // Volver a la lista de usuarios
        getUsers();
    })
    .catch(error => {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al crear el usuario</h4>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
                <button class="btn btn-primary" onclick="getUsers()">Volver a la lista</button>
            </div>
        `;
    });
}

// Función para añadir efectos de hover a las filas
function addRowHoverEffects() {
    const userRows = document.querySelectorAll('.user-row');
    userRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.classList.add('table-active');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('table-active');
        });
    });
}

// Función para actualizar el contador de usuarios en el dashboard
function updateUserCount() {
    fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(users => {
        if (document.getElementById('userCount')) {
            document.getElementById('userCount').textContent = users.length || '0';
        }
    })
    .catch(() => {
        if (document.getElementById('userCount')) {
        
        // Crear un blob y un enlace de descarga
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "usuarios.csv");
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Mostrar mensaje de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>¡Éxito!</strong> Usuarios exportados a CSV correctamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Eliminar alerta después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000).catch(error => {
        // Mostrar mensaje de error
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>Error:</strong> No se pudieron exportar los usuarios.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Eliminar alerta después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    });
}
