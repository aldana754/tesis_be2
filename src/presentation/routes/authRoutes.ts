import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  // POST /auth/login - Iniciar sesión
  router.post('/auth/login', (req, res) => authController.login(req, res));

  // POST /auth/register - Registrar nuevo usuario
  router.post('/auth/register', (req, res) => authController.register(req, res));

  // GET /auth/validate - Validar token
  router.get('/auth/validate', (req, res) => authController.validateToken(req, res));

  return router;
}
