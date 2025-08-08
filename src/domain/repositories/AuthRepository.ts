import { UserProfile } from '../entities/User';

export interface AuthRepository {
  findByEmail(email: string): Promise<UserProfile | null>;
  createUser(user: UserProfile, hashedPassword: string): Promise<UserProfile>;
  validateUser(email: string, password: string): Promise<UserProfile | null>;
}
