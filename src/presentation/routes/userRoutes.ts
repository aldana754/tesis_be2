import { Router } from 'express';
import { UserProfileController } from '../controllers/UserController';
import { upload, uploadProfilePhoto } from '../middleware/uploadMiddleware';

export function createUserProfileRoutes(userProfileController: UserProfileController): Router {
  const router = Router();

  router.post('/users', (req, res) => userProfileController.createUserProfile(req, res));
  router.get('/users/:id', (req, res) => userProfileController.getUserProfileById(req, res));
  router.get('/users', (req, res) => userProfileController.getAllUserProfiles(req, res));
  router.put('/users/:id', (req, res) => userProfileController.updateUserProfile(req, res));
  router.delete('/users/:id', (req, res) => userProfileController.deleteUserProfile(req, res));
  
  // Ruta para subir foto de perfil
  router.post('/users/:id/profile-photo', 
    upload.single('photo'), 
    uploadProfilePhoto, 
    (req, res) => userProfileController.uploadProfilePhoto(req, res)
  );

  return router;
}
