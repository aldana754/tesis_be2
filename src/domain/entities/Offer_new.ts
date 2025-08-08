import { OfferPriceUnit } from './OfferPriceUnit';
import { Currency } from './Currency';
import { Tag } from './Tag';

export class Offer {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly shortDescription: string,
    public readonly longDescription: string,
    public readonly price: number,
    public readonly priceUnit: OfferPriceUnit,
    public readonly currency: Currency,
    public readonly mainPhoto: string | null,
    public readonly multimedia: string[],
    public readonly ownerId: number,
    public readonly addressId: number | null,
    public readonly tags: Tag[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    title: string,
    shortDescription: string,
    longDescription: string,
    price: number,
    ownerId: number,
    priceUnit: OfferPriceUnit = OfferPriceUnit.UNIQUE,
    currency: Currency = Currency.USD,
    addressId: number | null = null,
    mainPhoto: string | null = null,
    multimedia: string[] = [],
    tags: Tag[] = []
  ): Offer {
    const now = new Date();
    return new Offer(
      0, // El ID será generado automáticamente por la base de datos
      title,
      shortDescription,
      longDescription,
      price,
      priceUnit,
      currency,
      mainPhoto,
      multimedia,
      ownerId,
      addressId,
      tags,
      now,
      now
    );
  }
}
