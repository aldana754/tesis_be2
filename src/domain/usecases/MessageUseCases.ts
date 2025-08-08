import { Message, MessageType } from '../entities/Message';
import { MessageRepository } from '../repositories/MessageRepository';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { UserProfileRepository } from '../repositories/UserRepository';

export class MessageUseCases {
  constructor(
    private messageRepository: MessageRepository,
    private conversationRepository: ConversationRepository,
    private userProfileRepository: UserProfileRepository
  ) {}

  async sendMessage(
    conversationId: number,
    senderId: number,
    content: string,
    messageType: MessageType = MessageType.TEXT
  ): Promise<Message> {
    // Verificar que la conversación existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== senderId && conversation.ownerId !== senderId) {
      throw new Error('User not authorized to send messages in this conversation');
    }

    // Verificar que el remitente existe
    const sender = await this.userProfileRepository.findById(senderId);
    if (!sender) {
      throw new Error('Sender not found');
    }

    // Validar contenido
    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    if (content.length > 1000) {
      throw new Error('Message content too long (max 1000 characters)');
    }

    // Crear el mensaje
    const message = Message.create(conversationId, senderId, content.trim(), messageType);
    const savedMessage = await this.messageRepository.save(message);

    // Actualizar la conversación con el último mensaje
    await this.conversationRepository.updateLastMessage(conversationId, savedMessage.createdAt);

    // Incrementar contador de no leídos para el destinatario
    const recipientId = senderId === conversation.clientId ? conversation.ownerId : conversation.clientId;
    conversation.incrementUnreadCount(recipientId);
    await this.conversationRepository.save(conversation);

    return savedMessage;
  }

  async getConversationMessages(
    conversationId: number,
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    // Verificar que la conversación existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== userId && conversation.ownerId !== userId) {
      throw new Error('User not authorized to view messages in this conversation');
    }

    return await this.messageRepository.findByConversationId(conversationId, limit, offset);
  }

  async markMessageAsRead(messageId: number, userId: number): Promise<void> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Verificar que la conversación existe
    const conversation = await this.conversationRepository.findById(message.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== userId && conversation.ownerId !== userId) {
      throw new Error('User not authorized to mark this message as read');
    }

    // Solo se puede marcar como leído si no es el remitente
    if (message.senderId === userId) {
      throw new Error('Cannot mark own message as read');
    }

    await this.messageRepository.markAsRead(messageId);
  }

  async markConversationMessagesAsRead(conversationId: number, userId: number): Promise<void> {
    // Verificar que la conversación existe
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== userId && conversation.ownerId !== userId) {
      throw new Error('User not authorized to mark messages as read in this conversation');
    }

    // Marcar mensajes como leídos (solo los que no son del usuario actual)
    const otherUserId = userId === conversation.clientId ? conversation.ownerId : conversation.clientId;
    await this.messageRepository.markConversationMessagesAsRead(conversationId, otherUserId);

    // Resetear contador de no leídos
    await this.conversationRepository.markAsRead(conversationId, userId);
  }

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    const message = await this.messageRepository.findById(messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    // Solo el remitente puede eliminar su mensaje
    if (message.senderId !== userId) {
      throw new Error('Only the sender can delete their own messages');
    }

    return await this.messageRepository.delete(messageId);
  }
}
