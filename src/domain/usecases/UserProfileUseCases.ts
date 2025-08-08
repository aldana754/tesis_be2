import { UserProfile } from '../entities/User';
import { UserProfileRepository } from '../repositories/UserRepository';
import { UserRole } from '../entities/UserRole';
import { AddressRepository } from '../repositories/LocationRepositories';
import { Address } from '../entities/Locations';

export class UserProfileUseCases {
  constructor(
    private userProfileRepository: UserProfileRepository,
    private addressRepository: AddressRepository
  ) {}

  async createUserProfile(
    firstName: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: UserRole = UserRole.CLIENT,
    address: { localityId: number; street: string; floor?: string; postalCode?: string } | null = null
  ): Promise<UserProfile> {
    // Verificar si el email ya existe
    const existingUser = await this.userProfileRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Crear dirección si se proporciona
    let addressId: number | null = null;
    if (address) {
      const newAddress = Address.create(
        address.localityId,
        address.street,
        address.postalCode,
        address.floor
      );
      const savedAddress = await this.addressRepository.save(newAddress);
      addressId = savedAddress.id;
    }

    // Crear nuevo usuario
    const userProfile = UserProfile.create(
      firstName,
      lastname,
      email,
      password,
      phoneNumber,
      role,
      addressId
    );
    return await this.userProfileRepository.save(userProfile);
  }

  async getUserProfileById(id: number): Promise<UserProfile | null> {
    return await this.userProfileRepository.findById(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | null> {
    return await this.userProfileRepository.findByEmail(email);
  }

  async getAllUserProfiles(): Promise<UserProfile[]> {
    return await this.userProfileRepository.findAll();
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
    const existingUser = await this.userProfileRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // Si se está actualizando el email, verificar que no exista otro usuario con ese email
    if (updates.email && updates.email !== existingUser.email) {
      const userWithEmail = await this.userProfileRepository.findByEmail(updates.email);
      if (userWithEmail) {
        throw new Error('User with this email already exists');
      }
    }

    // Manejar actualización de dirección
    let addressId = existingUser.addressId;
    if (updates.address !== undefined) {
      if (updates.address === null) {
        // Si se quiere eliminar la dirección
        if (existingUser.addressId) {
          await this.addressRepository.delete(existingUser.addressId);
        }
        addressId = null;
      } else {
        // Crear nueva dirección o actualizar existente
        if (existingUser.addressId) {
          // Actualizar dirección existente
          const updatedAddress = new Address(
            existingUser.addressId,
            updates.address.localityId,
            updates.address.street,
            updates.address.floor || null,
            updates.address.postalCode || null,
            (await this.addressRepository.findById(existingUser.addressId))!.createdAt,
            new Date()
          );
          await this.addressRepository.save(updatedAddress);
        } else {
          // Crear nueva dirección
          const newAddress = Address.create(
            updates.address.localityId,
            updates.address.street,
            updates.address.postalCode,
            updates.address.floor
          );
          const savedAddress = await this.addressRepository.save(newAddress);
          addressId = savedAddress.id;
        }
      }
    }

    // Crear nuevo objeto con los datos actualizados
    const updatedUser = new UserProfile(
      existingUser.id,
      updates.role ?? existingUser.role,
      updates.firstName ?? existingUser.firstName,
      updates.lastname ?? existingUser.lastname,
      updates.email ?? existingUser.email,
      updates.password ?? existingUser.password,
      updates.phoneNumber ?? existingUser.phoneNumber,
      updates.profilePhotoUrl ?? existingUser.profilePhotoUrl,
      addressId,
      existingUser.offers,
      existingUser.createdAt,
      new Date() // updatedAt
    );

    return await this.userProfileRepository.save(updatedUser);
  }

  async deleteUserProfile(id: number): Promise<void> {
    const existingUser = await this.userProfileRepository.findById(id);
    if (!existingUser) {
      throw new Error('User profile not found');
    }

    await this.userProfileRepository.delete(id);
  }
}
