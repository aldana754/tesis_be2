# 🏗️ **Explicación Completa del Sistema - Plataforma de Servicios**

## 📋 **¿Qué es este proyecto?**

Este es un **backend completo** para una plataforma donde las personas pueden:
- **Registrarse** como clientes o propietarios de servicios
- **Publicar ofertas** de servicios (como plomería, jardinería, tutorías, etc.)
- **Buscar y contratar** servicios de otros usuarios
- **Chatear** en tiempo real para negociar
- **Dejar reseñas** sobre los servicios recibidos
- **Subir fotos y videos** de sus servicios

---

## 🧱 **Arquitectura del Sistema (Clean Architecture)**

Tu proyecto sigue el patrón de **Arquitectura Limpia**, que organiza el código en capas bien definidas:

### **1. Capa de Dominio (`src/domain/`)**
**¿Qué es?** El corazón del negocio - las reglas que nunca cambian.

#### **Entidades principales:**
- `User.ts` - Representa a una persona (cliente o propietario de servicios)
- `Offer.ts` - Representa un servicio que alguien ofrece
- `Review.ts` - Representa una calificación/comentario sobre un servicio
- `Message.ts` - Representa un mensaje individual en el chat
- `Conversation.ts` - Representa una conversación entre dos personas
- `Locations.ts` - Maneja países, provincias y localidades

#### **Casos de uso (`usecases/`):**
- `UserProfileUseCases.ts` - Lógica para crear, actualizar y gestionar usuarios
- `OfferUseCases.ts` - Lógica para crear, buscar y gestionar ofertas
- `AuthUseCases.ts` - Lógica para autenticación y autorización
- `MessageUseCases.ts` - Lógica para envío y gestión de mensajes
- `ReviewUseCases.ts` - Lógica para calificaciones y reseñas

#### **Repositorios (`repositories/`):**
Interfaces que definen cómo se deben guardar y obtener los datos, sin importar dónde se almacenen.

### **2. Capa de Aplicación (`src/application/`)**
**¿Qué es?** Servicios que coordinan las operaciones del negocio.

#### **Servicios principales:**
- `AuthService.ts` - Maneja login, registro, generación de tokens JWT
- `UserService.ts` - Maneja perfiles de usuarios, fotos de perfil
- `OfferService.ts` - Maneja ofertas de servicios, multimedia
- `MessageService.ts` - Maneja el sistema de chat y notificaciones
- `ConversationService.ts` - Maneja las conversaciones entre usuarios
- `ReviewService.ts` - Maneja las calificaciones y comentarios

### **3. Capa de Infraestructura (`src/infrastructure/`)**
**¿Qué es?** La parte técnica - base de datos, servicios externos, implementaciones concretas.

#### **Base de datos (`database/`):**
- `data-source.ts` - Configuración de conexión a PostgreSQL
- `entities/` - Mapeo de las entidades del dominio a tablas de base de datos
- `seeds/` - Datos iniciales para poblar la base de datos

#### **Repositorios (`repositories/`):**
Implementaciones concretas que usan TypeORM para interactuar con PostgreSQL.

#### **Servicios externos (`services/`):**
- `S3Service.ts` - Subida de archivos a Amazon S3
- `JwtService.ts` - Generación y validación de tokens JWT
- `SocketService.ts` - Manejo de WebSockets para chat en tiempo real

### **4. Capa de Presentación (`src/presentation/`)**
**¿Qué es?** La interfaz con el mundo exterior - APIs REST y WebSockets.

#### **Controladores (`controllers/`):**
Manejan las peticiones HTTP, validan datos y devuelven respuestas.

#### **Rutas (`routes/`):**
Definen las URLs de la API y conectan con los controladores correspondientes.

#### **Middleware (`middleware/`):**
- `authMiddleware.ts` - Verifica tokens JWT en rutas protegidas
- `uploadMiddleware.ts` - Maneja subida de archivos con diferentes límites
- `errorHandler.ts` - Maneja errores de forma centralizada

---

## 🔄 **Flujo de una Petición HTTP**

Cuando llega una petición (ejemplo: "Crear una nueva oferta"):

