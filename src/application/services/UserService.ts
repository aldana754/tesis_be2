import { UserProfileUseCases } from '../../domain/usecases/UserProfileUseCases';
import { UserProfile } from '../../domain/entities/User';
import { UserRole } from '../../domain/entities/UserRole';

export class UserProfileService {
  constructor(private userProfileUseCases: UserProfileUseCases) {}

  async createUserProfile(
    firstName: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: UserRole = UserRole.CLIENT,
    address: { localityId: number; street: string; floor?: string; postalCode?: string } | null = null
  ): Promise<UserProfile> {
    return await this.userProfileUseCases.createUserProfile(
      firstName,
      lastname,
      email,
      password,
      phoneNumber,
      role,
      address
    );
  }

  async getUserProfileById(id: number): Promise<UserProfile | null> {
    return await this.userProfileUseCases.getUserProfileById(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    return await this.userProfileUseCases.getUserProfileByEmail(email);
  }

  async getAllUserProfiles(): Promise<UserProfile[]> {
    return await this.userProfileUseCases.getAllUserProfiles();
  }

  async updateUserProfile(
    id: number,
    updates: Partial<{
      firstName: string;
      lastname: string;
      email: string;
      password: string;
      phoneNumber: string;
      role: UserRole;
      profilePhotoUrl: string;
      address: { localityId: number; street: string; floor?: string; postalCode?: string } | null;
    }>
  ): Promise<UserProfile | null> {
    return await this.userProfileUseCases.updateUserProfile(id, updates);
  }

  async deleteUserProfile(id: number): Promise<void> {
    return await this.userProfileUseCases.deleteUserProfile(id);
  }

  async updateProfilePhoto(id: number, profilePhotoUrl: string): Promise<UserProfile | null> {
    return await this.userProfileUseCases.updateUserProfile(id, { profilePhotoUrl });
  }
}
