// Helper function to escape strings for HTML attributes
function escapeStringForAttribute(str) {
    if (typeof str !== 'string') {
        return ''; 
    }
    return str
        .replace(/\\/g, '\\\\')  // Must be first
        .replace(/'/g, '\\\'')   // Escape single quotes
        .replace(/"/g, '\\"')    // Escape double quotes
        .replace(/`/g, '\\`')    // Escape backticks
        .replace(/\n/g, '\\n')   // Escape newlines
        .replace(/\r/g, '\\r');  // Escape carriage returns
}

// Función para obtener y mostrar productos con diseño mejorado
function getProducts() {
    document.getElementById('cardHeader').innerHTML = '<h4 class="mb-0"><i class="bi bi-box-seam me-2"></i>Listado de productos</h4>';
    
    // Mostrar indicador de carga
    document.getElementById('info').innerHTML = `
        <div class="d-flex justify-content-center my-5">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Actualizar contador en el dashboard
    updateProductCount();
    
    // Usar la Fake Store API
    fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener productos');
        }
        return response.json();
    })
    .then(products => {
        if (!products || products.length === 0) {
            document.getElementById('info').innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">No se encontraron productos</h4>
                    <p>No hay productos disponibles en este momento.</p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">Volver</button>
                </div>
            `;
            return;
        }
            // Mostrar productos en un diseño de tarjetas
            let listProducts = `
            <div class="d-flex justify-content-between mb-3">
                <h5>Total productos: ${products.length}</h5>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="toggleView('cards')">Vista tarjetas</button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="toggleView('table')">Vista tabla</button>
                </div>
            </div>
            <div id="productsContainer">
                <div id="cardsView" class="row row-cols-1 row-cols-md-3 g-4">
            `;
            
            products.forEach(product => {
                const escapedTitle = escapeStringForAttribute(product.title);
                const categoryDisplay = escapeStringForAttribute(product.category); // API returns category as string

                listProducts += `
                <div class="col product-card" data-product-id="${product.id}">
                    <div class="card h-100 shadow-sm">
                        <div class="card-img-top text-center p-3">
                            <img src="${product.image}" alt="${escapedTitle}" class="img-fluid" style="max-height: 150px; object-fit: contain;">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text text-truncate">${product.description}</p>
                            <p class="card-text"><span class="badge bg-primary">$${product.price}</span></p>
                            <p class="card-text"><span class="badge bg-secondary">${categoryDisplay}</span></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-sm btn-outline-primary" onclick="showProductDetails(${product.id})">
                                    <i class="bi bi-eye me-1"></i>Ver detalles
                                </button>
                                <button class="btn btn-sm btn-outline-success" onclick="addToFavorites(${product.id}, '${escapedTitle}')">
                                    <i class="bi bi-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            });
            
            listProducts += `
                </div>
                <div id="tableView" class="table-responsive" style="display: none;">
                    <table class="table table-hover">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Categoría</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            products.forEach(product => {
                const escapedTitle = escapeStringForAttribute(product.title);
                const categoryDisplay = escapeStringForAttribute(product.category); // API returns category as string

                listProducts += `
                <tr>
                    <td>${product.id}</td>
                    <td><img src="${product.image}" alt="${escapedTitle}" width="50" height="50" class="rounded"></td>
                    <td>${product.title}</td>
                    <td>$${product.price}</td>
                    <td><span class="badge bg-secondary">${categoryDisplay}</span></td>
                    <td>
                        <button class='btn btn-sm btn-outline-primary me-1' onclick="showProductDetails(${product.id})"><i class='bi bi-eye'></i></button>
                        <button class='btn btn-sm btn-outline-success' onclick="addToFavorites(${product.id}, '${escapedTitle}')"><i class='bi bi-heart'></i></button>
                    </td>
                </tr>
                `;
            });
            
            listProducts += `
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <button class="btn btn-primary" onclick="showWelcomeMessage()">
                    <i class="bi bi-arrow-left me-2"></i>Volver al inicio
                </button>
            </div>
            `;
            
            document.getElementById('info').innerHTML = listProducts;
            
            // Añadir efectos de hover a las tarjetas
            addCardHoverEffects();

    })
    .catch(error => {
        console.error('Error en getProducts:', error);
        document.getElementById('info').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar productos</h4>
                <p>${error.message}</p>
                <button class="btn btn-sm btn-outline-secondary" onclick="showWelcomeMessage()">Volver</button>
            </div>
        `;
    });
}

// Función para actualizar el contador de productos en el dashboard
function updateProductCount() {
    fetch(`${API_URL}/products`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => response.json())
    .then(products => {
        const productCount = products.length;
        // Actualizar contador en el dashboard si existe
        const productCountElement = document.getElementById('productCount');
        if (productCountElement) {
            productCountElement.textContent = productCount;
        }
    })
    .catch(error => {
        console.error('Error al actualizar contador de productos:', error);
    });
}

// Función para mostrar detalles de un producto en un modal
function showProductDetails(productId) {
    // Mostrar indicador de carga en el modal
    document.getElementById('detailsModalLabel').textContent = 'Detalles del Producto';
    document.getElementById('detailsModalBody').innerHTML = `
        <div class="d-flex justify-content-center my-4">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
    
    // Obtener detalles del producto desde la API
    fetch(`${API_URL}/products/${productId}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener detalles del producto');
        }
        return response.json();
    })
    .then(product => {
        // Mostrar detalles del producto en el modal
        document.getElementById('detailsModalBody').innerHTML = `
            <div class="row">
                <div class="col-md-5 text-center mb-3">
                    <div id="productImageContainer">
                        <img src="${product.image}" class="d-block w-100" alt="${product.title}" style="max-height: 300px; object-fit: contain;">
                    </div>
                </div>
                <div class="col-md-7">
                    <h4>${product.title}</h4>
                    <div class="d-flex align-items-center mb-3">
                        <span class="badge bg-primary me-2">$${product.price}</span>
                        <span class="badge bg-secondary">${product.category.name}</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button class="btn btn-sm btn-outline-success" onclick="addToFavorites(${product.id}, '${product.title}')">
                            <i class="bi bi-heart me-1"></i>Añadir a favoritos
                        </button>
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
                <button class="btn btn-success" onclick="getProducts()">Volver a la lista</button>
                <button class="btn btn-outline-primary ms-2" onclick="addToFavorites(${product.id}, '${product.title}')">Añadir a favoritos</button>
            </div>
        `;
    });
}

// Función para alternar entre vista de tarjetas y tabla
function toggleView(viewType) {
    if (viewType === 'cards') {
        document.getElementById('cardsView').style.display = 'flex';
        document.getElementById('tableView').style.display = 'none';
    } else {
        document.getElementById('cardsView').style.display = 'none';
        document.getElementById('tableView').style.display = 'block';
    }
}

// Función para añadir efectos de hover a las tarjetas
function addCardHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card').classList.add('shadow');
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.card').classList.remove('shadow');
            this.style.transform = 'translateY(0)';
        });
    });
}

// Función para añadir productos a favoritos
function addToFavorites(id, name) {
    // Obtener favoritos actuales o inicializar array vacío
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Verificar si el producto ya está en favoritos
    const exists = favorites.some(fav => fav.id === id);
    
    if (!exists) {
        // Añadir a favoritos
        favorites.push({ id, name });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Mostrar mensaje de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>¡Éxito!</strong> ${name} añadido a favoritos.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Eliminar alerta después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    } else {
        // Mostrar mensaje de que ya está en favoritos
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <strong>Info:</strong> ${name} ya está en tus favoritos.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Eliminar alerta después de 3 segundos
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Función para mostrar productos favoritos
function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        document.getElementById('info').innerHTML = `
            <div class="alert alert-info" role="alert">
                <h4 class="alert-heading">No tienes favoritos</h4>
                <p>Aún no has añadido ningún producto a tus favoritos.</p>
                <button class="btn btn-primary" onclick="getProducts()">Ver productos</button>
            </div>
        `;
        return;
    }
    
    let favoritesHtml = `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Mis productos favoritos</h5>
            </div>
            <div class="card-body">
                <div class="list-group">
    `;
    
    favorites.forEach(fav => {
        favoritesHtml += `
            <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                ${fav.name}
                <button class="btn btn-sm btn-danger" onclick="removeFromFavorites(${fav.id})">Eliminar</button>
            </div>
        `;
    });
    
    favoritesHtml += `
                </div>
                <button class="btn btn-primary mt-3" onclick="getProducts()">Volver a productos</button>
            </div>
        </div>
    `;
    
    document.getElementById('info').innerHTML = favoritesHtml;
}

// Función para eliminar un producto de favoritos
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const productName = favorites.find(fav => fav.id === id)?.name || 'Producto';
    
    // Filtrar el producto a eliminar
    favorites = favorites.filter(fav => fav.id !== id);
    
    // Guardar la lista actualizada
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Mostrar mensaje
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-warning alert-dismissible fade show position-fixed top-0 end-0 m-3';
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <strong>Eliminado:</strong> ${productName} eliminado de favoritos.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
    
    // Actualizar la vista de favoritos
    showFavorites();
}