# 📊 Sistema de Preferencias de Turismo - Documentación

## 📋 **¿Qué es el Sistema de Preferencias?**

El sistema de preferencias permite recopilar y analizar las preferencias de turismo de los usuarios. Los usuarios pueden elegir sus tipos de turismo favoritos usando los tags existentes, y el sistema genera estadísticas en tiempo real sobre las preferencias más populares.

## 🆕 **Características Principales**

- **Selección Múltiple**: Los usuarios pueden elegir hasta **5 tags** por vez
- **Respuestas Anónimas**: Los usuarios pueden votar sin necesidad de estar registrados
- **Respuestas Autenticadas**: Los usuarios registrados pueden ver su historial de preferencias
- **Límite por Usuario**: Máximo 5 preferencias por usuario autenticado
- **Validación de Duplicados**: No permite seleccionar el mismo tag dos veces
- **Estadísticas en Tiempo Real**: Porcentajes actualizados automáticamente
- **Sin Relaciones**: Tabla independiente que no afecta otras funcionalidades
- **Gestión de Preferencias**: Los usuarios pueden limpiar sus preferencias anteriores

---

## 🗄️ **Estructura de la Base de Datos**

### **Tabla `preference`**
```sql
CREATE TABLE preference (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,  -- NULL para respuestas anónimas
    tag_id INTEGER NOT NULL,
    tag_name VARCHAR(50) NOT NULL,  -- Desnormalizado para performance
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Campos:**
- `id`: Identificador único de la preferencia
- `user_id`: ID del usuario (NULL para respuestas anónimas)
- `tag_id`: ID del tag seleccionado como preferencia
- `tag_name`: Nombre del tag (guardado para evitar JOINs en estadísticas)
- `created_at`: Fecha y hora cuando se registró la preferencia

---

## 🌐 **APIs Disponibles**

### **1. Agregar Preferencia(s)** 
```http
POST /api/preferences
Content-Type: application/json
Authorization: Bearer <token> (opcional)

// Opción 1: Un solo tag (retrocompatibilidad)
{
  "tagId": 1
}

// Opción 2: Múltiples tags (recomendado)
{
  "tagIds": [1, 3, 5, 7, 9]
}
```

**Respuesta Exitosa (múltiples tags):**
```json
{
  "message": "5 preferencia(s) agregada(s) exitosamente",
  "data": [
    {
      "id": 123,
      "userId": 1,
      "tagId": 1,
      "tagName": "Plomería",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": 124,
      "userId": 1,
      "tagId": 3,
      "tagName": "Jardinería",
      "createdAt": "2025-01-15T10:30:01Z"
    }
    // ... hasta 5 tags máximo
  ]
}
```

**Validaciones:**
- Máximo 5 tags por solicitud
- Para usuarios autenticados: máximo 5 preferencias totales
- No permite tags duplicados para el mismo usuario
- Todos los tagIds deben existir

### **2. Obtener Estadísticas** (Público)
```http
GET /api/preferences/statistics
```

**Respuesta:**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "totalResponses": 1250,
    "statistics": [
      {
        "tagId": 1,
        "tagName": "Plomería",
        "count": 315,
        "percentage": 25.2
      },
      {
        "tagId": 3,
        "tagName": "Jardinería", 
        "count": 287,
        "percentage": 22.96
      },
      {
        "tagId": 2,
        "tagName": "Electricidad",
        "count": 201,
        "percentage": 16.08
      }
    ]
  }
}
```

### **3. Obtener Preferencias de Usuario** (Autenticado)
```http
GET /api/preferences/user/:userId
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "message": "Preferencias del usuario obtenidas exitosamente",
  "data": [
    {
      "id": 123,
      "userId": 1,
      "tagId": 1,
      "tagName": "Plomería",
      "createdAt": "2025-01-15T10:30:00Z"
    },
    {
      "id": 124,
      "userId": 1,
      "tagId": 3,
      "tagName": "Jardinería",
      "createdAt": "2025-01-15T11:15:00Z"
    }
  ]
}
```

### **4. Obtener Preferencias por Tag** (Autenticado)
```http
GET /api/preferences/tag/:tagId
Authorization: Bearer <token>
```

### **5. Limpiar Preferencias de Usuario** (Autenticado)
```http
DELETE /api/preferences/user/:userId
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "message": "5 preferencias eliminadas exitosamente"
}
```

---

## 💻 **Ejemplos de Uso**

### **1. Encuesta Múltiple de Turismo**
```javascript
// Usuario selecciona múltiples preferencias
const selectedTags = [1, 3, 5, 7, 9]; // IDs de los tags seleccionados

const response = await fetch('/api/preferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tagIds: selectedTags
  })
});

const result = await response.json();
console.log('Preferencias registradas:', result.data);
```

