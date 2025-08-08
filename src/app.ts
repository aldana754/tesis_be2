import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { AppDataSource } from './infrastructure/database/data-source';
import { TypeOrmUserProfileRepository } from './infrastructure/repositories/TypeOrmUserRepository';
import { TypeOrmOfferRepository } from './infrastructure/repositories/TypeOrmOfferRepository';
import { TypeOrmReviewRepository } from './infrastructure/repositories/TypeOrmReviewRepository';
import { TypeOrmConversationRepository } from './infrastructure/repositories/TypeOrmConversationRepository';
import { TypeOrmMessageRepository } from './infrastructure/repositories/TypeOrmMessageRepository';
import { TypeOrmAuthRepository } from './infrastructure/repositories/TypeOrmAuthRepository';
import { TypeOrmCountryRepository, TypeOrmProvinceRepository, TypeOrmLocalityRepository, TypeOrmAddressRepository } from './infrastructure/repositories/TypeOrmLocationRepositories';
import { TypeOrmTagRepository } from './infrastructure/repositories/TypeOrmTagRepository';
import { TypeOrmPreferenceRepository } from './infrastructure/repositories/TypeOrmPreferenceRepository';
import { AddressUseCases } from './domain/usecases/AddressUseCases';
import { AddressController } from './presentation/controllers/AddressController';
import { addressRoutes } from './presentation/routes/addressRoutes';
import { UserProfileUseCases } from './domain/usecases/UserProfileUseCases';
import { OfferUseCases } from './domain/usecases/OfferUseCases';
import { ReviewUseCases } from './domain/usecases/ReviewUseCases';
import { ConversationUseCases } from './domain/usecases/ConversationUseCases';
import { MessageUseCases } from './domain/usecases/MessageUseCases';
import { LocationUseCases } from './domain/usecases/LocationUseCases';
import { AuthUseCases } from './domain/usecases/AuthUseCases';
import { TagUseCases } from './domain/usecases/TagUseCases';
import { PreferenceUseCases } from './domain/usecases/PreferenceUseCases';
import { UserProfileService } from './application/services/UserService';
import { OfferService } from './application/services/OfferService';
import { ReviewService } from './application/services/ReviewService';
import { ConversationService } from './application/services/ConversationService';
import { MessageService } from './application/services/MessageService';
import { LocationService } from './application/services/LocationService';
import { AuthService } from './application/services/AuthService';
import { TagService } from './application/services/TagService';
import { PreferenceService } from './application/services/PreferenceService';
import { UserProfileController } from './presentation/controllers/UserController';
import { OfferController } from './presentation/controllers/OfferController';
import { S3Service } from './infrastructure/services/S3Service';
import { SocketService } from './infrastructure/services/SocketService';
import { JwtService } from './infrastructure/services/JwtService';
import { ReviewController } from './presentation/controllers/ReviewController';
import { ConversationController } from './presentation/controllers/ConversationController';
import { MessageController } from './presentation/controllers/MessageController';
import { LocationController } from './presentation/controllers/LocationController';
import { AuthController } from './presentation/controllers/AuthController';
import { TagController } from './presentation/controllers/TagController';
import { PreferenceController } from './presentation/controllers/PreferenceController';
import { ControllerHandler } from './presentation/ControllerHandler';
import { createUserProfileRoutes } from './presentation/routes/userRoutes';
import { createOfferRoutes } from './presentation/routes/offerRoutes';
import { createReviewRoutes } from './presentation/routes/reviewRoutes';
import { createConversationRoutes } from './presentation/routes/conversationRoutes';
import { createMessageRoutes } from './presentation/routes/messageRoutes';
import { createLocationRoutes } from './presentation/routes/locationRoutes';
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createTagRoutes } from './presentation/routes/tagRoutes';
import { createPreferenceRoutes } from './presentation/routes/preferenceRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { AuthMiddleware } from './presentation/middleware/authMiddleware';
import * as dotenv from 'dotenv';

dotenv.config();

