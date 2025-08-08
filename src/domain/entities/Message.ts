export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE'
}

export class Message {
  constructor(
    public id: number,
    public conversationId: number,
    public senderId: number,
    public content: string,
    public messageType: MessageType,
    public isRead: boolean,
    public readAt: Date | null,
    public createdAt: Date
  ) {}

  static create(
    conversationId: number,
    senderId: number,
    content: string,
    messageType: MessageType = MessageType.TEXT
  ): Message {
    return new Message(
      0, // ID será asignado por la base de datos
      conversationId,
      senderId,
      content,
      messageType,
      false, // isRead
      null,  // readAt
      new Date() // createdAt
    );
  }

  markAsRead(): void {
    this.isRead = true;
    this.readAt = new Date();
  }

  isFromUser(userId: number): boolean {
    return this.senderId === userId;
  }
}
