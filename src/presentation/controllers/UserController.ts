import { Request, Response } from 'express';
import { UserProfileService } from '../../application/services/UserService';
import { UserRole } from '../../domain/entities/UserRole';

export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  async createUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastname, email, password, phoneNumber, role, address } = req.body;

      if (!firstName || !lastname || !email || !password) {
        res.status(400).json({ error: 'firstName, lastname, email and password are required' });
        return;
      }

      const userProfile = await this.userProfileService.createUserProfile(
        firstName,
        lastname,
        email,
        password,
        phoneNumber || '',
        role || UserRole.CLIENT,
        address || null
      );
      res.status(201).json(userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUserProfileById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const userProfile = await this.userProfileService.getUserProfileById(id);

      if (!userProfile) {
        res.status(404).json({ error: 'User profile not found' });
        return;
      }

      res.json(userProfile);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllUserProfiles(_req: Request, res: Response): Promise<void> {
    try {
      const userProfiles = await this.userProfileService.getAllUserProfiles();
      res.json(userProfiles);
    } catch (error) {
      console.error('Error getting user profiles:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const { firstName, lastname, email, password, phoneNumber, role, address } = req.body;

      const updatedProfile = await this.userProfileService.updateUserProfile(id, {
        firstName,
        lastname,
        email,
        password,
        phoneNumber,
        role,
        address
      });

      if (!updatedProfile) {
        res.status(404).json({ error: 'User profile not found' });
        return;
      }

      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      await this.userProfileService.deleteUserProfile(id);
      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Error deleting user profile:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async uploadProfilePhoto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      // La URL de la foto subida se encuentra en req.uploadedPhotoUrl (añadida por el middleware)
      const photoUrl = (req as any).uploadedPhotoUrl;
      if (!photoUrl) {
        res.status(400).json({ error: 'No photo uploaded' });
        return;
      }

      const updatedUser = await this.userProfileService.updateProfilePhoto(id, photoUrl);
      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Profile photo updated successfully',
        user: updatedUser,
        profilePhotoUrl: photoUrl
      });
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
