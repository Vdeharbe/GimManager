# GimManager

Sistema de gestión para gimnasios desarrollado con React en el frontend y Node.js + Express en el backend. La aplicación permite administrar socios, profesores, pagos, reportes y configuraciones de una forma simple y funcional.

## Descripción

GimManager es una plataforma pensada para facilitar la administración diaria de un gimnasio. El proyecto incluye autenticación de usuarios, gestión de socios, panel de control, visualización de estadísticas y un flujo de navegación protegido por roles.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- React Router DOM
- Bootstrap
- Axios

### Backend
- Node.js
- Express
- JWT para autenticación
- MySQL
- CORS
- Dotenv

## Funcionalidades principales

- Login de usuarios con autenticación por token
- Dashboard con métricas iniciales
- Gestión de socios
- Gestión de profesores
- Control de pagos
- Reportes y estadísticas
- Configuración del sistema
- Sistema de rutas protegidas
- Roles de acceso para administración

## Estructura del proyecto

```text
GIMMANAGER/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── socios.controller.js
│   │   └── usuarios.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── socios.model.js
│   │   └── usuarios.model.js
│   └── routes/
│       ├── socios.routes.js
│       └── usuarios.routes.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── App.css
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── styles/
├── README.md
└── package.json
```

## Requisitos previos

- Node.js 18 o superior
- npm
- MySQL o base de datos configurada en el backend
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd GIMMANAGER
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

## Variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend` con la siguiente estructura:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gimmanager
```

## Ejecutar el proyecto

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

La app frontend normalmente queda disponible en el puerto 5173 de Vite, mientras que la API backend corre en el puerto 3000.

## Uso del sistema

- Iniciar sesión con credenciales válidas
- Acceder al panel principal desde Dashboard
- Administrar socios y profesores
- Registrar pagos y consultar reportes
- Configurar parámetros del sistema si se tiene rol de administrador

## Estado del proyecto

Este proyecto se encuentra en desarrollo inicial con la estructura base funcional para una aplicación de gestión del gimnasio. Ya incluye autenticación, rutas protegidas, dashboard, gestión de socios y una base sólida para continuar ampliando módulos.

## Autor

Proyecto desarrollado como práctica de desarrollo full stack para la gestión de un gimnasio.

## Licencia

Este proyecto se distribuye bajo una licencia educativa y de uso interno.
