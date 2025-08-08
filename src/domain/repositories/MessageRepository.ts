import { Message } from '../entities/Message';

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findById(id: number): Promise<Message | null>;
  findByConversationId(conversationId: number, limit?: number, offset?: number): Promise<Message[]>;
  markAsRead(messageId: number): Promise<void>;
  markConversationMessagesAsRead(conversationId: number, userId: number): Promise<void>;
  delete(id: number): Promise<boolean>;
}
