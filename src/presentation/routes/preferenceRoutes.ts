import { Router } from 'express';
import { PreferenceController } from '../controllers/PreferenceController';

export function createPreferenceRoutes(preferenceController: PreferenceController): Router {
  const router = Router();

  // Endpoints públicos
  router.get('/preferences/statistics', (req, res) => preferenceController.getStatistics(req, res));
  router.get('/preferences', (req, res) => preferenceController.getAllPreferences(req, res));
  
  // Endpoints que pueden ser tanto autenticados como anónimos
  router.post('/preferences', (req, res) => preferenceController.addPreference(req, res));
  
  // Endpoints protegidos (requieren autenticación)
  router.get('/preferences/user/:userId', (req, res) => preferenceController.getUserPreferences(req, res));
  router.delete('/preferences/user/:userId', (req, res) => preferenceController.clearUserPreferences(req, res));
  router.get('/preferences/tag/:tagId', (req, res) => preferenceController.getPreferencesByTag(req, res));

  return router;
}
