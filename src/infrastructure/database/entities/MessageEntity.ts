import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ConversationEntity } from './ConversationEntity';
import { UserProfileEntity } from './UserEntity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'conversation_id' })
  conversationId!: number;

  @Column({ name: 'sender_id' })
  senderId!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({
    name: 'message_type',
    type: 'enum',
    enum: ['TEXT', 'IMAGE', 'FILE'],
    default: 'TEXT'
  })
  messageType!: string;

  @Column({ name: 'is_read', default: false })
  isRead!: boolean;

  @Column({ 
    name: 'read_at', 
    type: 'timestamp', 
    nullable: true 
  })
  readAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relación con la conversación a la que pertenece este mensaje
  @ManyToOne(() => ConversationEntity, conversation => conversation.messages, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation!: ConversationEntity;

  // Usuario que envió este mensaje
  @ManyToOne(() => UserProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender!: UserProfileEntity;
}
