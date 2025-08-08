import { Request, Response } from 'express';
import { ReviewService } from '../../application/services/ReviewService';

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  // POST /api/reviews
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { offerId, userId, comment, rating } = req.body;

      if (!offerId || !userId || !comment || rating === undefined) {
        res.status(400).json({
          error: 'offerId, userId, comment, and rating are required'
        });
        return;
      }

      const review = await this.reviewService.createReview(
        parseInt(offerId),
        parseInt(userId),
        comment,
        parseInt(rating)
      );

      res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found') || 
            error.message.includes('already reviewed') ||
            error.message.includes('own offers') ||
            error.message.includes('Rating must be') ||
            error.message.includes('Comment must')) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // GET /api/reviews/:id
  async getReviewById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      const review = await this.reviewService.getReviewById(id);

      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.json(review);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/offers/:offerId/reviews
  async getReviewsByOfferId(req: Request, res: Response): Promise<void> {
    try {
      const offerId = parseInt(req.params.offerId);

      if (isNaN(offerId)) {
        res.status(400).json({ error: 'Invalid offer ID' });
        return;
      }

      const reviews = await this.reviewService.getReviewsByOfferId(offerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/users/:userId/reviews
  async getReviewsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const reviews = await this.reviewService.getReviewsByUserId(userId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /api/reviews
  async getAllReviews(_req: Request, res: Response): Promise<void> {
    try {
      const reviews = await this.reviewService.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /api/reviews/:id
  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { userId, comment, rating } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }

      const review = await this.reviewService.updateReview(
        id,
        parseInt(userId),
        comment,
        rating ? parseInt(rating) : undefined
      );

      if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.json({
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('can only update their own') ||
            error.message.includes('Rating must be') ||
            error.message.includes('Comment must')) {
          res.status(403).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal server error' });
        }
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // DELETE /api/reviews/:id
  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { userId } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid review ID' });
        return;
      }

      if (!userId) {
        res.status(400).json({ error: 'userId is required' });
        return;
      }

      const deleted = await this.reviewService.deleteReview(id, parseInt(userId));

      if (!deleted) {
        res.status(404).json({ error: 'Review not found' });
        return;
      }

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      if (error instanceof Error && error.message.includes('can only delete their own')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // GET /api/offers/:offerId/statistics
  async getOfferStatistics(req: Request, res: Response): Promise<void> {
    try {
      const offerId = parseInt(req.params.offerId);

      if (isNaN(offerId)) {
        res.status(400).json({ error: 'Invalid offer ID' });
        return;
      }

      const statistics = await this.reviewService.getOfferStatistics(offerId);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
