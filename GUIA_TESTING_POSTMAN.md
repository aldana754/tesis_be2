# 🚀 Guía Completa para Probar el Sistema de Preferencias - Backend Tesis

## 📋 Estado Actual del Sistema

✅ **Base de datos poblada exitosamente** con:
- 🌎 1 país (Argentina), 24 provincias, 360 localidades
- 🏷️ 15 tags de servicios (plomería, electricidad, jardinería, etc.)
- 👥 10 usuarios de prueba (9 proveedores + 1 cliente)
- 📝 9 ofertas de servicios diversas
- ❤️ 21 preferencias de ejemplo (usuarios autenticados y anónimos)

✅ **Servidor ejecutándose** en: `http://localhost:3000`
✅ **Sistema de preferencias implementado** con selección múltiple (máximo 5 tags)

## 🔧 Configuración Inicial

### 1. Importar Colección de Postman
1. Abrir Postman
2. Importar el archivo: `POSTMAN_COLLECTION_COMPLETE.json`
3. La colección incluye todas las rutas y casos de prueba

### 2. Configurar Variables de Entorno
En Postman, crear un Environment con estas variables:
- `baseUrl`: `http://localhost:3000/api`
- `authToken`: (se completará automáticamente al hacer login)
- `userId`: (se completará automáticamente al hacer login)
- `offerId`: (se completará automáticamente al crear ofertas)

## 🎯 Casos de Prueba Principales

### **🔐 Autenticación**

#### 1. Login con Usuario Preexistente
```http
POST {{baseUrl}}/auth/login
{
  "email": "ana.garcia@example.com",
  "password": "123456"
}
```
**Resultado esperado**: Token JWT guardado automáticamente

#### 2. Crear Nuevo Usuario
```http
POST {{baseUrl}}/auth/register
{
  "role": "CLIENT",
  "firstName": "TestUser",
  "lastname": "Example",
  "email": "test@example.com",
  "password": "123456",
  "phoneNumber": "+54 11 1234-5678",
  "localityId": 1
}
```

### **❤️ Sistema de Preferencias (FUNCIONALIDAD PRINCIPAL)**

#### 3. Agregar Preferencia Individual
```http
POST {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
{
  "tagId": 1
}
```

#### 4. Agregar Múltiples Preferencias (FEATURE ESTRELLA)
```http
POST {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
{
  "tagIds": [1, 3, 5, 7, 9]
}
```
**Nota**: Máximo 5 tags por usuario

#### 5. Preferencias Anónimas (Sin autenticación)
```http
POST {{baseUrl}}/preferences
{
  "tagIds": [2, 4, 6]
}
```

#### 6. Ver Preferencias del Usuario
```http
GET {{baseUrl}}/preferences/user
Authorization: Bearer {{authToken}}
```

#### 7. Ver Estadísticas Generales
```http
GET {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
```

### **🏷️ Gestión de Tags**

#### 8. Listar Todos los Tags (Público)
```http
GET {{baseUrl}}/tags
```

#### 9. Crear Nuevo Tag
```http
POST {{baseUrl}}/tags
Authorization: Bearer {{authToken}}
{
  "name": "Testing",
  "description": "Servicios de testing y QA",
  "color": "#9C27B0"
}
```

### **📝 Gestión de Ofertas**

#### 10. Listar Ofertas
```http
GET {{baseUrl}}/offers
```

#### 11. Crear Nueva Oferta
```http
POST {{baseUrl}}/offers
Authorization: Bearer {{authToken}}
{
  "title": "Desarrollo Web Moderno",
  "shortDescription": "Sitios web con React y Node.js",
  "longDescription": "Desarrollo completo de aplicaciones web...",
  "price": 5000,
  "priceUnit": "PER_PROJECT",
  "currency": "ARS",
  "tagIds": [8, 15],
  "localityId": 1
}
```

#### 12. Buscar Ofertas por Tag
```http
GET {{baseUrl}}/offers?tagId=1
```

