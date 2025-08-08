import { Request, Response } from 'express';
import { AddressUseCases } from '../../domain/usecases/AddressUseCases';

export class AddressController {
  constructor(private addressUseCases: AddressUseCases) {}

  // POST /api/addresses
  async createAddress(req: Request, res: Response): Promise<void> {
    try {
      const { localityId, street, floor, postalCode } = req.body;

      if (!localityId || !street) {
        res.status(400).json({
          error: 'localityId and street are required'
        });
        return;
      }

      const address = await this.addressUseCases.createAddress(
        localityId,
        street,
        floor,
        postalCode
      );

      res.status(201).json(address);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // GET /api/addresses
  async getAllAddresses(_req: Request, res: Response): Promise<void> {
    try {
      const addresses = await this.addressUseCases.getAllAddresses();
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // GET /api/addresses/:id
  async getAddressById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid address ID'
        });
        return;
      }

      const address = await this.addressUseCases.getAddressById(id);
      if (!address) {
        res.status(404).json({
          error: 'Address not found'
        });
        return;
      }

      res.json(address);
    } catch (error) {
      console.error('Error fetching address:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // GET /api/addresses/locality/:localityId
  async getAddressesByLocalityId(req: Request, res: Response): Promise<void> {
    try {
      const localityId = parseInt(req.params.localityId);
      if (isNaN(localityId)) {
        res.status(400).json({
          error: 'Invalid locality ID'
        });
        return;
      }

      const addresses = await this.addressUseCases.getAddressesByLocalityId(localityId);
      res.json(addresses);
    } catch (error) {
      console.error('Error fetching addresses by locality:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // PUT /api/addresses/:id
  async updateAddress(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid address ID'
        });
        return;
      }

      const { localityId, street, floor, postalCode } = req.body;

      const updatedAddress = await this.addressUseCases.updateAddress(
        id,
        localityId,
        street,
        floor,
        postalCode
      );

      if (!updatedAddress) {
        res.status(404).json({
          error: 'Address not found'
        });
        return;
      }

      res.json(updatedAddress);
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // DELETE /api/addresses/:id
  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid address ID'
        });
        return;
      }

      const deleted = await this.addressUseCases.deleteAddress(id);
      if (!deleted) {
        res.status(404).json({
          error: 'Address not found'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
