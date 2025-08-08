import { Offer } from '../entities/Offer';

export interface OfferRepository {
  findById(id: number): Promise<Offer | null>;
  findByOwnerId(ownerId: number): Promise<Offer[]>;
  findAll(): Promise<Offer[]>;
  findByTags(tagNames: string[]): Promise<Offer[]>;
  save(offer: Offer): Promise<Offer>;
  delete(id: number): Promise<void>;
}