### **👤 Gestión de Usuarios**

#### 13. Ver Perfil de Usuario
```http
GET {{baseUrl}}/users/profile
Authorization: Bearer {{authToken}}
```

#### 14. Actualizar Perfil
```http
PUT {{baseUrl}}/users/profile
Authorization: Bearer {{authToken}}
{
  "firstName": "NuevoNombre",
  "phoneNumber": "+54 11 9999-8888"
}
```

### **📍 Datos de Ubicación**

#### 15. Listar Países
```http
GET {{baseUrl}}/locations/countries
```

#### 16. Listar Provincias
```http
GET {{baseUrl}}/locations/countries/1/provinces
```

#### 17. Listar Localidades
```http
GET {{baseUrl}}/locations/provinces/1/localities
```

## 🧪 Casos de Prueba de Error

### **❌ Validaciones del Sistema de Preferencias**

#### 18. Exceder Límite de Preferencias (debe fallar)
```http
POST {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
{
  "tagIds": [1, 2, 3, 4, 5, 6]
}
```
**Resultado esperado**: Error 400 - "Maximum 5 preferences allowed"

#### 19. Tag Inexistente (debe fallar)
```http
POST {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
{
  "tagId": 9999
}
```
**Resultado esperado**: Error 404 - "Tag not found"

#### 20. Preferencia Duplicada (debe fallar)
```http
POST {{baseUrl}}/preferences
Authorization: Bearer {{authToken}}
{
  "tagId": 1
}
```
**Resultado esperado**: Error 409 - "Preference already exists"

## 📊 Datos de Prueba Disponibles

### Usuarios Preexistentes:
- **ana.garcia@example.com** (OWNER) - Password: 123456
- **carlos.rodriguez@example.com** (OWNER) - Password: 123456
- **lucia.fernandez@example.com** (OWNER) - Password: 123456
- **mario.santos@example.com** (CLIENT) - Password: 123456

### Tags Disponibles (IDs 1-15):
1. Plomería
2. Electricidad
3. Jardinería
4. Carpintería
5. Pintura
6. Limpieza
7. Albañilería
8. Informática
9. Mecánica
10. Soldadura
11. Vidriería
12. Cerrajería
13. Tapicería
14. Refrigeración
15. Decoración

### Ofertas Creadas (IDs 1-9):
- Reparación de plomería
- Instalaciones eléctricas
- Diseño de jardines
- Muebles de madera
- Pintura de interiores
- Limpieza profunda
- Construcción de muros
- Desarrollo de software
- Reparación de vehículos

## 🌐 URLs de Prueba

- **API Base**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **Test UI Preferencias**: http://localhost:3000/test-preferences
- **Test UI Chat**: http://localhost:3000/test-chat

## 🚨 Troubleshooting

### Si el servidor no responde:
1. Verificar que PostgreSQL esté ejecutándose
2. Revisar la configuración en `.env`
3. Reiniciar el servidor: `npm run dev`

### Si hay errores de autenticación:
1. Verificar que el token esté configurado en Postman
2. Usar el endpoint de login para obtener un token fresco
3. Verificar que el header Authorization esté presente

### Si las preferencias no se guardan:
1. Verificar que el usuario esté autenticado
2. Comprobar que los tagIds existan
3. Verificar que no se excedan las 5 preferencias máximas

## 📈 Métricas de Éxito

**✅ Sistema funcionando correctamente si:**
- Login genera token JWT válido
- Se pueden agregar hasta 5 preferencias por usuario
- Las preferencias anónimas se guardan sin user_id
- Los tags se listan correctamente
- Las ofertas se crean y consultan exitosamente
- Las validaciones de error funcionan como se espera

**🎯 Caso de uso principal:** Un usuario puede seleccionar hasta 5 tags de turismo de su preferencia, tanto autenticado como anónimo, y el sistema mantiene estas estadísticas para análisis posteriores.
