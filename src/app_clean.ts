import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import * as dotenv from 'dotenv';

// Configuración de base de datos
import { AppDataSource } from './infrastructure/database/data-source';

// Repositorios de datos
import { TypeOrmUserProfileRepository } from './infrastructure/repositories/TypeOrmUserRepository';
import { TypeOrmOfferRepository } from './infrastructure/repositories/TypeOrmOfferRepository';
import { TypeOrmReviewRepository } from './infrastructure/repositories/TypeOrmReviewRepository';
import { TypeOrmConversationRepository } from './infrastructure/repositories/TypeOrmConversationRepository';
import { TypeOrmMessageRepository } from './infrastructure/repositories/TypeOrmMessageRepository';
import { TypeOrmAuthRepository } from './infrastructure/repositories/TypeOrmAuthRepository';
import { TypeOrmTagRepository } from './infrastructure/repositories/TypeOrmTagRepository';
import { 
  TypeOrmCountryRepository, 
  TypeOrmProvinceRepository, 
  TypeOrmLocalityRepository, 
  TypeOrmAddressRepository 
} from './infrastructure/repositories/TypeOrmLocationRepositories';

// Casos de uso del dominio
import { AddressUseCases } from './domain/usecases/AddressUseCases';
import { UserProfileUseCases } from './domain/usecases/UserProfileUseCases';
import { OfferUseCases } from './domain/usecases/OfferUseCases';
import { ReviewUseCases } from './domain/usecases/ReviewUseCases';
import { ConversationUseCases } from './domain/usecases/ConversationUseCases';
import { MessageUseCases } from './domain/usecases/MessageUseCases';
import { LocationUseCases } from './domain/usecases/LocationUseCases';
import { AuthUseCases } from './domain/usecases/AuthUseCases';
import { TagUseCases } from './domain/usecases/TagUseCases';

// Servicios de aplicación
import { UserProfileService } from './application/services/UserService';
import { OfferService } from './application/services/OfferService';
import { ReviewService } from './application/services/ReviewService';
import { ConversationService } from './application/services/ConversationService';
import { MessageService } from './application/services/MessageService';
import { LocationService } from './application/services/LocationService';
import { AuthService } from './application/services/AuthService';
import { TagService } from './application/services/TagService';

// Servicios de infraestructura
import { S3Service } from './infrastructure/services/S3Service';
import { SocketService } from './infrastructure/services/SocketService';
import { JwtService } from './infrastructure/services/JwtService';

// Controladores
import { AddressController } from './presentation/controllers/AddressController';
import { UserProfileController } from './presentation/controllers/UserController';
import { OfferController } from './presentation/controllers/OfferController';
import { ReviewController } from './presentation/controllers/ReviewController';
import { ConversationController } from './presentation/controllers/ConversationController';
import { MessageController } from './presentation/controllers/MessageController';
import { LocationController } from './presentation/controllers/LocationController';
import { AuthController } from './presentation/controllers/AuthController';
import { TagController } from './presentation/controllers/TagController';
import { ControllerHandler } from './presentation/ControllerHandler';

// Rutas
import { addressRoutes } from './presentation/routes/addressRoutes';
import { createOfferRoutes } from './presentation/routes/offerRoutes';
import { createReviewRoutes } from './presentation/routes/reviewRoutes';
import { createConversationRoutes } from './presentation/routes/conversationRoutes';
import { createMessageRoutes } from './presentation/routes/messageRoutes';
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createTagRoutes } from './presentation/routes/tagRoutes';

// Middleware
import { errorHandler } from './presentation/middleware/errorHandler';
import { AuthMiddleware } from './presentation/middleware/authMiddleware';
import { upload, uploadProfilePhoto } from './presentation/middleware/uploadMiddleware';
import { seedTags } from './infrastructure/database/seeds/TagSeeder';

dotenv.config();

