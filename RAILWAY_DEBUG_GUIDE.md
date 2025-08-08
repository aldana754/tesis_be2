# 🔧 Railway Debugging Guide - Endpoints de Registro

## 📊 Endpoints de Debugging para Railway

Una vez que Railway termine el deploy (2-3 minutos), puedes probar estos endpoints para diagnosticar el problema:

### 1. **Verificar que la API está funcionando**
```bash
GET https://tu-app.railway.app/
```
**Debería devolver:**
```json
{
  "status": "API is running",
  "timestamp": "2025-08-08T...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. **Endpoint de debug específico**
```bash
GET https://tu-app.railway.app/debug
```
**Debería devolver:**
```json
{
  "status": "Debug endpoint",
  "environment": "production", 
  "port": 3000,
  "timestamp": "2025-08-08T...",
  "routes_configured": true,
  "auth_routes_public": true,
  "message": "If you see this, the server is running correctly"
}
```

### 3. **Test de endpoint sin autenticación**
```bash
POST https://tu-app.railway.app/test-register
Content-Type: application/json

{}
```
**Debería devolver:**
```json
{
  "success": true,
  "message": "Test register endpoint reached without authentication",
  "body_received": true,
  "timestamp": "2025-08-08T..."
}
```

### 4. **Probar registro original (el que debería funcionar)**
```bash
POST https://tu-app.railway.app/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastname": "Railway",
  "email": "test-railway@example.com",
  "password": "123456",
  "phoneNumber": "+123456789",
  "role": "CLIENT"
}
```

### 5. **Probar rutas explícitas de backup**
Si el anterior falla, prueba este (backup):
```bash
POST https://tu-app.railway.app/api/auth/register
Content-Type: application/json

{
  "firstName": "Test",
  "lastname": "Railway",
  "email": "test-railway2@example.com", 
  "password": "123456",
  "phoneNumber": "+123456789",
  "role": "CLIENT"
}
```

## 🔍 Revisión de Logs

En Railway, ve a la pestaña "Logs" y busca estos mensajes:

### ✅ **Logs exitosos esperados:**
```
[APP] Configuring public routes...
[AUTH ROUTES] Configuring public authentication routes...
[AUTH ROUTES] Public authentication routes configured successfully
[APP] Auth routes registered at /api
[EXPLICIT] Direct register route called
[APP] Public routes configured successfully
[APP] Database connected successfully
[APP] Server is running on http://0.0.0.0:3000
```

### 🔍 **Logs de debugging de peticiones:**
```
[DEBUG] POST /api/auth/register - Auth header: None
[AUTH ROUTES] Register endpoint called
```

### ❌ **Logs problemáticos a buscar:**
```
[AUTH DEBUG] POST /api/auth/register - Headers: Token present
Access token required
```

## 🚨 Si aún hay problemas:

1. **Comparte la URL de tu app en Railway**
2. **Comparte los logs de Railway** cuando haces la petición
3. **Prueba los endpoints de debugging** y comparte los resultados

## 💡 Posibles causas restantes:

1. **Proxy/Load Balancer de Railway** añadiendo headers
2. **Variables de entorno** incorrectas en Railway
3. **Caché de Railway** sirviendo versión antigua
4. **Configuración de red** de Railway

Una vez que pruebes estos endpoints, sabremos exactamente dónde está el problema.
