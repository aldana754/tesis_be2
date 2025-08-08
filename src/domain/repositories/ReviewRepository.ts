import { Review } from '../entities/Review';

export interface ReviewRepository {
  findById(id: number): Promise<Review | null>;
  findByOfferId(offerId: number): Promise<Review[]>;
  findByUserId(userId: number): Promise<Review[]>;
  findByOfferIdAndUserId(offerId: number, userId: number): Promise<Review | null>;
  findAll(): Promise<Review[]>;
  save(review: Review): Promise<Review>;
  delete(id: number): Promise<void>;
  getAverageRatingByOfferId(offerId: number): Promise<number>;
  getReviewCountByOfferId(offerId: number): Promise<number>;
}
