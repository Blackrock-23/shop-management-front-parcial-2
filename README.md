SHOP MANAGEMENT

Jorge Alberto Alonso ( 192427 )
Edinson Andres Hernandez (192363)

# Shop Management - Sistema de Administración

## Descripción del Proyecto

Shop Management es un sistema de administración para tiendas online desarrollado con Bootstrap 5. Este proyecto implementa una interfaz responsive que permite gestionar usuarios, productos y carritos de compra, consumiendo datos desde la Fake Store API.

## Características Principales

- *Diseño Responsive*: Adaptable a diferentes dispositivos (móviles, tablets y escritorio)
- *Autenticación de Usuarios*: Sistema de login con validación de campos
- *Gestión de Usuarios*: Visualización y detalles de usuarios registrados
- *Catálogo de Productos*: Listado de productos con diferentes vistas (tarjetas y tabla)
- *Gestión de Carritos*: Visualización de carritos de compra y sus detalles
- *Ventanas Modales*: Para mostrar información detallada de usuarios, productos y carritos

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript 
- Bootstrap
- Bootstrap Icons
- Fake Store API 

## Estructura del Proyecto


BOOTSTRAP/
├── admin/
│   └── dashboard.html
├── css/
│   ├── professional.css
│   └── style.css
├── img/
│   └── logo_tienda.jpg
├── js/
│   ├── cartService.js
│   ├── dashboardService.js
│   ├── loginService.js
│   ├── productService.js
│   └── userService.js
├── index.html
└── README.md


## Instrucciones de Uso

1. Abre el archivo index.html en tu navegador
2. Inicia sesión con las siguientes credenciales:
   - Email: johnde
   - Contraseña: changeme
3. Explora el panel de administración:
   - Visualiza la lista de usuarios
   - Navega por el catálogo de productos
   - Revisa los carritos de compra
   - Haz clic en "Ver detalles" para obtener más información de cada elemento

## API Endpoints Utilizados

- GET /auth/login - Validación de usuario
- GET /users - Listar usuarios
- GET /users/:id - Detalle de usuario
- GET /products - Listar productos
- GET /products/:id - Detalle de producto
- GET /carts - Listar carritos
- GET /carts/:id - Detalle de carrito

## Capturas de Pantalla

### Página de Login
(![image](https://github.com/user-attachments/assets/65d050f0-9d7c-4abf-b88b-71a0909ab138))
### Panel de Control
(![image](https://github.com/user-attachments/assets/e5182e0d-0f08-4c8b-acba-9fd12dca0df0))
### Listado de Usuarios
(![image](https://github.com/user-attachments/assets/0f5c2064-462f-4145-92ec-faca3aeddbe3))
### Detalle de Usuario
(![image](https://github.com/user-attachments/assets/47eddd50-d4fc-408a-a986-b0086b4c1069))
### Listado de Productos
(![image](https://github.com/user-attachments/assets/c51be9bf-dbe0-4805-ae7a-a150c6c2b784))
### Detalle de Producto
(![image](https://github.com/user-attachments/assets/71c08509-7557-4b8b-adf8-c237b0daf863))
### Listado de Carritos
(![image](https://github.com/user-attachments/assets/3ce0547f-b3d5-49a1-90e0-d8708c1b94dd))


## Notas Adicionales
- Las imágenes y datos son proporcionados por la Fake Store API
