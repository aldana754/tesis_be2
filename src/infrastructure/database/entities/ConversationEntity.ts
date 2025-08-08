import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { OfferEntity } from './OfferEntity';
import { UserProfileEntity } from './UserEntity';
import { MessageEntity } from './MessageEntity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'offer_id' })
  offerId!: number;

  @Column({ name: 'client_id' })
  clientId!: number;

  @Column({ name: 'owner_id' })
  ownerId!: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'ARCHIVED', 'CLOSED'],
    default: 'ACTIVE'
  })
  status!: string;

  @Column({ name: 'last_message_at', type: 'timestamp', nullable: true })
  lastMessageAt!: Date | null;

  @Column({ name: 'client_unread_count', default: 0 })
  clientUnreadCount!: number;

  @Column({ name: 'owner_unread_count', default: 0 })
  ownerUnreadCount!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // Relaciones
  @ManyToOne(() => OfferEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offer_id' })
  offer!: OfferEntity;

  @ManyToOne(() => UserProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client!: UserProfileEntity;

  @ManyToOne(() => UserProfileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner!: UserProfileEntity;

  @OneToMany(() => MessageEntity, (message: MessageEntity) => message.conversation)
  messages!: MessageEntity[];
}
