# 🚀 Tesis Backend - Railway Deployment

## 📋 Información del Proyecto

Sistema backend para tesis con arquitectura limpia, TypeScript, Express y PostgreSQL.

### 🔧 Funcionalidades Principales
- ✅ Sistema de autenticación JWT
- ✅ Gestión de usuarios y perfiles
- ✅ Sistema de preferencias (hasta 5 tags por usuario)
- ✅ Gestión de ofertas de servicios
- ✅ Sistema de reviews y calificaciones
- ✅ Chat en tiempo real con WebSockets
- ✅ API REST completa

## 🌐 Deploy en Railway

### Variables de Entorno Requeridas

En Railway, configura estas variables:

```bash
# JWT Configuration
JWT_SECRET=tu_super_secreto_jwt_muy_largo_y_seguro_12345

# Database (proporcionada automáticamente por Railway PostgreSQL)
# No necesitas configurar estas manualmente:
# DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

# Server Configuration  
NODE_ENV=production
PORT=3000

# CORS (opcional)
CORS_ORIGIN=https://tu-frontend-domain.vercel.app
```

### 🚀 Pasos para Deploy

1. **Conectar Railway con GitHub**
   - Ve a [railway.app](https://railway.app)
   - Conecta tu cuenta de GitHub
   - Selecciona este repositorio

2. **Agregar PostgreSQL**
   - En tu proyecto Railway, haz clic en "New"
   - Selecciona "Database" → "PostgreSQL"
   - Railway configurará automáticamente las variables de DB

3. **Configurar Variables de Entorno**
   - Ve a la pestaña "Variables"
   - Agrega `JWT_SECRET` con un valor seguro
   - Agrega `NODE_ENV=production`

4. **Deploy Automático**
   - Railway detectará automáticamente el `package.json`
   - Ejecutará `npm run build` y luego `npm start`
   - El seeding se ejecutará automáticamente después del build

### 📡 Endpoints Disponibles

Una vez desplegado, tu API estará disponible en: `https://tu-proyecto.railway.app`

**Endpoints principales:**
- `GET /health` - Health check
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/tags` - Listar tags
- `POST /api/preferences` - Agregar preferencias
- `GET /api/preferences` - Ver todas las preferencias
- `GET /api/offers` - Listar ofertas

### 🧪 Testing

Usa Postman con la URL de Railway:
1. Importa la colección `POSTMAN_COLLECTION_COMPLETE.json`
2. Cambia `baseUrl` a tu URL de Railway
3. Ejecuta los tests

### 🔍 Logs y Debugging

Para ver logs en Railway:
1. Ve a tu proyecto en Railway
2. Haz clic en la pestaña "Deployments"
3. Selecciona el deployment activo
4. Ve a "View Logs"

### 🚨 Troubleshooting

**Si el deploy falla:**
1. Revisa los logs en Railway
2. Verifica que `JWT_SECRET` esté configurado
3. Asegúrate de que PostgreSQL esté conectado

**Si la DB no se conecta:**
1. Verifica que el addon PostgreSQL esté activo
2. Las variables `DATABASE_URL`, `PGHOST`, etc. se configuran automáticamente

**Si los CORS fallan:**
1. Configura `CORS_ORIGIN` con tu domain frontend
2. O déjalo en `*` para desarrollo

## 🎯 Estructura del Proyecto

```
src/
├── app.ts                      # Punto de entrada
├── domain/                     # Lógica de negocio
├── application/               # Servicios de aplicación
├── infrastructure/           # Base de datos y servicios externos
└── presentation/            # Controladores y rutas
```

## 📊 Base de Datos

El proyecto incluye seeders que se ejecutan automáticamente:
- 15 tags de servicios
- 10 usuarios de prueba
- 9 ofertas de ejemplo
- 21 preferencias de muestra
- Datos de ubicación (Argentina completa)

**Usuario de prueba:**
- Email: `ana.garcia@example.com`
- Password: `123456`
