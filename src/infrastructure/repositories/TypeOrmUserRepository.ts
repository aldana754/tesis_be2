import { Repository } from 'typeorm';
import { UserProfileRepository } from '../../domain/repositories/UserRepository';
import { UserProfile } from '../../domain/entities/User';
import { UserProfileEntity } from '../database/entities/UserEntity';
import { AppDataSource } from '../database/data-source';

export class TypeOrmUserProfileRepository implements UserProfileRepository {
  private repository: Repository<UserProfileEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserProfileEntity);
  }

  async findById(id: number): Promise<UserProfile | null> {
    const userEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['offers', 'address']
    });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const userEntity = await this.repository.findOne({ 
      where: { email },
      relations: ['offers', 'address']
    });
    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findAll(): Promise<UserProfile[]> {
    const userEntities = await this.repository.find({
      relations: ['offers', 'address']
    });
    return userEntities.map(this.toDomain.bind(this));
  }

  async save(userProfile: UserProfile): Promise<UserProfile> {
    const userEntity = this.toEntity(userProfile);
    const savedEntity = await this.repository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: UserProfileEntity): UserProfile {
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
      entity.offers ? entity.offers.map(offer => offer.id.toString()) : [], // Convertir ofertas a array de strings con IDs
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(userProfile: UserProfile): UserProfileEntity {
    const entity = new UserProfileEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (userProfile.id !== 0) {
      entity.id = userProfile.id;
    }
    
    entity.role = userProfile.role;
    entity.firstName = userProfile.firstName;
    entity.lastname = userProfile.lastname;
    entity.email = userProfile.email;
    entity.password = userProfile.password;
    entity.phoneNumber = userProfile.phoneNumber;
    entity.profilePhotoUrl = userProfile.profilePhotoUrl;
    entity.addressId = userProfile.addressId;
    // No establecemos entity.offers aquí, se maneja a través de la relación en OfferEntity
    
    // Solo establecer fechas si no es un nuevo usuario
    if (userProfile.id !== 0) {
      entity.createdAt = userProfile.createdAt;
      entity.updatedAt = userProfile.updatedAt;
    }
    
    return entity;
  }
}
