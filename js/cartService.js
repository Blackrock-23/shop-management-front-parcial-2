// Contador para el dashboard
let cartCount = 0;

// Función para obtener y mostrar carritos
function getCarts() {
    document.getElementById('cardHeader').innerHTML = '<h4 class="mb-0"><i class="bi bi-cart me-2"></i>Listado de carritos</h4>';
    
    // Mostrar indicador de carga
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center my-5">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Actualizar contador en el dashboard
    updateCartCount();
    
    // Obtener carritos desde la API
    // Nota: Como la API puede no tener endpoint de carritos, usaremos usuarios y simularemos carritos
    fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener carritos');
        }
        return response.json();
    })
    .then(users => {
        // Generar carritos simulados basados en usuarios
        const carts = users.map(user => {
            // Generar entre 1 y 5 items aleatorios para cada carrito
            const itemCount = Math.floor(Math.random() * 5) + 1;
            const items = [];
            let totalPrice = 0;
            
            for (let i = 0; i < itemCount; i++) {
                const price = Math.floor(Math.random() * 100) + 10;
                const quantity = Math.floor(Math.random() * 3) + 1;
                totalPrice += price * quantity;
                
                items.push({
                    productId: Math.floor(Math.random() * 100) + 1,
                    title: `Producto ${Math.floor(Math.random() * 100) + 1}`,
                    price: price,
                    quantity: quantity,
                    total: price * quantity
                });
            }
            
            return {
                id: user.id,
                userId: user.id,
                date: new Date().toISOString(),
                items: items,
                totalPrice: totalPrice
            };
        });
        
        // Actualizar contador global
        cartCount = carts.length;
        
        if (!carts || carts.length === 0) {
            document.getElementById('info').innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">No se encontraron carritos</h4>
                    <p>No hay carritos disponibles en este momento.</p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">Volver</button>
                </div>
            `;
            return;
        }
        
        let cartsHtml = `
            <div class="d-flex justify-content-between mb-3">
                <h5>Total carritos: ${carts.length}</h5>
                <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">
                    <i class="bi bi-arrow-left me-1"></i>Volver
                </button>
            </div>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        `;
        
        carts.forEach(cart => {
            // Calcular el total del carrito
            let totalItems = 0;
            let totalPrice = 0;
            
            if (cart.items && cart.items.length > 0) {
                cart.items.forEach(item => {
                    totalItems += item.quantity || 0;
                    totalPrice += (item.price * item.quantity) || 0;
                });
            }
            
            cartsHtml += `
                <div class="col">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">Carrito #${cart.id}</h6>
                            <span class="badge bg-warning text-dark">${totalItems} productos</span>
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-1">
                                <i class="bi bi-person me-2 text-primary"></i>Usuario: ${cart.userId || 'No disponible'}
                            </p>
                            <p class="card-text mb-1">
                                <i class="bi bi-calendar me-2 text-primary"></i>Fecha: ${new Date(cart.date || Date.now()).toLocaleDateString()}
                            </p>
                            <p class="card-text">
                                <i class="bi bi-currency-dollar me-2 text-success"></i>Total: $${totalPrice.toFixed(2)}
                            </p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0 text-center">
                            <button class="btn btn-sm btn-primary" onclick="showCartDetails(${cart.id})">
                                <i class="bi bi-eye me-1"></i>Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartsHtml += `
            </div>
        `;
        
        document.getElementById('info').innerHTML = cartsHtml;
    })
    .catch(error => {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar carritos</h4>
                <p>${error.message || 'Ocurrió un error inesperado'}</p>
                <button class="btn btn-primary" onclick="showWelcomeMessage()">Volver al inicio</button>
            </div>
        `;
    });
}

// Función para mostrar detalles de un carrito en modal
function showCartDetails(cartId) {
    // Mostrar indicador de carga en el modal
    document.getElementById('detailsModalLabel').textContent = 'Detalles del Carrito';
    document.getElementById('detailsModalBody').innerHTML = `
        <div class="d-flex justify-content-center my-4">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
    
    // Obtener detalles del usuario para simular un carrito
    fetch(`${API_URL}/users/${cartId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener detalles del carrito');
        }
        return response.json();
    })
    .then(user => {
        // Generar un carrito simulado para este usuario
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const items = [];
        let cartTotal = 0;
        
        for (let i = 0; i < itemCount; i++) {
            const price = Math.floor(Math.random() * 100) + 10;
            const quantity = Math.floor(Math.random() * 3) + 1;
            cartTotal += price * quantity;
            
            items.push({
                productId: Math.floor(Math.random() * 100) + 1,
                title: `Producto ${Math.floor(Math.random() * 100) + 1}`,
                price: price,
                quantity: quantity,
                total: price * quantity
            });
        }
        
        const cart = {
            id: user.id,
            userId: user.id,
            date: new Date().toISOString(),
            items: items,
            totalPrice: cartTotal
        };
        
        // Variables para mostrar en la UI
        let totalItems = 0;
        let totalPrice = 0;
        
        if (cart.items && cart.items.length > 0) {
            cart.items.forEach(item => {
                totalItems += item.quantity || 0;
                totalPrice += (item.price * item.quantity) || 0;
            });
        }
        
        // Mostrar detalles del carrito en el modal
        let modalContent = `
            <div class="row mb-3">
                <div class="col-md-6">
                    <h5>Información del carrito</h5>
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-cart-check me-2 text-warning"></i>
                        <span>ID: ${cart.id}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-person me-2 text-primary"></i>
                        <span>Usuario: ${cart.userId || 'No disponible'}</span>
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-calendar me-2 text-primary"></i>
                        <span>Fecha: ${new Date(cart.date || Date.now()).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h5 class="card-title">Resumen</h5>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Total productos:</span>
                                <span class="fw-bold">${totalItems}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Importe total:</span>
                                <span class="fw-bold text-success">$${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar items del carrito
        if (cart.items && cart.items.length > 0) {
            modalContent += `
                <h5>Productos en el carrito</h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            cart.items.forEach(item => {
                const subtotal = (item.price * item.quantity) || 0;
                modalContent += `
                    <tr>
                        <td>${item.title || 'Producto ' + item.productId}</td>
                        <td>$${item.price?.toFixed(2) || '0.00'}</td>
                        <td>${item.quantity || 0}</td>
                        <td>$${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            modalContent += `
                        </tbody>
                        <tfoot class="table-light">
                            <tr>
                                <td colspan="3" class="text-end fw-bold">Total:</td>
                                <td class="fw-bold">$${totalPrice.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        } else {
            modalContent += `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    Este carrito no contiene productos.
                </div>
            `;
        }
        
        document.getElementById('detailsModalBody').innerHTML = modalContent;
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

// Función para actualizar el contador de carritos en el dashboard
function updateCartCount() {
    // Usar usuarios como base para los carritos
    fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(users => {
        // Actualizar contador global
        cartCount = users.length;
        
        // Actualizar contador en el dashboard si existe
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
    })
    .catch(error => {
        console.error('Error al actualizar contador de carritos:', error);
    });
}
