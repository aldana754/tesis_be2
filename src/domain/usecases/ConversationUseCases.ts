import { Conversation, ConversationStatus } from '../entities/Conversation';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { OfferRepository } from '../repositories/OfferRepository';
import { UserProfileRepository } from '../repositories/UserRepository';

export class ConversationUseCases {
  constructor(
    private conversationRepository: ConversationRepository,
    private offerRepository: OfferRepository,
    private userProfileRepository: UserProfileRepository
  ) {}

  async createConversation(offerId: number, clientId: number): Promise<Conversation> {
    // Verificar que la oferta existe
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    // Verificar que el cliente existe
    const client = await this.userProfileRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    // Verificar que el dueño de la oferta existe
    const owner = await this.userProfileRepository.findById(offer.ownerId);
    if (!owner) {
      throw new Error('Offer owner not found');
    }

    // Verificar que el cliente no es el dueño de la oferta
    if (clientId === offer.ownerId) {
      throw new Error('Cannot create conversation with yourself');
    }

    // Verificar si ya existe una conversación entre el cliente y esta oferta
    const existingConversation = await this.conversationRepository.findByOfferAndClient(offerId, clientId);
    if (existingConversation) {
      // Si existe y está cerrada, la reactivamos
      if (existingConversation.status === ConversationStatus.CLOSED) {
        existingConversation.status = ConversationStatus.ACTIVE;
        existingConversation.updatedAt = new Date();
        return await this.conversationRepository.save(existingConversation);
      }
      return existingConversation;
    }

    // Crear nueva conversación
    const conversation = Conversation.create(offerId, clientId, offer.ownerId);
    return await this.conversationRepository.save(conversation);
  }

  async getConversationById(id: number): Promise<Conversation | null> {
    return await this.conversationRepository.findById(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await this.conversationRepository.findByUserId(userId);
  }

  async markConversationAsRead(conversationId: number, userId: number): Promise<void> {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== userId && conversation.ownerId !== userId) {
      throw new Error('User not authorized to mark this conversation as read');
    }

    await this.conversationRepository.markAsRead(conversationId, userId);
  }

  async archiveConversation(conversationId: number, userId: number): Promise<void> {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verificar que el usuario participa en la conversación
    if (conversation.clientId !== userId && conversation.ownerId !== userId) {
      throw new Error('User not authorized to archive this conversation');
    }

    conversation.status = ConversationStatus.ARCHIVED;
    conversation.updatedAt = new Date();
    await this.conversationRepository.save(conversation);
  }

  async deleteConversation(conversationId: number, userId: number): Promise<boolean> {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Solo el dueño de la oferta puede eliminar la conversación
    if (conversation.ownerId !== userId) {
      throw new Error('Only the offer owner can delete conversations');
    }

    return await this.conversationRepository.delete(conversationId);
  }
}