1. **Router** (`offerRoutes.ts`) → Recibe la petición en la URL `/api/offers`
2. **Auth Middleware** → Verifica que el usuario esté autenticado con token JWT
3. **Upload Middleware** → Si hay archivos, los procesa y sube a S3
4. **Controller** (`OfferController.ts`) → Extrae y valida los datos del request
5. **Service** (`OfferService.ts`) → Aplica la lógica de negocio
6. **Use Case** (`OfferUseCases.ts`) → Ejecuta las reglas del dominio
7. **Repository** (`TypeOrmOfferRepository.ts`) → Guarda en PostgreSQL
8. **Response** → Devuelve el resultado al cliente en formato JSON

---

## 🗄️ **Base de Datos (PostgreSQL)**

### **Tablas principales:**

#### **user_profile**
- Almacena información de usuarios (clientes y propietarios)
- Campos: id, role, firstName, lastname, email, password, phoneNumber, etc.

#### **offer**
- Servicios publicados por los propietarios
- Campos: id, title, description, price, mainPhoto, multimedia, ownerId, etc.

#### **review**
- Calificaciones y comentarios sobre servicios
- Campos: id, rating, comment, reviewerId, offerId, etc.

#### **conversation**
- Conversaciones de chat entre usuarios
- Campos: id, participantOneId, participantTwoId, offerId, etc.

#### **message**
- Mensajes individuales dentro de conversaciones
- Campos: id, content, messageType, senderId, conversationId, isRead, etc.

#### **address**
- Direcciones físicas de usuarios y ofertas
- Campos: id, street, number, floor, apartment, localityId, etc.

#### **Datos geográficos:**
- `country` - Países
- `province` - Provincias/Estados
- `locality` - Ciudades/Localidades

---

## 🔐 **Sistema de Autenticación**

### **¿Cómo funciona?**

1. **Registro:**
   - Usuario proporciona email, contraseña, nombre, apellido
   - Sistema hashea la contraseña con bcrypt
   - Se crea el usuario en la base de datos
   - Se genera un token JWT

2. **Login:**
   - Usuario proporciona email y contraseña
   - Sistema verifica credenciales
   - Si son válidas, genera un token JWT (válido por 1 hora)
   - Cliente debe incluir este token en todas las peticiones protegidas

3. **Verificación:**
   - En cada petición protegida, el middleware verifica el token
   - Si el token es válido, extrae la información del usuario
   - Si es inválido o expiró, rechaza la petición

### **Tipos de usuario:**
- `CLIENT` - Busca y contrata servicios
- `OWNER` - Ofrece servicios

### **Rutas protegidas vs públicas:**
- **Públicas:** Registro, login, ver países/provincias
- **Protegidas:** Crear ofertas, enviar mensajes, subir archivos

---

## 📁 **Sistema de Archivos (AWS S3)**

### **¿Dónde se guardan las fotos y videos?**
- Se suben a **Amazon S3** (almacenamiento en la nube)
- El sistema guarda solo la URL en la base de datos
- Se organizan en carpetas por tipo: `profile-photos/`, `offer-photos/`, `offer-multimedia/`

### **Límites de archivos:**
- **Fotos de perfil:** hasta 10MB (JPG, PNG, WebP)
- **Foto principal de oferta:** hasta 25MB (JPG, PNG, WebP)
- **Videos de demostración:** hasta 100MB (MP4, MPEG, MOV, AVI, WebM)

### **Proceso de subida:**
1. Cliente envía archivo en la petición HTTP
2. Multer middleware procesa el archivo
3. S3Service sube el archivo a Amazon S3
4. Se obtiene la URL pública del archivo
5. La URL se guarda en la base de datos

---

## 💬 **Sistema de Chat en Tiempo Real**

### **¿Cómo funciona?**

1. **WebSockets:**
   - Se usa Socket.io para comunicación bidireccional
   - Los usuarios se conectan y se unen a "salas" de conversación
   - Los mensajes se envían instantáneamente

2. **Flujo de mensajes:**
   - Usuario A envía mensaje a Usuario B
   - El mensaje se guarda en la base de datos
   - Se envía inmediatamente por WebSocket al Usuario B
   - Se marca como "entregado" y luego como "leído"

