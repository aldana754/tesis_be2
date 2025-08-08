# API Testing Examples - Complete Guide

## Base URL
```
http://localhost:3000
```

## Authentication

⚠️ **IMPORTANT**: All endpoints except authentication ones require a Bearer token in the Authorization header.

### Authentication Flow

#### 1. Register a New User
**POST** `/api/auth/register`
```json
{
  "firstName": "Juan",
  "lastname": "Pérez",
  "email": "juan.perez@example.com",
  "password": "123456",
  "phoneNumber": "+5491123456789",
  "role": "CLIENT"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastname": "Pérez",
      "email": "juan.perez@example.com",
      "role": "USER",
      "profilePhotoUrl": null
    }
  }
}
```

#### 2. Login
**POST** `/api/auth/login`
```json
{
  "email": "juan.perez@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastname": "Pérez",
      "email": "juan.perez@example.com",
      "role": "USER",
      "profilePhotoUrl": null
    }
  }
}
```

#### 3. Validate Token
**GET** `/api/auth/validate`
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "message": "Token is valid",
  "data": {
    "userId": 1,
    "email": "juan.perez@example.com",
    "role": "USER"
  }
}
```

---

## Using Authentication in Requests

For all protected endpoints, include the Authorization header:

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

---

## Testing Flow - Step by Step

### 1. Health Check
First, verify the server is running:

**GET** `/health`
```json
Response: { "status": "OK", "timestamp": "2025-01-01T00:00:00.000Z" }
```

---

## 2. Location Setup (Required First)

### 2.1 Create Country
**POST** `/api/locations/countries`
```json
{
  "name": "Argentina",
  "code": "AR"
}
```

### 2.2 Create Province
**POST** `/api/locations/provinces`
```json
{
  "name": "Buenos Aires",
  "countryId": 1
}
```

### 2.3 Create Locality
**POST** `/api/locations/localities`
```json
{
  "name": "La Plata",
  "provinceId": 1
}
```

---

## 3. User Management

### 3.1 Create User (with automatic address creation)
**POST** `/api/users`
```json
{
  "firstName": "Juan",
  "lastname": "Pérez",
  "email": "juan@email.com",
  "password": "password123",
  "phoneNumber": "+54911234567",
  "address": {
    "localityId": 1,
    "street": "Calle 7",
    "floor": "2A",
    "postalCode": "1900"
  }
}
```

**Alternative: Create User without address (will be null)**
```json
{
  "firstName": "María",
  "lastname": "García",
  "email": "maria@email.com",
  "password": "password123",
  "phoneNumber": "+54911111111"
}
```

### 3.2 Get All Users
**GET** `/api/users`

### 3.3 Get User by ID
**GET** `/api/users/1`

### 3.4 Update User
**PUT** `/api/users/1`
```json
{
  "firstName": "Juan Carlos",
  "phoneNumber": "+54911111111"
}
```

### 3.5 Upload Profile Photo
**POST** `/api/users/1/profile-photo`

**Request Type:** `multipart/form-data`

**Body (form-data):**
- Key: `photo`
- Type: `File`
- Value: Select an image file (jpg, png, gif, etc.)

**Expected Response:**
```json
{
  "message": "Profile photo updated successfully",
  "user": {
    "id": 1,
    "role": "USER",
    "firstName": "Juan",
    "lastname": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phoneNumber": "+54911234567",
    "profilePhotoUrl": "https://your-bucket.s3.region.amazonaws.com/profile-photos/uuid-filename.jpg",
    "addressId": 1,
    "offers": [],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T11:30:00Z"
  },
  "profilePhotoUrl": "https://your-bucket.s3.region.amazonaws.com/profile-photos/uuid-filename.jpg"
}
```

**Notes:**
- Only image files are allowed (image/*)
- Maximum file size: 10MB
- Files are automatically uploaded to AWS S3
- The photo URL will be publicly accessible
- Old profile photos are not automatically deleted (this could be improved)

---

## 4. Offer Management

### 4.1 Create Offer (with automatic address creation)
**POST** `/api/offers`
```json
{
  "title": "Casa en La Plata",
  "shortDescription": "Hermosa casa de 3 habitaciones en excelente ubicación",
  "longDescription": "Esta hermosa casa cuenta con 3 habitaciones, 2 baños, cocina integrada, living comedor y patio trasero. Ubicada en una zona muy tranquila y cerca de todos los servicios. Ideal para familia.",
  "price": 150000,
  "priceUnit": "UNIQUE",
  "currency": "USD",
  "ownerId": 1,
  "address": {
    "localityId": 1,
    "street": "Calle 50 entre 7 y 8",
    "floor": "PB",
    "postalCode": "1900"
  }
}
```

**Alternative: Create Offer without address (will be null)**
```json
{
  "title": "Departamento en Centro",
  "shortDescription": "Departamento moderno en el centro de la ciudad",
  "longDescription": "Departamento de 2 ambientes, muy luminoso, con balcón y excelente vista. Ubicado en pleno centro, cerca de transporte público y comercios.",
  "price": 80000,
  "priceUnit": "PER_MONTH",
  "currency": "ARS",
  "ownerId": 1
}
```

**Available Price Units:**
- `UNIQUE` - Precio único (compra/venta)
- `PER_HOUR` - Por hora
- `PER_DAY` - Por día  
- `PER_WEEK` - Por semana
- `PER_MONTH` - Por mes
- `PER_PERSON` - Por persona

**Available Currencies:**
- `USD` - Dólar estadounidense
- `ARS` - Peso argentino
- `EUR` - Euro
- `BRL` - Real brasileño
- `CLP` - Peso chileno
- `UYU` - Peso uruguayo
- `PYG` - Guaraní paraguayo
- `BOB` - Boliviano
- `COP` - Peso colombiano
- `PEN` - Sol peruano

### 4.2 Get All Offers
**GET** `/api/offers`

### 4.3 Get Offer by ID
**GET** `/api/offers/1`

### 4.4 Get Offers by Owner
**GET** `/api/offers/user/1`

### 4.5 Update Offer
**PUT** `/api/offers/1`
```json
{
  "price": 160000,
  "currency": "USD",
  "shortDescription": "Hermosa casa de 3 habitaciones en excelente ubicación - PRECIO ACTUALIZADO",
  "longDescription": "Esta hermosa casa cuenta con 3 habitaciones, 2 baños, cocina integrada, living comedor y patio trasero. Ubicada en una zona muy tranquila y cerca de todos los servicios. Ideal para familia. PRECIO ACTUALIZADO POR NEGOCIACIÓN."
}
```

---

## 5. Review System (NEW!)

### 5.1 Create Review
**POST** `/api/reviews`
```json
{
  "offerId": 1,
  "userId": 2,
  "comment": "Excelente propiedad, muy bien ubicada y en perfecto estado. La recomiendo completamente.",
  "rating": 5
}
```

**Validation Examples:**
```json
// Invalid rating (must be 1-5)
{
  "offerId": 1,
  "userId": 2,
  "comment": "Comentario válido",
  "rating": 6
}

