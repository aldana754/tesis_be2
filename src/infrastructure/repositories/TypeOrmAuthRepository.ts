import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { UserProfileEntity } from '../database/entities/UserEntity';
import { UserProfile } from '../../domain/entities/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

export class TypeOrmAuthRepository implements AuthRepository {
  private repository: Repository<UserProfileEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserProfileEntity);
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) return null;

    return new UserProfile(
      entity.id,
      entity.role,
      entity.firstName,
      entity.lastname,
      entity.email,
      entity.password,
      entity.phoneNumber,
      entity.profilePhotoUrl,
      entity.addressId,
      entity.offers?.map(offer => offer.id.toString()) || [],
      entity.createdAt,
      entity.updatedAt
    );
  }

  async createUser(user: UserProfile, plainPassword: string): Promise<UserProfile> {
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const entity = new UserProfileEntity();
    entity.role = user.role;
    entity.firstName = user.firstName;
    entity.lastname = user.lastname;
    entity.email = user.email;
    entity.password = hashedPassword;
    entity.phoneNumber = user.phoneNumber;
    entity.profilePhotoUrl = user.profilePhotoUrl;
    entity.addressId = user.addressId;
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    const savedEntity = await this.repository.save(entity);

    return new UserProfile(
      savedEntity.id,
      savedEntity.role,
      savedEntity.firstName,
      savedEntity.lastname,
      savedEntity.email,
      savedEntity.password,
      savedEntity.phoneNumber,
      savedEntity.profilePhotoUrl,
      savedEntity.addressId,
      [],
      savedEntity.createdAt,
      savedEntity.updatedAt
    );
  }

  async validateUser(email: string, password: string): Promise<UserProfile | null> {
    const entity = await this.repository.findOne({ where: { email } });
    if (!entity) return null;

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, entity.password);
    if (!isPasswordValid) return null;

    return new UserProfile(
      entity.id,
      entity.role,
      entity.firstName,
      entity.lastname,
      entity.email,
      entity.password,
      entity.phoneNumber,
      entity.profilePhotoUrl,
      entity.addressId,
      entity.offers?.map(offer => offer.id.toString()) || [],
      entity.createdAt,
      entity.updatedAt
    );
  }
}
