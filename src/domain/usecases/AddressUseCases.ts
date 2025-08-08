import { Address } from '../entities/Locations';
import { AddressRepository } from '../repositories/LocationRepositories';

export class AddressUseCases {
  constructor(private addressRepository: AddressRepository) {}

  async createAddress(
    localityId: number,
    street: string,
    floor?: string,
    postalCode?: string
  ): Promise<Address> {
    const address = new Address(
      0, // ID será asignado por la base de datos
      localityId,
      street,
      floor ?? null,
      postalCode ?? null,
      new Date(),
      new Date()
    );

    return await this.addressRepository.save(address);
  }

  async getAllAddresses(): Promise<Address[]> {
    return await this.addressRepository.findAll();
  }

  async getAddressById(id: number): Promise<Address | null> {
    return await this.addressRepository.findById(id);
  }

  async getAddressesByLocalityId(localityId: number): Promise<Address[]> {
    return await this.addressRepository.findByLocalityId(localityId);
  }

  async updateAddress(
    id: number,
    localityId?: number,
    street?: string,
    floor?: string,
    postalCode?: string
  ): Promise<Address | null> {
    const existingAddress = await this.addressRepository.findById(id);
    if (!existingAddress) {
      return null;
    }

    const updatedAddress = new Address(
      id,
      localityId ?? existingAddress.localityId,
      street ?? existingAddress.street,
      floor !== undefined ? floor : existingAddress.floor,
      postalCode !== undefined ? postalCode : existingAddress.postalCode,
      existingAddress.createdAt,
      new Date() // updatedAt
    );

    return await this.addressRepository.save(updatedAddress);
  }

  async deleteAddress(id: number): Promise<boolean> {
    const existingAddress = await this.addressRepository.findById(id);
    if (!existingAddress) {
      return false;
    }

    await this.addressRepository.delete(id);
    return true;
  }
}
