import { Router } from 'express';
import { ConversationController } from '../controllers/ConversationController';

export function createConversationRoutes(conversationController: ConversationController): Router {
  const router = Router();

  // Crear conversación
  router.post('/conversations', (req, res) => conversationController.createConversation(req, res));
  
  // Obtener conversación específica
  router.get('/conversations/:id', (req, res) => conversationController.getConversationById(req, res));
  
  // Obtener todas las conversaciones de un usuario
  router.get('/users/:userId/conversations', (req, res) => conversationController.getUserConversations(req, res));
  
  // Marcar conversación como leída
  router.put('/conversations/:id/read', (req, res) => conversationController.markConversationAsRead(req, res));
  
  // Archivar conversación
  router.put('/conversations/:id/archive', (req, res) => conversationController.archiveConversation(req, res));
  
  // Eliminar conversación
  router.delete('/conversations/:id', (req, res) => conversationController.deleteConversation(req, res));
  
  // Contactar sobre una oferta específica
  router.post('/offers/:offerId/contact', (req, res) => conversationController.contactOffer(req, res));

  return router;
}
