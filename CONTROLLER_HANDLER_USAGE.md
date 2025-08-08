# Uso del ControllerHandler

## Descripción
El `ControllerHandler` es una clase que agrupa y centraliza el acceso a todos los controladores de las entidades del sistema. Proporciona métodos para obtener cada controlador específico.

## Estructura

```typescript
class ControllerHandler {
  getUserProfileHandler(): UserProfileController
  getOfferHandler(): OfferController
  getLocationHandler(): LocationController
}
```

## Ejemplo de uso

```typescript
// En app.ts - Configuración inicial
const controllerHandler = new ControllerHandler(userProfileController, offerController, locationController);

// Obtener controladores específicos
const userController = controllerHandler.getUserProfileHandler();
const offerController = controllerHandler.getOfferHandler();
const locationController = controllerHandler.getLocationHandler();

// Usar en rutas
this.app.use('/api', createUserProfileRoutes(controllerHandler.getUserProfileHandler()));
this.app.use('/api', createOfferRoutes(controllerHandler.getOfferHandler()));
this.app.use('/api', createLocationRoutes(controllerHandler.getLocationHandler()));
```

## Ventajas

1. **Centralización**: Todos los controladores en un solo lugar
2. **Facilidad de acceso**: Métodos descriptivos para obtener cada controlador
3. **Mantenibilidad**: Fácil de expandir cuando se agreguen nuevas entidades
4. **Organización**: Mejor estructura del código de inicialización

## Expansión futura

Cuando agregues nuevas entidades (ej: Address, Category), simplemente:

1. Agrega el nuevo controlador al constructor
2. Agrega un método `getXXXHandler()` 
3. Actualiza la inicialización en `app.ts`

```typescript
// Ejemplo futuro
class ControllerHandler {
  constructor(
    private userProfileController: UserProfileController,
    private offerController: OfferController,
    private addressController: AddressController, // Nuevo
    private categoryController: CategoryController // Nuevo
  ) {}

  getUserProfileHandler(): UserProfileController { return this.userProfileController; }
  getOfferHandler(): OfferController { return this.offerController; }
  getAddressHandler(): AddressController { return this.addressController; } // Nuevo
  getCategoryHandler(): CategoryController { return this.categoryController; } // Nuevo
}
```

## Pruebas en Postman

Para probar los endpoints que utilizan el ControllerHandler, consulta el archivo `POSTMAN_EXAMPLES.md` que contiene:

- ✅ Ejemplos completos de todos los endpoints
- ✅ Casos de prueba para validaciones
- ✅ Ejemplos de errores esperados
- ✅ Datos de prueba realistas para turismo
- ✅ Validaciones de límites de caracteres (200 y 600)

Los endpoints disponibles son:
- **UserProfile**: `/api/users` (GET, POST, PUT, DELETE)
- **Offer**: `/api/offers` (GET, POST, PUT, DELETE)
- **Location**: `/api/countries`, `/api/provinces`, `/api/localities` (GET, POST, PUT, DELETE)
- **Health Check**: `/api/health` (GET)

### Nuevos endpoints de Location:
- **Countries**: `/api/countries` - Gestión de países
- **Provinces**: `/api/provinces` y `/api/countries/:countryId/provinces` - Gestión de provincias
- **Localities**: `/api/localities` y `/api/provinces/:provinceId/localities` - Gestión de localidades
