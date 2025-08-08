import { Server, Socket } from 'socket.io';
import { MessageService } from '../../application/services/MessageService';
import { ConversationService } from '../../application/services/ConversationService';
import { MessageType } from '../../domain/entities/Message';

interface ConnectedUser {
  userId: number;
  socketId: string;
  activeConversations: Set<number>;
}

export class SocketService {
  private io: Server;
  private connectedUsers: Map<number, ConnectedUser> = new Map();

  constructor(
    server: any,
    private messageService: MessageService,
    private conversationService: ConversationService
  ) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // En producción, especificar dominios permitidos
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Usuario se conecta
      socket.on('user-connect', (data: { userId: number }) => {
        this.handleUserConnect(socket, data.userId);
      });

      // Usuario se une a una conversación
      socket.on('join-conversation', (data: { conversationId: number, userId: number }) => {
        this.handleJoinConversation(socket, data.conversationId, data.userId);
      });

      // Usuario sale de una conversación
      socket.on('leave-conversation', (data: { conversationId: number, userId: number }) => {
        this.handleLeaveConversation(socket, data.conversationId, data.userId);
      });

      // Enviar mensaje
      socket.on('send-message', async (data: { 
        conversationId: number, 
        senderId: number, 
        content: string, 
        messageType?: MessageType 
      }) => {
        await this.handleSendMessage(socket, data);
      });

      // Usuario está escribiendo
      socket.on('typing-start', (data: { conversationId: number, userId: number }) => {
        this.handleTypingStart(socket, data.conversationId, data.userId);
      });

      // Usuario dejó de escribir
      socket.on('typing-stop', (data: { conversationId: number, userId: number }) => {
        this.handleTypingStop(socket, data.conversationId, data.userId);
      });

      // Marcar mensaje como leído
      socket.on('mark-as-read', async (data: { conversationId: number, userId: number }) => {
        await this.handleMarkAsRead(socket, data.conversationId, data.userId);
      });

      // Desconexión
      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket);
      });
    });
  }

  private handleUserConnect(socket: Socket, userId: number): void {
    const connectedUser: ConnectedUser = {
      userId,
      socketId: socket.id,
      activeConversations: new Set()
    };

    this.connectedUsers.set(userId, connectedUser);
    socket.join(`user-${userId}`);

    console.log(`User ${userId} connected with socket ${socket.id}`);

    // Notificar a otros usuarios que este usuario está en línea
    socket.broadcast.emit('user-online', { userId });
  }

  private async handleJoinConversation(socket: Socket, conversationId: number, userId: number): Promise<void> {
    try {
      // Verificar que el usuario puede acceder a la conversación
      const conversation = await this.conversationService.getConversationById(conversationId);
      if (!conversation) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      if (conversation.clientId !== userId && conversation.ownerId !== userId) {
        socket.emit('error', { message: 'Not authorized to join this conversation' });
        return;
      }

      socket.join(`conversation-${conversationId}`);
      
      const user = this.connectedUsers.get(userId);
      if (user) {
        user.activeConversations.add(conversationId);
      }

      console.log(`User ${userId} joined conversation ${conversationId}`);

      // Notificar al otro usuario de la conversación que este usuario está activo
      const otherUserId = userId === conversation.clientId ? conversation.ownerId : conversation.clientId;
      this.notifyUser(otherUserId, 'user-joined-conversation', { 
        conversationId, 
        userId 
      });

    } catch (error) {
      console.error('Error joining conversation:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  }

  private handleLeaveConversation(socket: Socket, conversationId: number, userId: number): void {
    socket.leave(`conversation-${conversationId}`);
    
    const user = this.connectedUsers.get(userId);
    if (user) {
      user.activeConversations.delete(conversationId);
    }

    console.log(`User ${userId} left conversation ${conversationId}`);

    // Notificar al otro usuario que este usuario salió
    socket.to(`conversation-${conversationId}`).emit('user-left-conversation', { 
      conversationId, 
      userId 
    });
  }

  private async handleSendMessage(socket: Socket, data: {
    conversationId: number,
    senderId: number,
    content: string,
    messageType?: MessageType
  }): Promise<void> {
    try {
      const message = await this.messageService.sendMessage(
        data.conversationId,
        data.senderId,
        data.content,
        data.messageType || MessageType.TEXT
      );

      // Emitir el mensaje a todos los usuarios en la conversación
      this.io.to(`conversation-${data.conversationId}`).emit('message-received', {
        message,
        conversationId: data.conversationId
      });

      // Obtener información de la conversación para notificaciones
      const conversation = await this.conversationService.getConversationById(data.conversationId);
      if (conversation) {
        const recipientId = data.senderId === conversation.clientId ? conversation.ownerId : conversation.clientId;
        
        // Si el destinatario no está en la conversación activa, enviar notificación
        const recipientUser = this.connectedUsers.get(recipientId);
        if (!recipientUser || !recipientUser.activeConversations.has(data.conversationId)) {
          this.notifyUser(recipientId, 'new-message-notification', {
            message,
            conversationId: data.conversationId,
            senderId: data.senderId
          });
        }
      }

      console.log(`Message sent in conversation ${data.conversationId} by user ${data.senderId}`);

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private handleTypingStart(socket: Socket, conversationId: number, userId: number): void {
    socket.to(`conversation-${conversationId}`).emit('user-typing', {
      conversationId,
      userId,
      isTyping: true
    });
  }

  private handleTypingStop(socket: Socket, conversationId: number, userId: number): void {
    socket.to(`conversation-${conversationId}`).emit('user-typing', {
      conversationId,
      userId,
      isTyping: false
    });
  }

  private async handleMarkAsRead(socket: Socket, conversationId: number, userId: number): Promise<void> {
    try {
      await this.messageService.markConversationAsRead(conversationId, userId);

      // Notificar a la conversación que los mensajes fueron leídos
      this.io.to(`conversation-${conversationId}`).emit('messages-read', {
        conversationId,
        readBy: userId,
        readAt: new Date()
      });

    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('error', { message: 'Failed to mark messages as read' });
    }
  }

  private handleUserDisconnect(socket: Socket): void {
    // Encontrar y remover el usuario desconectado
    for (const [userId, user] of this.connectedUsers.entries()) {
      if (user.socketId === socket.id) {
        this.connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        
        // Notificar a otros usuarios que este usuario está offline
        socket.broadcast.emit('user-offline', { userId });
        break;
      }
    }
  }

  // Métodos públicos para notificaciones
  public notifyUser(userId: number, event: string, data: any): void {
    this.io.to(`user-${userId}`).emit(event, data);
  }

  public notifyConversation(conversationId: number, event: string, data: any): void {
    this.io.to(`conversation-${conversationId}`).emit(event, data);
  }

  public isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }

  public getConnectedUsers(): number[] {
    return Array.from(this.connectedUsers.keys());
  }
}
