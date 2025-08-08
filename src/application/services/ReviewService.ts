import { ReviewUseCases } from '../../domain/usecases/ReviewUseCases';
import { Review } from '../../domain/entities/Review';

export class ReviewService {
  constructor(private reviewUseCases: ReviewUseCases) {}

  // ==================== REVIEW SERVICES ====================

  async createReview(
    offerId: number,
    userId: number,
    comment: string,
    rating: number
  ): Promise<Review> {
    return await this.reviewUseCases.createReview(offerId, userId, comment, rating);
  }

  async getReviewById(id: number): Promise<Review | null> {
    return await this.reviewUseCases.getReviewById(id);
  }

  async getReviewsByOfferId(offerId: number): Promise<Review[]> {
    return await this.reviewUseCases.getReviewsByOfferId(offerId);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await this.reviewUseCases.getReviewsByUserId(userId);
  }

  async getAllReviews(): Promise<Review[]> {
    return await this.reviewUseCases.getAllReviews();
  }

  async updateReview(
    id: number,
    userId: number,
    comment?: string,
    rating?: number
  ): Promise<Review | null> {
    return await this.reviewUseCases.updateReview(id, userId, comment, rating);
  }

  async deleteReview(id: number, userId: number): Promise<boolean> {
    return await this.reviewUseCases.deleteReview(id, userId);
  }

  async getOfferStatistics(offerId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    reviews: Review[];
  }> {
    return await this.reviewUseCases.getOfferStatistics(offerId);
  }
}