// Sistema de autenticación con JWT (tokens de 1 hora)
class App {
  private app: express.Application;
  private server: any;
  private port: number;
  private socketService: SocketService | null = null;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.port = parseInt(process.env.PORT || '3000');
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static('.'));
  }

  private setupRoutes(): void {
    // Configuración de dependencias para direcciones
    const addressRepository = new TypeOrmAddressRepository();
    const addressUseCases = new AddressUseCases(addressRepository);
    const addressController = new AddressController(addressUseCases);

    // Configuración de dependencias para perfiles de usuario
    const userProfileRepository = new TypeOrmUserProfileRepository();
    const userProfileUseCases = new UserProfileUseCases(userProfileRepository, addressRepository);
    const userProfileService = new UserProfileService(userProfileUseCases);
    const userProfileController = new UserProfileController(userProfileService);

    // Configuración de dependencias para tags
    const tagRepository = new TypeOrmTagRepository();
    const tagUseCases = new TagUseCases(tagRepository);
    const tagService = new TagService(tagUseCases);
    const tagController = new TagController(tagService);

    // Configuración de dependencias para ofertas
    const offerRepository = new TypeOrmOfferRepository();
    const offerUseCases = new OfferUseCases(offerRepository, userProfileRepository, addressRepository, tagRepository);
    const offerService = new OfferService(offerUseCases);
    const s3Service = new S3Service();
    const offerController = new OfferController(offerService, s3Service);

    // Configuración de dependencias para reseñas
    const reviewRepository = new TypeOrmReviewRepository();
    const reviewUseCases = new ReviewUseCases(reviewRepository, offerRepository, userProfileRepository);
    const reviewService = new ReviewService(reviewUseCases);
    const reviewController = new ReviewController(reviewService);

    // Configuración de dependencias para chat
    const conversationRepository = new TypeOrmConversationRepository();
    const messageRepository = new TypeOrmMessageRepository();
    const conversationUseCases = new ConversationUseCases(conversationRepository, offerRepository, userProfileRepository);
    const messageUseCases = new MessageUseCases(messageRepository, conversationRepository, userProfileRepository);
    const conversationService = new ConversationService(conversationUseCases);
    const messageService = new MessageService(messageUseCases);
    const conversationController = new ConversationController(conversationService);
    const messageController = new MessageController(messageService);

    // Configuración de dependencias para autenticación
    const authRepository = new TypeOrmAuthRepository();
    const authUseCases = new AuthUseCases(authRepository);
    const jwtService = new JwtService();
    const authService = new AuthService(authUseCases, jwtService);
    const authController = new AuthController(authService);

    // Inicializar servicio de WebSocket
    this.socketService = new SocketService(this.server, messageService, conversationService);

    // Configuración de dependencias para ubicaciones
    const countryRepository = new TypeOrmCountryRepository();
    const provinceRepository = new TypeOrmProvinceRepository();
    const localityRepository = new TypeOrmLocalityRepository();
    const locationUseCases = new LocationUseCases(countryRepository, provinceRepository, localityRepository);
    const locationService = new LocationService(locationUseCases);
    const locationController = new LocationController(locationService);

    // Inicializar manejador de controladores
    const controllerHandler = new ControllerHandler(
      userProfileController, 
      offerController, 
      locationController, 
      addressController, 
      reviewController
    );

    // Middleware de autenticación
    const authMiddleware = new AuthMiddleware();

    // Rutas públicas (sin autenticación requerida)
    this.app.use('/api', createAuthRoutes(authController));
    this.app.use('/api', createTagRoutes(tagController));
    
    // Rutas de ubicaciones públicas (para registro y uso general)
    this.app.get('/api/locations/countries', (req, res) => 
      locationController.getAllCountries(req, res)
    );
    this.app.get('/api/locations/countries/:id', (req, res) => 
      locationController.getCountryById(req, res)
    );
    this.app.get('/api/locations/provinces', (req, res) => 
      locationController.getAllProvinces(req, res)
    );
    this.app.get('/api/locations/provinces/:id', (req, res) => 
      locationController.getProvinceById(req, res)
    );
    this.app.get('/api/locations/countries/:countryId/provinces', (req, res) => 
      locationController.getProvincesByCountryId(req, res)
    );
    this.app.get('/api/locations/localities', (req, res) => 
      locationController.getAllLocalities(req, res)
    );
    this.app.get('/api/locations/localities/:id', (req, res) => 
      locationController.getLocalityById(req, res)
    );
    this.app.get('/api/locations/provinces/:provinceId/localities', (req, res) => 
      locationController.getLocalitiesByProvinceId(req, res)
    );

    // Rutas protegidas de usuarios (autenticación requerida)
    this.app.get('/api/users/:id', 
      authMiddleware.authenticate, 
      (req, res) => controllerHandler.getUserProfileHandler().getUserProfileById(req, res)
    );
    this.app.get('/api/users', 
      authMiddleware.authenticate, 
      (req, res) => controllerHandler.getUserProfileHandler().getAllUserProfiles(req, res)
    );
    this.app.put('/api/users/:id', 
      authMiddleware.authenticate, 
      (req, res) => controllerHandler.getUserProfileHandler().updateUserProfile(req, res)
    );
    this.app.delete('/api/users/:id', 
      authMiddleware.authenticate, 
      (req, res) => controllerHandler.getUserProfileHandler().deleteUserProfile(req, res)
    );
    this.app.post('/api/users/:id/profile-photo', 
      authMiddleware.authenticate, 
      upload.single('photo'), 
      uploadProfilePhoto, 
      (req, res) => controllerHandler.getUserProfileHandler().uploadProfilePhoto(req, res)
    );
    
    // Protected location management routes (authentication required)
    this.app.post('/api/locations/countries', authMiddleware.authenticate, (req, res) => locationController.createCountry(req, res));
    this.app.put('/api/locations/countries/:id', authMiddleware.authenticate, (req, res) => locationController.updateCountry(req, res));
    this.app.delete('/api/locations/countries/:id', authMiddleware.authenticate, (req, res) => locationController.deleteCountry(req, res));
    this.app.post('/api/locations/provinces', authMiddleware.authenticate, (req, res) => locationController.createProvince(req, res));
    this.app.put('/api/locations/provinces/:id', authMiddleware.authenticate, (req, res) => locationController.updateProvince(req, res));
    this.app.delete('/api/locations/provinces/:id', authMiddleware.authenticate, (req, res) => locationController.deleteProvince(req, res));
    this.app.post('/api/locations/localities', authMiddleware.authenticate, (req, res) => locationController.createLocality(req, res));
    this.app.put('/api/locations/localities/:id', authMiddleware.authenticate, (req, res) => locationController.updateLocality(req, res));
    this.app.delete('/api/locations/localities/:id', authMiddleware.authenticate, (req, res) => locationController.deleteLocality(req, res));
    
    // Other protected routes (authentication required)
    this.app.use('/api', authMiddleware.authenticate, createOfferRoutes(controllerHandler.getOfferHandler()));
    this.app.use('/api', authMiddleware.authenticate, createReviewRoutes(controllerHandler.getReviewHandler()));
    this.app.use('/api', authMiddleware.authenticate, addressRoutes);

    // Chat routes (protected)
    this.app.use('/api', authMiddleware.authenticate, createConversationRoutes(conversationController));
    this.app.use('/api', authMiddleware.authenticate, createMessageRoutes(messageController));

    // Verificación de estado del servidor (público)
    this.app.get('/health', (_req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
      });
    });

    // Página de prueba del chat (público para desarrollo)
    this.app.get('/test-chat', (_req, res) => {
      res.sendFile('test-chat.html', { root: '.' });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getSocketService(): SocketService | null {
    return this.socketService;
  }

  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('✅ Base de datos conectada exitosamente');

      // Poblar tags iniciales
      await seedTags(AppDataSource);

      this.server.listen(this.port, () => {
        console.log(`🚀 Servidor ejecutándose en http://localhost:${this.port}`);
        console.log(`🔍 Estado del servidor: http://localhost:${this.port}/health`);
        console.log(`🔌 Servidor WebSocket listo para conexiones`);
      });
    } catch (error) {
      console.error('❌ Error al iniciar la aplicación:', error);
      process.exit(1);
    }
  }
}

// Iniciar la aplicación
const app = new App();
app.start();
