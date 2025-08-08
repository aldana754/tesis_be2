import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';

export function createReviewRoutes(reviewController: ReviewController): Router {
  const router = Router();

  // Rutas para reviews
  router.post('/reviews', (req, res) => reviewController.createReview(req, res));
  router.get('/reviews/:id', (req, res) => reviewController.getReviewById(req, res));
  router.get('/reviews', (req, res) => reviewController.getAllReviews(req, res));
  router.put('/reviews/:id', (req, res) => reviewController.updateReview(req, res));
  router.delete('/reviews/:id', (req, res) => reviewController.deleteReview(req, res));

  // Rutas para reviews por oferta
  router.get('/offers/:offerId/reviews', (req, res) => reviewController.getReviewsByOfferId(req, res));
  router.get('/offers/:offerId/statistics', (req, res) => reviewController.getOfferStatistics(req, res));

  // Rutas para reviews por usuario
  router.get('/users/:userId/reviews', (req, res) => reviewController.getReviewsByUserId(req, res));

  return router;
}
