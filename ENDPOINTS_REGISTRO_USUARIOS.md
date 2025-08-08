# Guía de Endpoints para Registro y Gestión de Usuarios

## ⚠️ IMPORTANTE: Diferencia entre Registro Público y Gestión Administrativa

Este sistema tiene **DOS formas diferentes** de trabajar con usuarios, cada una con propósitos distintos y niveles de autorización diferentes:

## 1. 🔓 REGISTRO PÚBLICO (Sin Token) 

### Endpoint: `/api/auth/register`
- **Método**: POST
- **Autenticación**: ❌ NO requiere token
- **Propósito**: Permitir que nuevos usuarios se registren en la aplicación
- **Usado por**: Usuarios nuevos que quieren crear una cuenta

**Ejemplo de uso:**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastname": "Pérez", 
  "email": "juan.perez@example.com",
  "password": "123456",
  "phoneNumber": "+5491123456789",
  "role": "CLIENT"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastname": "Pérez",
      "email": "juan.perez@example.com", 
      "role": "CLIENT",
      "profilePhotoUrl": null
    }
  }
}
```

## 2. 🔒 GESTIÓN ADMINISTRATIVA (Con Token)

### Endpoint: `/api/users`
- **Método**: POST/GET/PUT/DELETE
- **Autenticación**: ✅ SÍ requiere token
- **Propósito**: Permitir que administradores gestionen usuarios existentes
- **Usado por**: Administradores que ya están autenticados

**Ejemplo de uso:**
```bash
POST http://localhost:3000/api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Admin",
  "lastname": "Created", 
  "email": "admin.created@example.com",
  "password": "123456",
  "phoneNumber": "+5491123456789",
  "role": "CLIENT"
}
```

## 📋 Resumen de Endpoints

| Endpoint | Método | Token Requerido | Propósito | Usuario Típico |
|----------|--------|-----------------|-----------|----------------|
| `/api/auth/register` | POST | ❌ NO | Registro público | Usuario nuevo |
| `/api/auth/login` | POST | ❌ NO | Inicio de sesión | Usuario existente |
| `/api/auth/validate` | GET | ❌ NO* | Validar token | Aplicación cliente |
| `/api/users` | POST | ✅ SÍ | Crear usuario (admin) | Administrador |
| `/api/users` | GET | ✅ SÍ | Listar usuarios | Administrador |
| `/api/users/:id` | GET | ✅ SÍ | Ver usuario específico | Usuario/Admin |
| `/api/users/:id` | PUT | ✅ SÍ | Actualizar usuario | Usuario/Admin |
| `/api/users/:id` | DELETE | ✅ SÍ | Eliminar usuario | Administrador |

*El endpoint `/api/auth/validate` requiere token en el header, pero no middleware de autenticación.

## 🔧 Solución al Problema

Si estás recibiendo el error "Access token required" al intentar registrar usuarios, verifica que estés usando el endpoint correcto:

✅ **CORRECTO**: `POST /api/auth/register` (sin token)  
❌ **INCORRECTO**: `POST /api/users` (requiere token)

**Recuerda**: El registro de usuarios es una operación pública que no requiere autenticación previa.

## 🧪 Pruebas con PowerShell

### Registro público (sin token):
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"firstName":"Test","lastname":"User","email":"test@example.com","password":"123456","phoneNumber":"+123456789","role":"CLIENT"}'
```

### Login (sin token):
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"123456"}'
```

### Gestión administrativa (con token):
```powershell
$token = "tu_token_aqui"
Invoke-RestMethod -Uri "http://localhost:3000/api/users" -Method Post -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer $token"} -Body '{"firstName":"Admin","lastname":"User","email":"admin@example.com","password":"123456"}'
```
