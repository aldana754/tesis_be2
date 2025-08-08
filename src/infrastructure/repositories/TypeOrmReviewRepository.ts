import { Repository } from 'typeorm';
import { ReviewRepository } from '../../domain/repositories/ReviewRepository';
import { Review } from '../../domain/entities/Review';
import { ReviewEntity } from '../database/entities/ReviewEntity';
import { AppDataSource } from '../database/data-source';

export class TypeOrmReviewRepository implements ReviewRepository {
  private repository: Repository<ReviewEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ReviewEntity);
  }

  async findById(id: number): Promise<Review | null> {
    const reviewEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['offer', 'user']
    });
    return reviewEntity ? this.toDomain(reviewEntity) : null;
  }

  async findByOfferId(offerId: number): Promise<Review[]> {
    const reviewEntities = await this.repository.find({ 
      where: { offerId },
      relations: ['offer', 'user'],
      order: { createdAt: 'DESC' }
    });
    return reviewEntities.map(this.toDomain);
  }

  async findByUserId(userId: number): Promise<Review[]> {
    const reviewEntities = await this.repository.find({ 
      where: { userId },
      relations: ['offer', 'user'],
      order: { createdAt: 'DESC' }
    });
    return reviewEntities.map(this.toDomain);
  }

  async findByOfferIdAndUserId(offerId: number, userId: number): Promise<Review | null> {
    const reviewEntity = await this.repository.findOne({ 
      where: { offerId, userId },
      relations: ['offer', 'user']
    });
    return reviewEntity ? this.toDomain(reviewEntity) : null;
  }

  async findAll(): Promise<Review[]> {
    const reviewEntities = await this.repository.find({
      relations: ['offer', 'user'],
      order: { createdAt: 'DESC' }
    });
    return reviewEntities.map(this.toDomain);
  }

  async save(review: Review): Promise<Review> {
    const reviewEntity = this.toEntity(review);
    const savedEntity = await this.repository.save(reviewEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getAverageRatingByOfferId(offerId: number): Promise<number> {
    const result = await this.repository
      .createQueryBuilder("review")
      .select("AVG(review.rating)", "average")
      .where("review.offerId = :offerId", { offerId })
      .getRawOne();
    
    return result?.average ? parseFloat(result.average) : 0;
  }

  async getReviewCountByOfferId(offerId: number): Promise<number> {
    return await this.repository.count({
      where: { offerId }
    });
  }

  private toDomain(entity: ReviewEntity): Review {
    return new Review(
      entity.id,
      entity.offerId,
      entity.userId,
      entity.comment,
      entity.rating,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(review: Review): ReviewEntity {
    const entity = new ReviewEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (review.id !== 0) {
      entity.id = review.id;
    }
    
    entity.offerId = review.offerId;
    entity.userId = review.userId;
    entity.comment = review.comment;
    entity.rating = review.rating;
    
    // Solo establecer fechas si no es una nueva review
    if (review.id !== 0) {
      entity.createdAt = review.createdAt;
      entity.updatedAt = review.updatedAt;
    }
    
    return entity;
  }
}
