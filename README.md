# Clean Architecture API with Node.js, TypeScript, Express & TypeORM

Este proyecto implementa una API REST usando Clean Architecture con Node.js, TypeScript, Express y TypeORM con PostgreSQL.

## 🏗️ Arquitectura

El proyecto sigue los principios de Clean Architecture organizados en las siguientes capas:

```
src/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades de negocio
│   ├── repositories/      # Interfaces de repositorios
│   └── usecases/          # Casos de uso
├── application/           # Capa de Aplicación
│   └── services/          # Servicios de aplicación
├── infrastructure/        # Capa de Infraestructura
│   ├── database/          # Configuración de base de datos
│   │   └── entities/      # Entidades de TypeORM
│   └── repositories/      # Implementaciones de repositorios
└── presentation/          # Capa de Presentación
    ├── controllers/       # Controladores
    ├── routes/           # Rutas de Express
    └── middleware/       # Middlewares
```

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Express** - Framework web
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Base de datos relacional

## � Documentación Adicional

- [Guía de Endpoints de Registro](./ENDPOINTS_REGISTRO_USUARIOS.md) - Diferencias entre registro público y gestión administrativa
- [Ejemplos de Postman](./POSTMAN_EXAMPLES.md) - Ejemplos completos de uso de la API

## �📋 Requisitos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd tesis_be
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tu configuración de base de datos:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=clean_architecture_db
```

5. Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE clean_architecture_db;
```

## 🎯 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor en modo desarrollo con recarga automática
- `npm run build` - Compila el proyecto TypeScript a JavaScript
- `npm start` - Ejecuta el servidor en modo producción (requiere build previo)

## 📡 API Endpoints

### Users

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario

#### Ejemplo de creación de usuario:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Juan Pérez", "email": "juan@example.com"}'
```

### Health Check

- `GET /health` - Verificar estado del servidor

## 🏃‍♂️ Ejecutar el proyecto

1. Asegúrate de que PostgreSQL esté ejecutándose
2. Ejecuta el proyecto en modo desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🔧 Desarrollo

Para agregar nuevas funcionalidades, sigue el patrón de Clean Architecture:

1. **Entidades** - Define las entidades de dominio en `src/domain/entities/`
2. **Repositorios** - Crea interfaces en `src/domain/repositories/`
3. **Casos de Uso** - Implementa la lógica de negocio en `src/domain/usecases/`
4. **Servicios** - Coordina casos de uso en `src/application/services/`
5. **Controladores** - Maneja HTTP en `src/presentation/controllers/`
6. **Rutas** - Define endpoints en `src/presentation/routes/`
7. **Infraestructura** - Implementa repositorios en `src/infrastructure/`

## 📚 Principios de Clean Architecture

- **Independencia de frameworks**: La lógica de negocio no depende de frameworks externos
- **Testeable**: La lógica de negocio se puede probar sin UI, BD, servidor web, etc.
- **Independencia de UI**: La UI puede cambiar fácilmente sin cambiar el resto del sistema
- **Independencia de base de datos**: Puedes cambiar de Oracle o SQL Server a MongoDB, BigTable, CouchDB, etc.
- **Independencia de agentes externos**: La lógica de negocio no sabe nada sobre el mundo exterior

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
