export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  CLOSED = 'CLOSED'
}

export class Conversation {
  constructor(
    public id: number,
    public offerId: number,
    public clientId: number,
    public ownerId: number,
    public status: ConversationStatus,
    public lastMessageAt: Date | null,
    public clientUnreadCount: number,
    public ownerUnreadCount: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    offerId: number,
    clientId: number,
    ownerId: number,
    status: ConversationStatus = ConversationStatus.ACTIVE
  ): Conversation {
    const now = new Date();
    return new Conversation(
      0, // ID será asignado por la base de datos
      offerId,
      clientId,
      ownerId,
      status,
      null, // lastMessageAt
      0, // clientUnreadCount
      0, // ownerUnreadCount
      now, // createdAt
      now  // updatedAt
    );
  }

  // Métodos de utilidad
  getOtherUserId(currentUserId: number): number {
    return currentUserId === this.clientId ? this.ownerId : this.clientId;
  }

  getUnreadCountForUser(userId: number): number {
    return userId === this.clientId ? this.clientUnreadCount : this.ownerUnreadCount;
  }

  markAsRead(userId: number): void {
    if (userId === this.clientId) {
      this.clientUnreadCount = 0;
    } else if (userId === this.ownerId) {
      this.ownerUnreadCount = 0;
    }
    this.updatedAt = new Date();
  }

  incrementUnreadCount(recipientId: number): void {
    if (recipientId === this.clientId) {
      this.clientUnreadCount++;
    } else if (recipientId === this.ownerId) {
      this.ownerUnreadCount++;
    }
    this.updatedAt = new Date();
  }
}