// Authentication system implemented with JWT tokens (1 hour expiration)
// Fixed: Ensuring auth routes are properly configured as public endpoints
class App {
  private app: express.Application;
  private server: any;
  private port: number;
  private socketService: SocketService | null = null;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = parseInt(process.env.PORT || '3000');
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS Configuration
    this.app.use((req, res, next) => {
      const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? [process.env.CORS_ORIGIN || '*'] 
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
        
      const origin = req.headers.origin;
      if (allowedOrigins.includes('*') || (origin && allowedOrigins.includes(origin))) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
      }
      
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Servir archivos estáticos (para Socket.io y archivos de prueba)
    this.app.use(express.static('.'));
  }

  private initializeRoutes(): void {
    // Dependency injection setup for Address
    const addressRepository = new TypeOrmAddressRepository();
    const addressUseCases = new AddressUseCases(addressRepository);
    const addressController = new AddressController(addressUseCases);

    // Dependency injection setup for UserProfile
    const userProfileRepository = new TypeOrmUserProfileRepository();
    const userProfileUseCases = new UserProfileUseCases(userProfileRepository, addressRepository);
    const userProfileService = new UserProfileService(userProfileUseCases);
    const userProfileController = new UserProfileController(userProfileService);

    // Dependency injection setup for Tag
    const tagRepository = new TypeOrmTagRepository();
    const tagUseCases = new TagUseCases(tagRepository);
    const tagService = new TagService(tagUseCases);
    const tagController = new TagController(tagService);

    // Dependency injection setup for Offer
    const offerRepository = new TypeOrmOfferRepository();
    const offerUseCases = new OfferUseCases(offerRepository, userProfileRepository, addressRepository, tagRepository);
    const offerService = new OfferService(offerUseCases);
    const s3Service = new S3Service();
    const offerController = new OfferController(offerService, s3Service);

    // Dependency injection setup for Preference
    const preferenceRepository = new TypeOrmPreferenceRepository();
    const preferenceUseCases = new PreferenceUseCases(preferenceRepository, tagRepository);
    const preferenceService = new PreferenceService(preferenceUseCases);
    const preferenceController = new PreferenceController(preferenceService);

    // Dependency injection setup for Review
    const reviewRepository = new TypeOrmReviewRepository();
    const reviewUseCases = new ReviewUseCases(reviewRepository, offerRepository, userProfileRepository);
    const reviewService = new ReviewService(reviewUseCases);
    const reviewController = new ReviewController(reviewService);

    // Dependency injection setup for Chat
    const conversationRepository = new TypeOrmConversationRepository();
    const messageRepository = new TypeOrmMessageRepository();
    const conversationUseCases = new ConversationUseCases(conversationRepository, offerRepository, userProfileRepository);
    const messageUseCases = new MessageUseCases(messageRepository, conversationRepository, userProfileRepository);
    const conversationService = new ConversationService(conversationUseCases);
    const messageService = new MessageService(messageUseCases);
    const conversationController = new ConversationController(conversationService);
    const messageController = new MessageController(messageService);

    // Dependency injection setup for Authentication
    const authRepository = new TypeOrmAuthRepository();
    const authUseCases = new AuthUseCases(authRepository);
    const jwtService = new JwtService();
    const authService = new AuthService(authUseCases, jwtService);
    const authController = new AuthController(authService);

    // Initialize WebSocket service
    this.socketService = new SocketService(this.server, messageService, conversationService);

    // Dependency injection setup for Location
    const countryRepository = new TypeOrmCountryRepository();
    const provinceRepository = new TypeOrmProvinceRepository();
    const localityRepository = new TypeOrmLocalityRepository();
    const locationUseCases = new LocationUseCases(countryRepository, provinceRepository, localityRepository);
    const locationService = new LocationService(locationUseCases);
    const locationController = new LocationController(locationService);

    // Initialize ControllerHandler
    const controllerHandler = new ControllerHandler(userProfileController, offerController, locationController, addressController, reviewController);

    // Initialize Auth Middleware
    const authMiddleware = new AuthMiddleware();

    // ===============================================
    // PUBLIC ROUTES (NO AUTHENTICATION REQUIRED)
    // ===============================================
    console.log('[APP] Configuring public routes...');
    this.app.use('/api', createAuthRoutes(authController));
    this.app.use('/api', createTagRoutes(tagController)); // Tags are public for browsing
    console.log('[APP] Public routes configured successfully');

    // ===============================================
    // PROTECTED ROUTES (AUTHENTICATION REQUIRED)
    // ===============================================
    console.log('[APP] Configuring protected routes...');
    this.app.use('/api', authMiddleware.authenticate, createUserProfileRoutes(controllerHandler.getUserProfileHandler()));
    this.app.use('/api', authMiddleware.authenticate, createOfferRoutes(controllerHandler.getOfferHandler()));
    this.app.use('/api', authMiddleware.authenticate, createReviewRoutes(controllerHandler.getReviewHandler()));
    this.app.use('/api', authMiddleware.authenticate, createLocationRoutes(controllerHandler.getLocationHandler()));
    this.app.use('/api', authMiddleware.authenticate, addressRoutes);

    // Preferences routes (both public for anonymous and protected for authenticated users)
    this.app.use('/api', createPreferenceRoutes(preferenceController));

    // Chat routes (protected)
    this.app.use('/api', authMiddleware.authenticate, createConversationRoutes(conversationController));
    this.app.use('/api', authMiddleware.authenticate, createMessageRoutes(messageController));
    console.log('[APP] Protected routes configured successfully');

    // ===============================================
    // ADDITIONAL PUBLIC ROUTES
    // ===============================================

    // Simple status check (no database required)
    this.app.get('/', (_req, res) => {
      res.json({ 
        status: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      });
    });

    // Health check (public)
    this.app.get('/health', async (_req, res) => {
      try {
        // Check database connection
        await AppDataSource.query('SELECT 1');
        
        res.json({ 
          status: 'OK', 
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          database: 'connected',
          version: '1.0.0'
        });
      } catch (error) {
        res.status(503).json({ 
          status: 'ERROR', 
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          error: 'Database connection failed'
        });
      }
    });

    // Servir archivo de prueba de chat (public para desarrollo)
    this.app.get('/test-chat', (_req, res) => {
      res.sendFile('test-chat.html', { root: '.' });
    });

    // Servir archivo de prueba de preferencias (public para desarrollo)
    this.app.get('/test-preferences', (_req, res) => {
      res.sendFile('test-preferences.html', { root: '.' });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getSocketService(): SocketService | null {
    return this.socketService;
  }

  public async start(): Promise<void> {
    try {
      console.log('[APP] Starting application...');
      console.log('[APP] Environment:', process.env.NODE_ENV || 'development');
      console.log('[APP] Port:', this.port);
      
      // Initialize database with better error handling
      console.log('[APP] Connecting to database...');
      await AppDataSource.initialize();
      console.log('[APP] Database connected successfully');

      // Start server (HTTP + WebSocket)
      this.server.listen(this.port, '0.0.0.0', () => {
        console.log(`[APP] Server is running on http://0.0.0.0:${this.port}`);
        console.log(`[APP] Health check: http://0.0.0.0:${this.port}/health`);
        console.log(`[APP] WebSocket server ready for connections`);
        console.log('[APP] Application started successfully');
      });

      // Handle server errors
      this.server.on('error', (error: any) => {
        console.error('[APP] Server error:', error);
        if (error.code === 'EADDRINUSE') {
          console.error(`[APP] Port ${this.port} is already in use`);
        }
      });

    } catch (error) {
      console.error('[APP] Error starting application:', error);
      
      // In production, try to gracefully handle database connection errors
      if (process.env.NODE_ENV === 'production') {
        console.log('[APP] Attempting to restart database connection in 5 seconds...');
        setTimeout(async () => {
          try {
            await AppDataSource.initialize();
            console.log('[APP] Database reconnected successfully');
          } catch (retryError) {
            console.error('[APP] Failed to reconnect to database:', retryError);
            process.exit(1);
          }
        }, 5000);
      } else {
        process.exit(1);
      }
    }
  }
}

// Start the application
const app = new App();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('[APP] SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[APP] SIGINT received, shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('[APP] Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[APP] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.start();
