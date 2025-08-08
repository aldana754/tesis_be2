import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';

export function createLocationRoutes(locationController: LocationController): Router {
  const router = Router();

  // ==================== COUNTRY ROUTES ====================
  
  // Crear país
  router.post('/locations/countries', (req, res) => locationController.createCountry(req, res));
  
  // Obtener país por ID
  router.get('/locations/countries/:id', (req, res) => locationController.getCountryById(req, res));
  
  // Obtener todos los países
  router.get('/locations/countries', (req, res) => locationController.getAllCountries(req, res));
  
  // Actualizar país
  router.put('/locations/countries/:id', (req, res) => locationController.updateCountry(req, res));
  
  // Eliminar país
  router.delete('/locations/countries/:id', (req, res) => locationController.deleteCountry(req, res));

  // ==================== PROVINCE ROUTES ====================
  
  // Crear provincia
  router.post('/locations/provinces', (req, res) => locationController.createProvince(req, res));
  
  // Obtener provincia por ID
  router.get('/locations/provinces/:id', (req, res) => locationController.getProvinceById(req, res));
  
  // Obtener provincias por país
  router.get('/locations/countries/:countryId/provinces', (req, res) => locationController.getProvincesByCountryId(req, res));
  
  // Obtener todas las provincias
  router.get('/locations/provinces', (req, res) => locationController.getAllProvinces(req, res));
  
  // Actualizar provincia
  router.put('/locations/provinces/:id', (req, res) => locationController.updateProvince(req, res));
  
  // Eliminar provincia
  router.delete('/locations/provinces/:id', (req, res) => locationController.deleteProvince(req, res));

  // ==================== LOCALITY ROUTES ====================
  
  // Crear localidad
  router.post('/locations/localities', (req, res) => locationController.createLocality(req, res));
  
  // Obtener localidad por ID
  router.get('/locations/localities/:id', (req, res) => locationController.getLocalityById(req, res));
  
  // Obtener localidades por provincia
  router.get('/locations/provinces/:provinceId/localities', (req, res) => locationController.getLocalitiesByProvinceId(req, res));
  
  // Obtener todas las localidades
  router.get('/locations/localities', (req, res) => locationController.getAllLocalities(req, res));
  
  // Actualizar localidad
  router.put('/locations/localities/:id', (req, res) => locationController.updateLocality(req, res));
  
  // Eliminar localidad
  router.delete('/locations/localities/:id', (req, res) => locationController.deleteLocality(req, res));

  return router;
}
