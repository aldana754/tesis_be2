import { Request, Response } from 'express';
import { ConversationService } from '../../application/services/ConversationService';

export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const { offerId, clientId } = req.body;

      if (!offerId || !clientId) {
        res.status(400).json({ error: 'offerId and clientId are required' });
        return;
      }

      const conversation = await this.conversationService.createOrGetConversation(
        parseInt(offerId),
        parseInt(clientId)
      );

      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getConversationById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid conversation ID' });
        return;
      }

      const conversation = await this.conversationService.getConversationById(id);

      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found' });
        return;
      }

      res.status(200).json(conversation);
    } catch (error) {
      console.error('Error getting conversation:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUserConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const conversations = await this.conversationService.getUserConversations(userId);
      res.status(200).json(conversations);
    } catch (error) {
      console.error('Error getting user conversations:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async markConversationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(conversationId) || !userId) {
        res.status(400).json({ error: 'conversationId and userId are required' });
        return;
      }

      await this.conversationService.markAsRead(conversationId, parseInt(userId));
      res.status(200).json({ message: 'Conversation marked as read' });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async archiveConversation(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(conversationId) || !userId) {
        res.status(400).json({ error: 'conversationId and userId are required' });
        return;
      }

      await this.conversationService.archiveConversation(conversationId, parseInt(userId));
      res.status(200).json({ message: 'Conversation archived' });
    } catch (error) {
      console.error('Error archiving conversation:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(conversationId) || !userId) {
        res.status(400).json({ error: 'conversationId and userId are required' });
        return;
      }

      const deleted = await this.conversationService.deleteConversation(conversationId, parseInt(userId));
      
      if (deleted) {
        res.status(200).json({ message: 'Conversation deleted' });
      } else {
        res.status(404).json({ error: 'Conversation not found' });
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // Endpoint específico para contactar sobre una oferta
  async contactOffer(req: Request, res: Response): Promise<void> {
    try {
      const offerId = parseInt(req.params.offerId);
      const { clientId } = req.body;

      if (isNaN(offerId) || !clientId) {
        res.status(400).json({ error: 'offerId and clientId are required' });
        return;
      }

      const conversation = await this.conversationService.createOrGetConversation(
        offerId,
        parseInt(clientId)
      );

      res.status(201).json({
        message: 'Conversation created or retrieved successfully',
        conversation
      });
    } catch (error) {
      console.error('Error contacting offer:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
