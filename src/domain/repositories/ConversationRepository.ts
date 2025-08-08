import { Conversation } from '../entities/Conversation';

export interface ConversationRepository {
  save(conversation: Conversation): Promise<Conversation>;
  findById(id: number): Promise<Conversation | null>;
  findByOfferAndClient(offerId: number, clientId: number): Promise<Conversation | null>;
  findByUserId(userId: number): Promise<Conversation[]>;
  updateLastMessage(conversationId: number, lastMessageAt: Date): Promise<void>;
  markAsRead(conversationId: number, userId: number): Promise<void>;
  delete(id: number): Promise<boolean>;
}
