import { MessageUseCases } from '../../domain/usecases/MessageUseCases';
import { Message, MessageType } from '../../domain/entities/Message';

export class MessageService {
  constructor(private messageUseCases: MessageUseCases) {}

  async sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
    messageType: MessageType = MessageType.TEXT
  ): Promise<Message> {
    return await this.messageUseCases.sendMessage(conversationId, senderId, content, messageType);
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    return await this.messageUseCases.getConversationMessages(conversationId, userId, limit, offset);
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    return await this.messageUseCases.markMessageAsRead(messageId, userId);
  }

  async markConversationAsRead(conversationId: number, userId: number): Promise<void> {
    return await this.messageUseCases.markConversationMessagesAsRead(conversationId, userId);
  }

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    return await this.messageUseCases.deleteMessage(messageId, userId);
  }
}
