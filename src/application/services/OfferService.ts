import { OfferUseCases } from '../../domain/usecases/OfferUseCases';
import { Offer } from '../../domain/entities/Offer';
import { OfferPriceUnit } from '../../domain/entities/OfferPriceUnit';
import { Currency } from '../../domain/entities/Currency';

export class OfferService {
  constructor(private offerUseCases: OfferUseCases) {}

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
    return await this.offerUseCases.createOffer(
      title,
      shortDescription,
      longDescription,
      price,
      ownerId,
      priceUnit,
      currency,
      address,
      tagNames
    );
  }

  async getOfferById(id: number): Promise<Offer | null> {
    return await this.offerUseCases.getOfferById(id);
  }

  async getOffersByOwnerId(ownerId: number): Promise<Offer[]> {
    return await this.offerUseCases.getOffersByOwnerId(ownerId);
  }

  async getAllOffers(): Promise<Offer[]> {
    return await this.offerUseCases.getAllOffers();
  }

  async getOffersByTags(tagNames: string[]): Promise<Offer[]> {
    return await this.offerUseCases.getOffersByTags(tagNames);
  }

  async updateOffer(
    id: number,
    updates: Partial<{
      title: string;
      shortDescription: string;
      longDescription: string;
      price: number;
      priceUnit: OfferPriceUnit;
      currency: Currency;
      mainPhoto: string | null;
      multimedia: string[];
      address: { localityId: number; street: string; floor?: string; postalCode?: string } | null;
    }>
  ): Promise<Offer | null> {
    return await this.offerUseCases.updateOffer(id, updates);
  }

  async deleteOffer(id: number): Promise<boolean> {
    return await this.offerUseCases.deleteOffer(id);
  }
}