### **2. Usuario Autenticado Vota**
```javascript
// Usuario registrado vota por "Tecnología"
const response = await fetch('/api/preferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...'
  },
  body: JSON.stringify({
    tagId: 6  // ID del tag "Tecnología"
  })
});
```

### **3. Mostrar Estadísticas en Dashboard**
```javascript
// Obtener estadísticas para mostrar en un gráfico
const response = await fetch('/api/preferences/statistics');
const data = await response.json();

const chartData = data.data.statistics.map(stat => ({
  label: stat.tagName,
  value: stat.percentage,
  count: stat.count
}));

console.log('Total de respuestas:', data.data.totalResponses);
console.log('Datos para gráfico:', chartData);
```

### **4. Limpiar Preferencias y Empezar de Nuevo**
```javascript
// Usuario decide cambiar completamente sus preferencias
const userId = 123;
const response = await fetch(`/api/preferences/user/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...'
  }
});

const result = await response.json();
console.log(result.message); // "5 preferencias eliminadas exitosamente"

// Ahora puede seleccionar nuevas preferencias
const newPreferences = [2, 4, 6, 8, 10];
await fetch('/api/preferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...'
  },
  body: JSON.stringify({ tagIds: newPreferences })
});
```

---

## 📊 **Casos de Uso Prácticos**

### **1. Encuesta de Onboarding Mejorada**
- Al registrarse, mostrar "Selecciona hasta 5 tipos de servicios que más te interesen"
- Interfaz de selección múltiple con botones toggle
- Validación en tiempo real del límite de 5
- Usar datos para recomendaciones personalizadas y filtrado

### **2. Dashboard de Administrador**
- Mostrar gráfico de pastel con preferencias más populares
- Tendencias por período de tiempo
- Análisis de segmentación de usuarios

### **3. Página de Estadísticas Públicas**
- "Servicios más demandados por la comunidad"
- Actualización en tiempo real
- Comparativas por región (si se agrega geolocalización)

### **4. Análisis de Mercado**
- Identificar nichos de mercado subutilizados
- Planificar desarrollo de nuevas categorías
- Validar hipótesis de producto

---

## 🎯 **Beneficios del Sistema**

### **Para los Usuarios:**
- **Selección Múltiple**: Elegir hasta 5 preferencias de una vez
- **Experiencia Mejorada**: Interfaz intuitiva con selección visual
- **Flexibilidad**: Poder cambiar preferencias cuando quieran
- **Anonimato Opcional**: Privacidad garantizada
- **Validación Inteligente**: No permite duplicados ni exceder límites

### **Para el Negocio:**
- **Datos de Mercado**: Insights sobre demanda real
- **Segmentación**: Entender preferencias de usuarios
- **Toma de Decisiones**: Datos para estrategias de producto

### **Para el Sistema:**
- **Performance**: Sin JOINs complejos en consultas frecuentes
- **Escalabilidad**: Tabla independiente sin dependencias
- **Flexibilidad**: Fácil agregar nuevos tipos de análisis

---

## 🔮 **Futuras Mejoras Sugeridas**

1. **Filtros Temporales**: Estadísticas por período
2. **Geolocalización**: Preferencias por región
3. **Múltiples Votos**: Permitir seleccionar varios tags
4. **Pesos**: Votos con diferentes importancias
5. **Exportación**: Datos en CSV/Excel para análisis
6. **Webhooks**: Notificaciones de cambios en tendencias
7. **Cache**: Redis para estadísticas frecuentes
8. **Analytics**: Integración con Google Analytics

---

## ✅ **Estado Actual**

- ✅ Tabla `preference` creada
- ✅ APIs REST funcionales
- ✅ **NUEVO**: Soporte para selección múltiple (hasta 5 tags)
- ✅ **NUEVO**: Validación de límites por usuario
- ✅ **NUEVO**: Prevención de duplicados
- ✅ **NUEVO**: Endpoint para limpiar preferencias
- ✅ **NUEVO**: Interfaz de prueba mejorada con selección múltiple
- ✅ Soporte para votos anónimos y autenticados
- ✅ Estadísticas en tiempo real
- ✅ Validaciones completas
- ✅ Documentación actualizada

¡El sistema de preferencias con selección múltiple está listo para usar! 🎉

### **🔥 Nuevas Funcionalidades Agregadas:**
1. **Selección de hasta 5 tags** por usuario
2. **API que acepta arrays** de tagIds
3. **Validaciones inteligentes** de límites y duplicados
4. **Endpoint para limpiar** preferencias
5. **Interfaz de prueba mejorada** con UX moderna
