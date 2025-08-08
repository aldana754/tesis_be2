import { Router } from 'express';
import { TagController } from '../controllers/TagController';

export function createTagRoutes(tagController: TagController): Router {
  const router = Router();

  // Obtener todos los tags (público para que los clientes puedan verlos)
  router.get('/tags', (req, res) => tagController.getAllTags(req, res));
  
  // Obtener tag por ID (público)
  router.get('/tags/:id', (req, res) => tagController.getTagById(req, res));
  
  // Crear nuevo tag (protegido - solo administradores)
  router.post('/tags', (req, res) => tagController.createTag(req, res));
  
  // Actualizar tag (protegido - solo administradores)
  router.put('/tags/:id', (req, res) => tagController.updateTag(req, res));
  
  // Eliminar tag (protegido - solo administradores)
  router.delete('/tags/:id', (req, res) => tagController.deleteTag(req, res));

  return router;
}
