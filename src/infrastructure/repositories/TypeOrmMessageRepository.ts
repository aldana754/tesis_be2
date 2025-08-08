import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { MessageEntity } from '../database/entities/MessageEntity';
import { Message, MessageType } from '../../domain/entities/Message';
import { MessageRepository } from '../../domain/repositories/MessageRepository';

export class TypeOrmMessageRepository implements MessageRepository {
  private repository: Repository<MessageEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(MessageEntity);
  }

  async save(message: Message): Promise<Message> {
    const entity = this.toEntity(message);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Message | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['sender', 'conversation']
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByConversationId(conversationId: number, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const entities = await this.repository.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset
    });
    return entities.map(entity => this.toDomain(entity));
  }

  async markAsRead(messageId: number): Promise<void> {
    await this.repository.update(messageId, {
      isRead: true,
      readAt: new Date()
    });
  }

  async markConversationMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    await this.repository.update(
      {
        conversationId,
        senderId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(entity: MessageEntity): Message {
    return new Message(
      entity.id,
      entity.conversationId,
      entity.senderId,
      entity.content,
      entity.messageType as MessageType,
      entity.isRead,
      entity.readAt,
      entity.createdAt
    );
  }

  private toEntity(message: Message): MessageEntity {
    const entity = new MessageEntity();
    
    if (message.id !== 0) {
      entity.id = message.id;
    }
    
    entity.conversationId = message.conversationId;
    entity.senderId = message.senderId;
    entity.content = message.content;
    entity.messageType = message.messageType;
    entity.isRead = message.isRead;
    entity.readAt = message.readAt;
    
    if (message.id !== 0) {
      entity.createdAt = message.createdAt;
    }
    
    return entity;
  }
}
