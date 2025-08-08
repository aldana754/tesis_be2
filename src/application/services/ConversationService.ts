import { ConversationUseCases } from '../../domain/usecases/ConversationUseCases';
import { Conversation } from '../../domain/entities/Conversation';

export class ConversationService {
  constructor(private conversationUseCases: ConversationUseCases) {}

  async createOrGetConversation(offerId: number, clientId: number): Promise<Conversation> {
    return await this.conversationUseCases.createConversation(offerId, clientId);
  }

  async getConversationById(id: number): Promise<Conversation | null> {
    return await this.conversationUseCases.getConversationById(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await this.conversationUseCases.getUserConversations(userId);
  }

  async markAsRead(conversationId: number, userId: number): Promise<void> {
    return await this.conversationUseCases.markConversationAsRead(conversationId, userId);
  }

  async archiveConversation(conversationId: number, userId: number): Promise<void> {
    return await this.conversationUseCases.archiveConversation(conversationId, userId);
  }

  async deleteConversation(conversationId: number, userId: number): Promise<boolean> {
    return await this.conversationUseCases.deleteConversation(conversationId, userId);
  }
}
