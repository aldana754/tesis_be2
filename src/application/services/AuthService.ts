import { AuthUseCases } from '../../domain/usecases/AuthUseCases';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../domain/entities/Auth';
import { JwtService } from '../../infrastructure/services/JwtService';

export class AuthService {
  constructor(
    private authUseCases: AuthUseCases,
    private jwtService: JwtService
  ) {}

  async login(loginData: LoginRequest): Promise<AuthResponse | null> {
    const authResponse = await this.authUseCases.login(loginData);
    
    if (!authResponse) {
      return null;
    }

    // Generar token JWT
    const token = this.jwtService.generateToken({
      userId: authResponse.user.id,
      email: authResponse.user.email,
      role: authResponse.user.role
    });

    return {
      ...authResponse,
      token
    };
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    const user = await this.authUseCases.register(registerData);
    
    if (!user) {
      throw new Error('Failed to create user');
    }

    // Generar token JWT para el nuevo usuario
    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        profilePhotoUrl: user.profilePhotoUrl
      }
    };
  }

  async validateToken(token: string): Promise<any> {
    const payload = this.jwtService.verifyToken(token);
    if (!payload) {
      return null;
    }

    // Opcional: verificar que el usuario aún existe
    const user = await this.authUseCases.getUserByEmail(payload.email);
    if (!user) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };
  }
}
