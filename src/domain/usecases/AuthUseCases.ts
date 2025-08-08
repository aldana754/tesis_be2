import { UserProfile } from '../entities/User';
import { UserRole } from '../entities/UserRole';
import { AuthRepository } from '../repositories/AuthRepository';
import { LoginRequest, RegisterRequest, AuthResponse } from '../entities/Auth';

export class AuthUseCases {
  constructor(private authRepository: AuthRepository) {}

  async login(loginData: LoginRequest): Promise<AuthResponse | null> {
    const user = await this.authRepository.validateUser(loginData.email, loginData.password);
    
    if (!user) {
      return null;
    }

    // El token será generado en el servicio de aplicación
    return {
      token: '', // Se llenará en el servicio
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

  async register(registerData: RegisterRequest): Promise<UserProfile | null> {
    // Verificar si el usuario ya existe
    const existingUser = await this.authRepository.findByEmail(registerData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Crear el usuario
    const userRole = registerData.role ? UserRole[registerData.role as keyof typeof UserRole] : UserRole.CLIENT;
    
    const newUser = UserProfile.create(
      registerData.firstName,
      registerData.lastname,
      registerData.email,
      registerData.password, // Se hasheará en el repositorio
      registerData.phoneNumber,
      userRole,
      registerData.addressId || null
    );

    return await this.authRepository.createUser(newUser, registerData.password);
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    return await this.authRepository.findByEmail(email);
  }
}