3. **Persistencia:**
   - Todos los mensajes se guardan en PostgreSQL
   - Se puede rastrear si el mensaje fue leído y cuándo
   - Se mantiene historial completo de conversaciones

### **Tipos de mensajes:**
- `TEXT` - Mensajes de texto
- `IMAGE` - Imágenes
- `FILE` - Archivos adjuntos

---

## 🌐 **APIs Disponibles**

### **Rutas Públicas (no necesitan autenticación):**

```
POST /api/auth/register - Registrar nuevo usuario
POST /api/auth/login - Iniciar sesión
POST /api/auth/validate-token - Validar token JWT

GET /api/locations/countries - Obtener todos los países
GET /api/locations/countries/:id - Obtener país por ID
GET /api/locations/provinces - Obtener todas las provincias
GET /api/locations/provinces/:id - Obtener provincia por ID
GET /api/locations/localities - Obtener todas las localidades
GET /api/locations/localities/:id - Obtener localidad por ID

GET /health - Estado del servidor
GET /test-chat - Página de prueba del chat
```

### **Rutas Protegidas (necesitan token JWT):**

#### **Usuarios:**
```
GET /api/users/:id - Ver perfil de usuario
GET /api/users - Ver todos los usuarios
PUT /api/users/:id - Actualizar perfil
DELETE /api/users/:id - Eliminar usuario
POST /api/users/:id/profile-photo - Subir foto de perfil
```

#### **Ofertas:**
```
GET /api/offers - Ver todas las ofertas
GET /api/offers/:id - Ver oferta específica
POST /api/offers - Crear nueva oferta
PUT /api/offers/:id - Actualizar oferta
DELETE /api/offers/:id - Eliminar oferta
POST /api/offers/:id/main-photo - Subir foto principal
POST /api/offers/:id/multimedia - Subir videos/fotos adicionales
```

#### **Reseñas:**
```
GET /api/reviews - Ver todas las reseñas
GET /api/reviews/:id - Ver reseña específica
POST /api/reviews - Crear nueva reseña
PUT /api/reviews/:id - Actualizar reseña
DELETE /api/reviews/:id - Eliminar reseña
```

#### **Chat:**
```
GET /api/conversations - Ver conversaciones del usuario
GET /api/conversations/:id - Ver conversación específica
POST /api/conversations - Iniciar nueva conversación
GET /api/conversations/:id/messages - Ver mensajes de conversación
POST /api/messages - Enviar nuevo mensaje
PUT /api/messages/:id/read - Marcar mensaje como leído
```

---

## 🚀 **¿Cómo se ejecuta todo?**

### **Proceso de inicio:**

1. **Inicio:** Se ejecuta `src/app.ts`
2. **Configuración:** Se cargan variables de entorno (`.env`)
3. **Base de datos:** Se conecta a PostgreSQL usando TypeORM
4. **Dependencias:** Se crean todas las instancias necesarias (inyección de dependencias)
5. **Middleware:** Se configuran los middleware globales
6. **Rutas:** Se configuran todas las URLs y controladores
7. **WebSockets:** Se inicializa Socket.io para chat
8. **Servidor:** Empieza a escuchar en el puerto 3000
9. **Confirmación:** Se muestran mensajes de éxito en consola

### **Comando para ejecutar:**
```bash
npm run dev
```

---

## 💡 **Características Especiales**

### **1. Inyección de Dependencias**
- Cada clase recibe lo que necesita sin conocer los detalles internos
- Facilita las pruebas y el mantenimiento
- Permite cambiar implementaciones fácilmente

### **2. Manejo de Errores Centralizado**
- Si algo sale mal, el sistema responde con mensajes claros
- Los errores se logean para debugging
- Se devuelven códigos HTTP apropiados

### **3. Validaciones Robustas**
- Se verifica que todos los datos estén correctos antes de procesarlos
- Validación de formatos (email, tipos de archivo, etc.)
- Sanitización de datos de entrada

