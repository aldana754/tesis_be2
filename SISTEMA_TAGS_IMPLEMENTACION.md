# 🏷️ Sistema de Tags para Ofertas - Implementación Completa

## 📋 **¿Qué hemos agregado?**

Hemos implementado un sistema completo de **tags (etiquetas)** para categorizar las ofertas de servicios con una relación **muchos a muchos**. Esto permite que:

- Una oferta puede tener múltiples tags
- Un tag puede estar asociado a múltiples ofertas
- Los usuarios pueden buscar ofertas por categorías específicas

---

## 🆕 **Nuevos Archivos Creados**

### **1. Entidades del Dominio**
- `src/domain/entities/Tag.ts` - Entidad de negocio para tags
- `src/domain/repositories/TagRepository.ts` - Interface del repositorio
- `src/domain/usecases/TagUseCases.ts` - Lógica de negocio para tags

### **2. Capa de Infraestructura**
- `src/infrastructure/database/entities/TagEntity.ts` - Entidad de base de datos
- `src/infrastructure/repositories/TypeOrmTagRepository.ts` - Implementación del repositorio
- `src/infrastructure/database/seeds/TagSeeder.ts` - Datos iniciales

### **3. Capa de Aplicación**
- `src/application/services/TagService.ts` - Servicio de aplicación

### **4. Capa de Presentación**
- `src/presentation/controllers/TagController.ts` - Controlador HTTP
- `src/presentation/routes/tagRoutes.ts` - Rutas de la API

---

## 🔄 **Archivos Modificados**

### **1. Entidad Offer actualizada**
- `src/domain/entities/Offer.ts` - Agregado campo `tags: Tag[]`
- Método `create` actualizado para incluir tags

### **2. Repositorios actualizados**
- `src/domain/repositories/OfferRepository.ts` - Agregado método `findByTags()`
- `src/infrastructure/repositories/TypeOrmOfferRepository.ts` - Implementación completa con tags

### **3. Casos de uso actualizados**
- `src/domain/usecases/OfferUseCases.ts` - Métodos para manejar tags en ofertas

### **4. Servicios actualizados**
- `src/application/services/OfferService.ts` - Métodos para tags

### **5. Controladores actualizados**
- `src/presentation/controllers/OfferController.ts` - Soporte para tags en creación y búsqueda

### **6. Configuración principal**
- `src/app.ts` - Integración completa del sistema de tags
- `src/infrastructure/database/entities/OfferEntity.ts` - Relación muchos a muchos

---

## 🗄️ **Cambios en la Base de Datos**

### **Nueva tabla: `tag`**
```sql
CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Formato hex para colores
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Nueva tabla de relación: `offer_tags`**
```sql
CREATE TABLE offer_tags (
    offer_id INTEGER REFERENCES offer(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tag(id) ON DELETE CASCADE,
    PRIMARY KEY (offer_id, tag_id)
);
```

### **Tags predefinidos incluidos:**
- Plomería 🔧
- Electricidad ⚡
- Jardinería 🌱
- Limpieza 🧹
- Pintura 🎨
- Carpintería 🪵
- Albañilería 🧱
- Tecnología 💻
- Educación 📚
- Belleza 💄
- Mascotas 🐕
- Transporte 🚚
- Cocina 👨‍🍳
- Fitness 💪
- Reparaciones 🔧

---

## 🌐 **Nuevas APIs Disponibles**

### **Tags (Públicas - no requieren autenticación):**
```
GET /api/tags - Obtener todos los tags
GET /api/tags/:id - Obtener tag específico
```

### **Tags (Protegidas - requieren autenticación):**
```
POST /api/tags - Crear nuevo tag
PUT /api/tags/:id - Actualizar tag
DELETE /api/tags/:id - Eliminar tag
```

### **Ofertas con Tags:**
```
POST /api/offers - Crear oferta con tags
GET /api/offers - Obtener ofertas (opcionalmente filtradas por tags)
GET /api/offers?tags=Plomería,Electricidad - Buscar por tags específicos
```

---

## 💻 **Ejemplos de Uso**

### **1. Crear una oferta con tags:**
```javascript
const response = await fetch('/api/offers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    title: 'Reparación de grifos',
    shortDescription: 'Servicio profesional de plomería',
    longDescription: 'Reparación completa de grifos con garantía',
    price: 2500,
    ownerId: 1,
    tags: ['Plomería', 'Reparaciones']
  })
});
```

### **2. Buscar ofertas por tags:**
```javascript
// Buscar ofertas de plomería
const offers = await fetch('/api/offers?tags=Plomería');

// Buscar ofertas de múltiples categorías
const offers = await fetch('/api/offers?tags=Plomería,Electricidad,Reparaciones');
```

### **3. Obtener todos los tags disponibles:**
```javascript
const tags = await fetch('/api/tags');
// Respuesta:
{
  "message": "Tags obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Plomería",
      "description": "Servicios de instalación y reparación de tuberías",
      "color": "#2196F3",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
    // ... más tags
  ]
}
```

### **4. Crear un nuevo tag:**
```javascript
const newTag = await fetch('/api/tags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>'
  },
  body: JSON.stringify({
    name: 'Cerrajería',
    description: 'Servicios de cerrajería y seguridad',
    color: '#795548'
  })
});
```

---

## 🔍 **Validaciones Implementadas**

### **Para Tags:**
- Nombre único y requerido (máximo 50 caracteres)
- Color en formato hexadecimal válido (#RRGGBB)
- No se puede eliminar un tag si tiene ofertas asociadas

### **Para Ofertas con Tags:**
- Tags deben existir antes de asociarlos a una oferta
- Si se envían tags inexistentes, se rechaza la creación
- Validación de array de strings para tags

---

## 🎯 **Beneficios del Sistema**

### **Para los usuarios:**
- **Búsqueda más eficiente** por categorías
- **Filtrado rápido** de ofertas relevantes
- **Navegación intuitiva** por tipos de servicio

### **Para los propietarios:**
- **Mejor categorización** de sus servicios
- **Mayor visibilidad** en búsquedas específicas
- **Organización clara** de su catálogo

### **Para el sistema:**
- **Escalabilidad** - fácil agregar nuevas categorías
- **Flexibilidad** - múltiples tags por oferta
- **Mantenibilidad** - gestión centralizada de tags

---

## 🚀 **Próximos Pasos Sugeridos**

1. **Implementar estadísticas** de tags más populares
2. **Agregar sugerencias automáticas** de tags
3. **Crear un sistema de jerarquía** de tags (categorías y subcategorías)
4. **Implementar tags trending** según búsquedas
5. **Agregar colores personalizables** por usuario

---

## ✅ **Estado Actual**

El sistema de tags está **completamente implementado y funcional**:

- ✅ Base de datos configurada
- ✅ Entidades y relaciones creadas
- ✅ APIs REST funcionales
- ✅ Validaciones implementadas
- ✅ Tags iniciales poblados
- ✅ Integración completa con ofertas

¡El sistema está listo para usar y los usuarios pueden comenzar a categorizar sus ofertas inmediatamente! 🎉
