import { Router } from 'express';
import { OfferController } from '../controllers/OfferController';
import { uploadOfferMainPhoto, uploadOfferMultimedia } from '../middleware/uploadMiddleware';

export function createOfferRoutes(offerController: OfferController): Router {
  const router = Router();

  router.post('/offers', (req, res) => offerController.createOffer(req, res));
  router.get('/offers/:id', (req, res) => offerController.getOfferById(req, res));
  router.get('/offers', (req, res) => offerController.getAllOffers(req, res));
  router.get('/users/:ownerId/offers', (req, res) => offerController.getOffersByOwnerId(req, res));
  router.put('/offers/:id', (req, res) => offerController.updateOffer(req, res));
  router.delete('/offers/:id', (req, res) => offerController.deleteOffer(req, res));

  // Rutas para multimedia con límites de tamaño aumentados
  router.post('/offers/:id/main-photo', uploadOfferMainPhoto, (req, res) => offerController.uploadMainPhoto(req, res));
  router.post('/offers/:id/multimedia', uploadOfferMultimedia, (req, res) => offerController.uploadMultimedia(req, res));

  return router;
}
