import { Request, Response } from 'express';
import { MessageService } from '../../application/services/MessageService';
import { MessageType } from '../../domain/entities/Message';

export class MessageController {
  constructor(private messageService: MessageService) {}

  async getConversationMessages(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { userId, limit = 50, offset = 0 } = req.query;

      if (isNaN(conversationId) || !userId) {
        res.status(400).json({ error: 'conversationId and userId are required' });
        return;
      }

      const messages = await this.messageService.getConversationMessages(
        conversationId,
        parseInt(userId as string),
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { senderId, content, messageType = MessageType.TEXT } = req.body;

      if (isNaN(conversationId) || !senderId || !content) {
        res.status(400).json({ error: 'conversationId, senderId, and content are required' });
        return;
      }

      const message = await this.messageService.sendMessage(
        conversationId,
        parseInt(senderId),
        content,
        messageType
      );

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async markMessageAsRead(req: Request, res: Response): Promise<void> {
    try {
      const messageId = parseInt(req.params.messageId);
      const { userId } = req.body;

      if (isNaN(messageId) || !userId) {
        res.status(400).json({ error: 'messageId and userId are required' });
        return;
      }

      await this.messageService.markMessageAsRead(messageId, parseInt(userId));
      res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
      console.error('Error marking message as read:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async markConversationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const { userId } = req.body;

      if (isNaN(conversationId) || !userId) {
        res.status(400).json({ error: 'conversationId and userId are required' });
        return;
      }

      await this.messageService.markConversationAsRead(conversationId, parseInt(userId));
      res.status(200).json({ message: 'Conversation messages marked as read' });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const messageId = parseInt(req.params.messageId);
      const { userId } = req.body;

      if (isNaN(messageId) || !userId) {
        res.status(400).json({ error: 'messageId and userId are required' });
        return;
      }

      const deleted = await this.messageService.deleteMessage(messageId, parseInt(userId));
      
      if (deleted) {
        res.status(200).json({ message: 'Message deleted' });
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
