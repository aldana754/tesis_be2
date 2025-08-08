import { Review } from '../entities/Review';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { OfferRepository } from '../repositories/OfferRepository';
import { UserProfileRepository } from '../repositories/UserRepository';

export class ReviewUseCases {
  constructor(
    private reviewRepository: ReviewRepository,
    private offerRepository: OfferRepository,
    private userProfileRepository: UserProfileRepository
  ) {}

  async createReview(
    offerId: number,
    userId: number,
    comment: string,
    rating: number
  ): Promise<Review> {
    // Verificar que la oferta existe
    const offer = await this.offerRepository.findById(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    // Verificar que el usuario existe
    const user = await this.userProfileRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verificar que el usuario no sea el dueño de la oferta
    if (offer.ownerId === userId) {
      throw new Error('Users cannot review their own offers');
    }

    // Verificar que el usuario no haya hecho una review de esta oferta antes
    const existingReview = await this.reviewRepository.findByOfferIdAndUserId(offerId, userId);
    if (existingReview) {
      throw new Error('User has already reviewed this offer');
    }

    // Crear la nueva review
    const review = Review.create(offerId, userId, comment, rating);
    return await this.reviewRepository.save(review);
  }

  async getReviewById(id: number): Promise<Review | null> {
    return await this.reviewRepository.findById(id);
  }

  async getReviewsByOfferId(offerId: number): Promise<Review[]> {
    return await this.reviewRepository.findByOfferId(offerId);
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    return await this.reviewRepository.findByUserId(userId);
  }

  async getAllReviews(): Promise<Review[]> {
    return await this.reviewRepository.findAll();
  }

  async updateReview(
    id: number,
    userId: number,
    comment?: string,
    rating?: number
  ): Promise<Review | null> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      return null;
    }

    // Verificar que el usuario es el dueño de la review
    if (existingReview.userId !== userId) {
      throw new Error('Users can only update their own reviews');
    }

    // Validar nuevos valores si se proporcionan
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    if (comment !== undefined && comment.length > 600) {
      throw new Error('Comment must not exceed 600 characters');
    }

    const updatedReview = new Review(
      id,
      existingReview.offerId,
      existingReview.userId,
      comment !== undefined ? comment.trim() : existingReview.comment,
      rating !== undefined ? rating : existingReview.rating,
      existingReview.createdAt,
      new Date() // updatedAt
    );

    return await this.reviewRepository.save(updatedReview);
  }

  async deleteReview(id: number, userId: number): Promise<boolean> {
    const existingReview = await this.reviewRepository.findById(id);
    if (!existingReview) {
      return false;
    }

    // Verificar que el usuario es el dueño de la review
    if (existingReview.userId !== userId) {
      throw new Error('Users can only delete their own reviews');
    }

    await this.reviewRepository.delete(id);
    return true;
  }

  async getOfferStatistics(offerId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    reviews: Review[];
  }> {
    const [averageRating, totalReviews, reviews] = await Promise.all([
      this.reviewRepository.getAverageRatingByOfferId(offerId),
      this.reviewRepository.getReviewCountByOfferId(offerId),
      this.reviewRepository.findByOfferId(offerId)
    ]);

    return {
      averageRating: Math.round(averageRating * 100) / 100, // Redondear a 2 decimales
      totalReviews,
      reviews
    };
  }
}
