import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { ConversationEntity } from '../database/entities/ConversationEntity';
import { Conversation, ConversationStatus } from '../../domain/entities/Conversation';
import { ConversationRepository } from '../../domain/repositories/ConversationRepository';

export class TypeOrmConversationRepository implements ConversationRepository {
  private repository: Repository<ConversationEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ConversationEntity);
  }

  async save(conversation: Conversation): Promise<Conversation> {
    const entity = this.toEntity(conversation);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Conversation | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['offer', 'client', 'owner']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByOfferAndClient(offerId: number, clientId: number): Promise<Conversation | null> {
    const entity = await this.repository.findOne({
      where: { offerId, clientId },
      relations: ['offer', 'client', 'owner']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByUserId(userId: number): Promise<Conversation[]> {
    const entities = await this.repository.find({
      where: [
        { clientId: userId },
        { ownerId: userId }
      ],
      relations: ['offer', 'client', 'owner'],
      order: { lastMessageAt: 'DESC' }
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async updateLastMessage(conversationId: number, lastMessageAt: Date): Promise<void> {
    await this.repository.update(conversationId, { lastMessageAt });
  }

  async markAsRead(conversationId: number, userId: number): Promise<void> {
    const conversation = await this.repository.findOne({ where: { id: conversationId } });
    if (!conversation) return;

    if (conversation.clientId === userId) {
      conversation.clientUnreadCount = 0;
    } else if (conversation.ownerId === userId) {
      conversation.ownerUnreadCount = 0;
    }

    await this.repository.save(conversation);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: ConversationEntity): Conversation {
    return new Conversation(
      entity.id,
      entity.offerId,
      entity.clientId,
      entity.ownerId,
      entity.status as ConversationStatus,
      entity.lastMessageAt,
      entity.clientUnreadCount,
      entity.ownerUnreadCount,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(conversation: Conversation): ConversationEntity {
    const entity = new ConversationEntity();
    
    if (conversation.id !== 0) {
      entity.id = conversation.id;
    }
    
    entity.offerId = conversation.offerId;
    entity.clientId = conversation.clientId;
    entity.ownerId = conversation.ownerId;
    entity.status = conversation.status;
    entity.lastMessageAt = conversation.lastMessageAt;
    entity.clientUnreadCount = conversation.clientUnreadCount;
    entity.ownerUnreadCount = conversation.ownerUnreadCount;
    
    if (conversation.id !== 0) {
      entity.createdAt = conversation.createdAt;
      entity.updatedAt = conversation.updatedAt;
    }
    
    return entity;
  }
}
