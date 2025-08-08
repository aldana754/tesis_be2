import { Repository } from 'typeorm';
import { OfferRepository } from '../../domain/repositories/OfferRepository';
import { Offer } from '../../domain/entities/Offer';
import { Tag } from '../../domain/entities/Tag';
import { OfferEntity } from '../database/entities/OfferEntity';
import { TagEntity } from '../database/entities/TagEntity';
import { AppDataSource } from '../database/data-source';

export class TypeOrmOfferRepository implements OfferRepository {
  private repository: Repository<OfferEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(OfferEntity);
  }

  async findById(id: number): Promise<Offer | null> {
    const offerEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['owner', 'address', 'tags']
    });
    return offerEntity ? this.toDomain(offerEntity) : null;
  }

  async findAll(): Promise<Offer[]> {
    const offerEntities = await this.repository.find({
      relations: ['owner', 'address', 'tags']
    });
    return offerEntities.map(this.toDomain.bind(this));
  }

  async findByOwnerId(ownerId: number): Promise<Offer[]> {
    const offerEntities = await this.repository.find({
      where: { ownerId },
      relations: ['owner', 'address', 'tags']
    });
    return offerEntities.map(this.toDomain.bind(this));
  }

  async findByTags(tagNames: string[]): Promise<Offer[]> {
    const offerEntities = await this.repository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.tags', 'tag')
      .leftJoinAndSelect('offer.owner', 'owner')
      .leftJoinAndSelect('offer.address', 'address')
      .where('tag.name IN (:...tagNames)', { tagNames })
      .getMany();
    
    return offerEntities.map(this.toDomain.bind(this));
  }

  async save(offer: Offer): Promise<Offer> {
    const offerEntity = await this.toEntity(offer);
    const savedEntity = await this.repository.save(offerEntity);
    
    // Recargar con relaciones para obtener los tags
    const reloadedEntity = await this.repository.findOne({
      where: { id: savedEntity.id },
      relations: ['tags']
    });
    
    return this.toDomain(reloadedEntity!);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: OfferEntity): Offer {
    const tags = entity.tags?.map(tagEntity => new Tag(
      tagEntity.id,
      tagEntity.name,
      tagEntity.description,
      tagEntity.color,
      tagEntity.createdAt,
      tagEntity.updatedAt
    )) || [];

    return new Offer(
      entity.id,
      entity.title,
      entity.shortDescription,
      entity.longDescription,
      entity.price,
      entity.priceUnit,
      entity.currency,
      entity.mainPhoto,
      entity.multimedia,
      entity.ownerId,
      entity.addressId,
      tags,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private async toEntity(offer: Offer): Promise<OfferEntity> {
    const entity = new OfferEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (offer.id !== 0) {
      entity.id = offer.id;
    }
    
    entity.title = offer.title;
    entity.shortDescription = offer.shortDescription;
    entity.longDescription = offer.longDescription;
    entity.price = offer.price;
    entity.priceUnit = offer.priceUnit;
    entity.currency = offer.currency;
    entity.mainPhoto = offer.mainPhoto;
    entity.multimedia = offer.multimedia;
    entity.ownerId = offer.ownerId;
    entity.addressId = offer.addressId;
    
    // Mapear tags
    if (offer.tags && offer.tags.length > 0) {
      const tagRepository = AppDataSource.getRepository(TagEntity);
      const tagIds = offer.tags.map((tag: Tag) => tag.id);
      const tagEntities = await tagRepository.findByIds(tagIds);
      entity.tags = tagEntities;
    }
    
    // Solo establecer fechas si no es una nueva oferta
    if (offer.id !== 0) {
      entity.createdAt = offer.createdAt;
      entity.updatedAt = offer.updatedAt;
    }
    
    return entity;
  }
}