### **4. Seguridad**
- Solo usuarios autenticados pueden acceder a funciones protegidas
- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración
- Validación de tipos de archivo en uploads

### **5. Escalabilidad**
- Arquitectura modular y desacoplada
- Fácil agregar nuevas funcionalidades
- Base de datos optimizada con índices
- Archivos en cloud storage (S3)

---

## 🔧 **Tecnologías Utilizadas**

### **Backend:**
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático para JavaScript
- **Express.js** - Framework web
- **TypeORM** - ORM para base de datos

### **Base de datos:**
- **PostgreSQL** - Base de datos relacional

### **Autenticación:**
- **JWT** - Tokens de autenticación
- **bcrypt** - Hash de contraseñas

### **Archivos:**
- **AWS S3** - Almacenamiento de archivos
- **Multer** - Manejo de uploads

### **Chat:**
- **Socket.io** - WebSockets para tiempo real

### **Desarrollo:**
- **dotenv** - Variables de entorno
- **nodemon** - Recarga automática en desarrollo

---

## 📊 **Flujos de Trabajo Típicos**

### **1. Registro de Usuario:**
```
Cliente → POST /api/auth/register
→ AuthController valida datos
→ AuthService hashea contraseña
→ AuthRepository guarda en BD
→ Se genera token JWT
→ Cliente recibe token y datos de usuario
```

### **2. Publicar Oferta:**
```
Propietario → POST /api/offers (con token)
→ AuthMiddleware valida token
→ OfferController procesa datos
→ OfferService aplica lógica de negocio
→ OfferRepository guarda en BD
→ Propietario recibe confirmación
```

### **3. Subir Foto a Oferta:**
```
Propietario → POST /api/offers/:id/main-photo (con archivo)
→ AuthMiddleware valida token
→ UploadMiddleware procesa archivo
→ S3Service sube a Amazon S3
→ OfferController actualiza oferta con URL
→ Propietario recibe URL de la foto
```

### **4. Enviar Mensaje:**
```
Usuario → Envía mensaje por WebSocket
→ SocketService recibe mensaje
→ MessageService valida y procesa
→ MessageRepository guarda en BD
→ Se envía a destinatario por WebSocket
→ Se confirma entrega
```

---

## 🎯 **En Resumen**

Este es un sistema completo y profesional para una **plataforma de servicios locales** donde:

✅ **Funcionalidades principales:**
- Registro y autenticación de usuarios
- Publicación y búsqueda de servicios
- Sistema de chat en tiempo real
- Subida de fotos y videos
- Sistema de reseñas y calificaciones
- Gestión de ubicaciones geográficas

✅ **Arquitectura sólida:**
- Clean Architecture para mantenibilidad
- Inyección de dependencias
- Separación clara de responsabilidades
- Código escalable y testeable

✅ **Tecnologías modernas:**
- TypeScript para tipado seguro
- PostgreSQL para persistencia
- AWS S3 para archivos
- WebSockets para tiempo real
- JWT para autenticación

✅ **Listo para producción:**
- Manejo robusto de errores
- Validaciones completas
- Seguridad implementada
- Documentación clara

El código está organizado siguiendo las mejores prácticas de la industria y está preparado para escalarse, mantenerse y evolucionar fácilmente.

---

## 📚 **Para Estudiar Más**

### **Conceptos clave a entender:**
1. **Clean Architecture** - Separación en capas
2. **Dependency Injection** - Inversión de control
3. **Repository Pattern** - Abstracción de datos
4. **JWT Authentication** - Tokens de autenticación
5. **WebSockets** - Comunicación en tiempo real
6. **ORM (TypeORM)** - Mapeo objeto-relacional
7. **RESTful APIs** - Diseño de APIs
8. **Middleware Pattern** - Procesamiento de peticiones

### **Archivos importantes para revisar:**
- `src/app.ts` - Configuración principal
- `src/domain/entities/` - Modelos de negocio
- `src/presentation/controllers/` - Lógica de API
- `src/infrastructure/repositories/` - Acceso a datos
- `src/presentation/middleware/` - Procesamiento de peticiones

¡Espero que esta explicación te ayude a entender mejor todo el sistema! 🚀
