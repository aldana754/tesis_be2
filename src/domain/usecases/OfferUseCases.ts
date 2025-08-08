import { Offer } from '../entities/Offer';
import { Tag } from '../entities/Tag';
import { OfferPriceUnit } from '../entities/OfferPriceUnit';
import { Currency } from '../entities/Currency';
import { OfferRepository } from '../repositories/OfferRepository';
import { UserProfileRepository } from '../repositories/UserRepository';
import { AddressRepository } from '../repositories/LocationRepositories';
import { TagRepository } from '../repositories/TagRepository';
import { Address } from '../entities/Locations';

export class OfferUseCases {
  constructor(
    private offerRepository: OfferRepository,
    private userProfileRepository: UserProfileRepository,
    private addressRepository: AddressRepository,
    private tagRepository: TagRepository
  ) {}

  async createOffer(
    title: string,
    shortDescription: string,
    longDescription: string,
    price: number,
    ownerId: number,
    priceUnit: OfferPriceUnit = OfferPriceUnit.UNIQUE,
    currency: Currency = Currency.USD,
    address: { localityId: number; street: string; floor?: string; postalCode?: string } | null = null,
    tagNames: string[] = []
  ): Promise<Offer> {
    // Validaciones
    if (!title.trim()) {
      throw new Error('Title is required');
    }

    if (!shortDescription.trim()) {
      throw new Error('Short description is required');
    }

    if (!longDescription.trim()) {
      throw new Error('Long description is required');
    }

    // Verificar que el usuario existe
    const userExists = await this.userProfileRepository.findById(ownerId);
    if (!userExists) {
      throw new Error('User not found');
    }

    if (shortDescription.length > 200) {
      throw new Error('Short description must not exceed 200 characters');
    }

    if (longDescription.length > 600) {
      throw new Error('Long description must not exceed 600 characters');
    }

    if (price < 0) {
      throw new Error('Price must be greater than or equal to 0');
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

    // Buscar tags existentes
    let tags: Tag[] = [];
    if (tagNames.length > 0) {
      tags = await this.tagRepository.findByNames(tagNames);
      
      // Verificar que todos los tags existen
      const foundTagNames = tags.map(tag => tag.name);
      const missingTags = tagNames.filter(name => !foundTagNames.includes(name));
      
      if (missingTags.length > 0) {
        throw new Error(`Los siguientes tags no existen: ${missingTags.join(', ')}`);
      }
    }

    // Crear nueva oferta
    const offer = Offer.create(
      title, 
      shortDescription, 
      longDescription, 
      price, 
      ownerId, 
      priceUnit, 
      currency, 
      addressId, 
      null, // mainPhoto
      [], // multimedia
      tags
    );
    return await this.offerRepository.save(offer);
  }

  async getOfferById(id: number): Promise<Offer | null> {
    return await this.offerRepository.findById(id);
  }

  async getAllOffers(): Promise<Offer[]> {
    return await this.offerRepository.findAll();
  }

  async getOffersByTags(tagNames: string[]): Promise<Offer[]> {
    return await this.offerRepository.findByTags(tagNames);
  }

  async getOffersByOwnerId(ownerId: number): Promise<Offer[]> {
    return await this.offerRepository.findByOwnerId(ownerId);
  }

  async updateOffer(
    id: number,
    updates: {
      title?: string;
      shortDescription?: string;
      longDescription?: string;
      price?: number;
      priceUnit?: OfferPriceUnit;
      currency?: Currency;
      mainPhoto?: string | null;
      multimedia?: string[];
      address?: { localityId: number; street: string; floor?: string; postalCode?: string } | null;
    }
  ): Promise<Offer | null> {
    const existingOffer = await this.offerRepository.findById(id);
    if (!existingOffer) {
      return null;
    }

    // Validaciones para updates
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('Title cannot be empty');
    }

    if (updates.shortDescription !== undefined) {
      if (!updates.shortDescription.trim()) {
        throw new Error('Short description cannot be empty');
      }
      if (updates.shortDescription.length > 200) {
        throw new Error('Short description must not exceed 200 characters');
      }
    }

    if (updates.longDescription !== undefined) {
      if (!updates.longDescription.trim()) {
        throw new Error('Long description cannot be empty');
      }
      if (updates.longDescription.length > 600) {
        throw new Error('Long description must not exceed 600 characters');
      }
    }

    if (updates.price !== undefined && updates.price < 0) {
      throw new Error('Price must be greater than or equal to 0');
    }

    // Manejar actualización de dirección
    let addressId = existingOffer.addressId;
    if (updates.address !== undefined) {
      if (updates.address === null) {
        // Si se quiere eliminar la dirección
        if (existingOffer.addressId) {
          await this.addressRepository.delete(existingOffer.addressId);
        }
        addressId = null;
      } else {
        // Crear nueva dirección o actualizar existente
        if (existingOffer.addressId) {
          // Actualizar dirección existente
          const updatedAddress = new Address(
            existingOffer.addressId,
            updates.address.localityId,
            updates.address.street,
            updates.address.floor || null,
            updates.address.postalCode || null,
            (await this.addressRepository.findById(existingOffer.addressId))!.createdAt,
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

    const updatedOffer = new Offer(
      id,
      updates.title ?? existingOffer.title,
      updates.shortDescription ?? existingOffer.shortDescription,
      updates.longDescription ?? existingOffer.longDescription,
      updates.price ?? existingOffer.price,
      updates.priceUnit ?? existingOffer.priceUnit,
      updates.currency ?? existingOffer.currency,
      updates.mainPhoto ?? existingOffer.mainPhoto,
      updates.multimedia ?? existingOffer.multimedia,
      existingOffer.ownerId,
      addressId,
      existingOffer.tags, // tags parameter
      existingOffer.createdAt,
      new Date() // updatedAt
    );

    return await this.offerRepository.save(updatedOffer);
  }

  async deleteOffer(id: number): Promise<boolean> {
    const existingOffer = await this.offerRepository.findById(id);
    if (!existingOffer) {
      return false;
    }

    await this.offerRepository.delete(id);
    return true;
  }
}