// Comment too long (max 600 characters)
{
  "offerId": 1,
  "userId": 2,
  "comment": "Este es un comentario muy largo que excede los 600 caracteres permitidos...",
  "rating": 4
}
```

### 5.2 Get Review by ID
**GET** `/api/reviews/1`

### 5.3 Get Reviews by Offer
**GET** `/api/offers/1/reviews`

### 5.4 Get Reviews by User
**GET** `/api/users/2/reviews`

### 5.5 Get All Reviews
**GET** `/api/reviews`

### 5.6 Update Review
**PUT** `/api/reviews/1`
```json
{
  "userId": 2,
  "comment": "Actualizo mi comentario: La propiedad está muy bien pero el precio podría ser mejor.",
  "rating": 4
}
```

### 5.7 Delete Review
**DELETE** `/api/reviews/1`
```json
{
  "userId": 2
}
```

### 5.8 Get Offer Statistics
**GET** `/api/offers/1/statistics`
```json
Response: {
  "totalReviews": 3,
  "averageRating": 4.33,
  "ratingDistribution": {
    "5": 1,
    "4": 2,
    "3": 0,
    "2": 0,
    "1": 0
  }
}
```

---

## 6. Address Management

### 6.1 Create Address
**POST** `/api/addresses`
```json
{
  "street": "Calle 7",
  "number": "123",
  "floor": "2",
  "apartment": "A",
  "zipCode": "1900",
  "localityId": 1
}
```

### 6.2 Get Address by ID
**GET** `/api/addresses/1`

---

## Error Testing Scenarios

### Offer Validations

1. **Missing required fields:**
```json
POST /api/offers
{
  "title": "Casa sin descripción",
  "price": 150000
  // Missing shortDescription, longDescription, ownerId
}
Response: 400 - "title, shortDescription, longDescription, price and ownerId are required"
```

2. **Short description too long (max 200 characters):**
```json
POST /api/offers
{
  "title": "Casa en La Plata",
  "shortDescription": "Esta es una descripción muy larga que excede los 200 caracteres permitidos para la descripción corta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "longDescription": "Descripción válida",
  "price": 150000,
  "ownerId": 1
}
Response: 400 - "Short description must not exceed 200 characters"
```

3. **Long description too long (max 600 characters):**
```json
POST /api/offers
{
  "title": "Casa en La Plata",
  "shortDescription": "Descripción corta válida",
  "longDescription": "Esta es una descripción muy larga que excede los 600 caracteres permitidos... [texto muy largo]",
  "price": 150000,
  "ownerId": 1
}
Response: 400 - "Long description must not exceed 600 characters"
```

4. **Invalid price (negative):**
```json
POST /api/offers
{
  "title": "Casa en La Plata",
  "shortDescription": "Descripción corta",
  "longDescription": "Descripción larga",
  "price": -1000,
  "ownerId": 1
}
Response: 400 - "Price must be greater than or equal to 0"
```

### Review Validations

1. **User cannot review their own offer:**
```json
POST /api/reviews
{
  "offerId": 1,
  "userId": 1,  // Same user who created the offer
  "comment": "Mi propia casa",
  "rating": 5
}
Response: 400 - "Users cannot review their own offers"
```

2. **User cannot review the same offer twice:**
```json
POST /api/reviews (after already creating one)
{
  "offerId": 1,
  "userId": 2,
  "comment": "Segunda review",
  "rating": 4
}
Response: 400 - "User has already reviewed this offer"
```

3. **Invalid rating:**
```json
POST /api/reviews
{
  "offerId": 1,
  "userId": 2,
  "comment": "Comentario válido",
  "rating": 0  // or 6, 7, etc.
}
Response: 400 - "Rating must be between 1 and 5"
```

4. **Comment too long:**
```json
POST /api/reviews
{
  "offerId": 1,
  "userId": 2,
  "comment": "Este comentario tiene más de 600 caracteres...", // >600 chars
  "rating": 5
}
Response: 400 - "Comment must be 600 characters or less"
```

---

## Complete Testing Flow

### Step 1: Basic Setup
1. Check health endpoint
2. Create country → province → locality
3. Create at least 2 users

### Step 2: Create Content
1. Create offers with the first user
2. Create reviews with the second user
3. Test address creation

### Step 3: Validation Testing
1. Try invalid review scenarios
2. Test update/delete permissions
3. Verify statistics calculations

### Step 4: Data Retrieval
1. Get all entities with their relationships
2. Test filtering by user/offer
3. Verify statistics are accurate

---

## Expected Response Formats

### User Response
```json
{
  "id": 1,
  "firstName": "Juan",
  "lastname": "Pérez",
  "email": "juan@email.com",
  "phoneNumber": "+54911234567",
  "role": "USER",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "addressId": 1
}
```

### Offer Response
```json
{
  "id": 1,
  "title": "Casa en La Plata",
  "shortDescription": "Hermosa casa de 3 habitaciones en excelente ubicación",
  "longDescription": "Esta hermosa casa cuenta con 3 habitaciones, 2 baños, cocina integrada, living comedor y patio trasero. Ubicada en una zona muy tranquila y cerca de todos los servicios. Ideal para familia.",
  "price": 150000,
  "priceUnit": "UNIQUE",
  "currency": "USD",
  "createdAt": "2025-01-15T11:00:00.000Z",
  "ownerId": 1,
  "addressId": 2,
  "owner": { 
    "id": 1, 
    "firstName": "Juan", 
    "lastname": "Pérez",
    "email": "juan@email.com" 
  },
  "address": {
    "id": 2,
    "street": "Calle 50 entre 7 y 8",
    "floor": "PB",
    "postalCode": "1900",
    "locality": {
      "id": 1,
      "name": "La Plata",
      "province": {
        "id": 1,
        "name": "Buenos Aires",
        "country": { "id": 1, "name": "Argentina" }
      }
    }
  }
}
```

### Review Response
```json
{
  "id": 1,
  "comment": "Excelente propiedad, muy bien ubicada.",
  "rating": 5,
  "createdAt": "2025-01-15T12:00:00.000Z",
  "user": { 
    "id": 2, 
    "firstName": "María", 
    "lastname": "García",
    "email": "maria@email.com" 
  },
  "offer": { "id": 1, "title": "Casa en La Plata" }
}
```

---

## Quick Start Commands

If you want to quickly populate the database for testing:

1. **Health Check:** `GET /api/health`
2. **Create Location:** Country → Province → Locality
3. **Create 2 Users with addresses:** One for offers, one for reviews  
4. **Create Offer:** With first user
5. **Upload Offer Multimedia:** Add main photo and additional multimedia
6. **Test Chat System:** Create conversation and send messages
7. **Create Review:** With second user
8. **Test Statistics:** `GET /api/offers/1/statistics`

---

## 9. Chat System (Real-time with WebSocket)

### 9.1 Contact an Offer (Create Conversation)
**POST** `/api/offers/1/contact`

**Body:**
```json
{
  "clientId": 2
}
```

**Expected Response:**
```json
{
  "message": "Conversation created or retrieved successfully",
  "conversation": {
    "id": 1,
    "offerId": 1,
    "clientId": 2,
    "ownerId": 1,
    "status": "ACTIVE",
    "lastMessageAt": null,
    "clientUnreadCount": 0,
    "ownerUnreadCount": 0,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

### 9.2 Get User's Conversations
**GET** `/api/users/1/conversations`

**Expected Response:**
```json
[
  {
    "id": 1,
    "offerId": 1,
    "clientId": 2,
    "ownerId": 1,
    "status": "ACTIVE",
    "lastMessageAt": "2025-01-15T11:30:00.000Z",
    "clientUnreadCount": 0,
    "ownerUnreadCount": 2,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T11:30:00.000Z"
  }
]
```

### 9.3 Send Message (HTTP - also available via WebSocket)
**POST** `/api/conversations/1/messages`

**Body:**
```json
{
  "senderId": 2,
  "content": "Hola, me interesa tu oferta. ¿Podríamos coordinar una visita?",
  "messageType": "TEXT"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "conversationId": 1,
  "senderId": 2,
  "content": "Hola, me interesa tu oferta. ¿Podríamos coordinar una visita?",
  "messageType": "TEXT",
  "isRead": false,
  "readAt": null,
  "createdAt": "2025-01-15T11:30:00.000Z"
}
```

### 9.4 Get Conversation Messages
**GET** `/api/conversations/1/messages?userId=1&limit=50&offset=0`

**Expected Response:**
```json
[
  {
    "id": 1,
    "conversationId": 1,
    "senderId": 2,
    "content": "Hola, me interesa tu oferta. ¿Podríamos coordinar una visita?",
    "messageType": "TEXT",
    "isRead": false,
    "readAt": null,
    "createdAt": "2025-01-15T11:30:00.000Z"
  },
  {
    "id": 2,
    "conversationId": 1,
    "senderId": 1,
    "content": "¡Hola! Claro, podemos coordinar. ¿Qué día te viene bien?",
    "messageType": "TEXT",
    "isRead": true,
    "readAt": "2025-01-15T11:35:00.000Z",
    "createdAt": "2025-01-15T11:32:00.000Z"
  }
]
```

### 9.5 Mark Conversation as Read
**PUT** `/api/conversations/1/messages/read`

**Body:**
```json
{
  "userId": 2
}
```

**Expected Response:**
```json
{
  "message": "Conversation messages marked as read"
}
```

### 9.6 WebSocket Events (Real-time)

**Connection URL:** `ws://localhost:3000`

**Client Events (Send to server):**
```javascript
// Connect user
socket.emit('user-connect', { userId: 1 });

// Join conversation
socket.emit('join-conversation', { conversationId: 1, userId: 1 });

// Send message
socket.emit('send-message', {
  conversationId: 1,
  senderId: 1,
  content: "Mensaje en tiempo real",
  messageType: "TEXT"
});

// Typing indicators
socket.emit('typing-start', { conversationId: 1, userId: 1 });
socket.emit('typing-stop', { conversationId: 1, userId: 1 });

// Mark as read
socket.emit('mark-as-read', { conversationId: 1, userId: 1 });
```

**Server Events (Receive from server):**
```javascript
// New message received
socket.on('message-received', (data) => {
  console.log('New message:', data.message);
});

// User typing
socket.on('user-typing', (data) => {
  console.log(`User ${data.userId} is typing: ${data.isTyping}`);
});

// Messages read
socket.on('messages-read', (data) => {
  console.log(`Messages read by user ${data.readBy}`);
});

// Notifications
socket.on('new-message-notification', (data) => {
  console.log('New message notification:', data);
});

// User status
socket.on('user-online', (data) => {
  console.log(`User ${data.userId} is online`);
});
```

**Notes for Chat System:**
- **Real-time**: Messages are delivered instantly via WebSocket
- **Offline Support**: HTTP endpoints for loading message history
- **Read Receipts**: Track when messages are read
- **Typing Indicators**: Show when users are typing
- **Notifications**: Get notified of new messages when not in conversation
- **Context**: Each conversation is tied to a specific offer
- **Security**: Users can only access conversations they participate in

---

### 8.1 Upload Main Photo for Offer
**POST** `/api/offers/1/main-photo`

**Headers:**
- Content-Type: `multipart/form-data`

**Body (form-data):**
- Key: `file` (type: File)
- Value: Select an image file (JPG, PNG, etc.)

**Expected Response:**
```json
{
  "message": "Main photo uploaded successfully",
  "offer": {
    "id": 1,
    "title": "Casa en La Plata",
    "shortDescription": "Casa 3 ambientes",
    "longDescription": "Hermosa casa...",
    "price": 50000,
    "priceUnit": "PER_MONTH",
    "currency": "ARS",
    "mainPhoto": "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/main-photos/uuid-filename.jpg",
    "multimedia": [],
    "ownerId": 1,
    "addressId": 1,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

### 8.2 Upload Multiple Multimedia Files for Offer  
**POST** `/api/offers/1/multimedia`

**Headers:**
- Content-Type: `multipart/form-data`

**Body (form-data):**
- Key: `files` (type: File, multiple files allowed)
- Value: Select multiple image/video files (up to 10 files)

**Expected Response:**
```json
{
  "message": "3 files uploaded successfully",
  "uploadedUrls": [
    "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file1.jpg",
    "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file2.mp4",
    "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file3.png"
  ],
  "offer": {
    "id": 1,
    "title": "Casa en La Plata",
    "mainPhoto": "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/main-photos/uuid-mainphoto.jpg",
    "multimedia": [
      "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file1.jpg",
      "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file2.mp4",
      "https://tesis-bucket-2025.s3.sa-east-1.amazonaws.com/offers/multimedia/uuid-file3.png"
    ],
    "ownerId": 1,
    "addressId": 1,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z"
  }
}
```

**Notes for Offer Multimedia:**
- **Main Photo**: Only one main photo per offer. If you upload a new one, it replaces the previous one
- **Multimedia**: Multiple files are supported (images and videos). New uploads are added to the existing array
- **File Types**: Images (JPG, PNG, GIF, WebP) and Videos (MP4, AVI, MOV, etc.)
- **File Size Limit**: 10MB per file
- **Maximum Files**: Up to 10 files per upload request
- **S3 Storage**: All files are stored in AWS S3 with public access URLs

---

**Important Notes:**
- Users can be created with or without an address
- If address is provided, it will be automatically created and linked to the user
- Make sure to create the location hierarchy (Country → Province → Locality) before creating users with addresses

¡Comienza con el Health Check y sigue el flujo paso a paso! 🚀
