import { UserProfile } from '../entities/User';

export interface UserProfileRepository {
  findById(id: number): Promise<UserProfile | null>;  // Volvemos a number
  findByEmail(email: string): Promise<UserProfile | null>;
  findAll(): Promise<UserProfile[]>;
  save(userProfile: UserProfile): Promise<UserProfile>;
  delete(id: number): Promise<void>;  // Volvemos a number
}
