import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

export function createMessageRoutes(messageController: MessageController): Router {
  const router = Router();

  // Obtener mensajes de una conversación
  router.get('/conversations/:conversationId/messages', (req, res) => messageController.getConversationMessages(req, res));
  
  // Enviar mensaje (también disponible vía WebSocket)
  router.post('/conversations/:conversationId/messages', (req, res) => messageController.sendMessage(req, res));
  
  // Marcar mensaje específico como leído
  router.put('/messages/:messageId/read', (req, res) => messageController.markMessageAsRead(req, res));
  
  // Marcar todos los mensajes de una conversación como leídos
  router.put('/conversations/:conversationId/messages/read', (req, res) => messageController.markConversationAsRead(req, res));
  
  // Eliminar mensaje
  router.delete('/messages/:messageId', (req, res) => messageController.deleteMessage(req, res));

  return router;
}
