import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // Debug logging for Railway deployment
  console.log('[AUTH ROUTES] Configuring public authentication routes...');

  // POST /auth/login - Iniciar sesión
  router.post('/auth/login', (req, res) => {
    console.log('[AUTH ROUTES] Login endpoint called');
    authController.login(req, res);
  });

  // POST /auth/register - Registrar nuevo usuario
  router.post('/auth/register', (req, res) => {
    console.log('[AUTH ROUTES] Register endpoint called');
    authController.register(req, res);
  });

  // GET /auth/validate - Validar token
  router.get('/auth/validate', (req, res) => {
    console.log('[AUTH ROUTES] Validate endpoint called');
    authController.validateToken(req, res);
  });

  console.log('[AUTH ROUTES] Public authentication routes configured successfully');
  return router;
}
