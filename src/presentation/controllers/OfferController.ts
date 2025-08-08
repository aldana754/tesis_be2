import { Request, Response } from 'express';
import { OfferService } from '../../application/services/OfferService';
import { OfferPriceUnit } from '../../domain/entities/OfferPriceUnit';
import { Currency } from '../../domain/entities/Currency';
import { S3Service } from '../../infrastructure/services/S3Service';

export class OfferController {
  constructor(
    private offerService: OfferService,
    private s3Service: S3Service
  ) {
    // S3Service será utilizado en futuras implementaciones de upload
    this.s3Service;
  }

  async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const { title, shortDescription, longDescription, price, ownerId, priceUnit, currency, address, tags } = req.body;

      if (!title || !shortDescription || !longDescription || price === undefined || !ownerId) {
        res.status(400).json({ 
          error: 'title, shortDescription, longDescription, price y ownerId son requeridos' 
        });
        return;
      }

      // Validar tags si se proporcionan
      let tagNames: string[] = [];
      if (tags) {
        if (!Array.isArray(tags)) {
          res.status(400).json({ 
            error: 'tags debe ser un array de strings' 
          });
          return;
        }
        tagNames = tags.filter((tag: any) => typeof tag === 'string' && tag.trim());
      }

      const offer = await this.offerService.createOffer(
        title,
        shortDescription,
        longDescription,
        parseFloat(price),
        parseInt(ownerId),
        priceUnit || OfferPriceUnit.UNIQUE,
        currency || Currency.USD,
        address || null,
        tagNames
      );
      
      res.status(201).json({
        message: 'Oferta creada exitosamente',
        data: offer
      });
    } catch (error) {
      console.error('Error al crear oferta:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  async getOfferById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ 
          error: 'ID de oferta inválido' 
        });
        return;
      }

      const offer = await this.offerService.getOfferById(id);

      if (!offer) {
        res.status(404).json({ 
          error: 'Oferta no encontrada' 
        });
        return;
      }

      res.status(200).json({
        message: 'Oferta obtenida exitosamente',
        data: offer
      });
    } catch (error) {
      console.error('Error al obtener oferta:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getOffersByOwnerId(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = parseInt(req.params.ownerId);
      if (isNaN(ownerId)) {
        res.status(400).json({ 
          error: 'ID de propietario inválido' 
        });
        return;
      }

      const offers = await this.offerService.getOffersByOwnerId(ownerId);
      res.status(200).json({
        message: 'Ofertas obtenidas exitosamente',
        data: offers
      });
    } catch (error) {
      console.error('Error al obtener ofertas por propietario:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      // Verificar si se enviaron tags para filtrar
      const { tags } = req.query;
      let offers;

      if (tags) {
        // Convertir tags a array si es string
        const tagNames = Array.isArray(tags) 
          ? tags as string[] 
          : (tags as string).split(',').map(tag => tag.trim());
        
        offers = await this.offerService.getOffersByTags(tagNames);
      } else {
        offers = await this.offerService.getAllOffers();
      }

      res.status(200).json({
        message: 'Ofertas obtenidas exitosamente',
        data: offers
      });
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async updateOffer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!id || isNaN(parseInt(id))) {
        res.status(400).json({ 
          error: 'ID de oferta inválido' 
        });
        return;
      }

      const updatedOffer = await this.offerService.updateOffer(parseInt(id), updates);
      
      if (!updatedOffer) {
        res.status(404).json({ 
          error: 'Oferta no encontrada' 
        });
        return;
      }

      res.status(200).json({
        message: 'Oferta actualizada exitosamente',
        data: updatedOffer
      });
    } catch (error) {
      console.error('Error al actualizar oferta:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async deleteOffer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        res.status(400).json({ 
          error: 'ID de oferta inválido' 
        });
        return;
      }

      const deleted = await this.offerService.deleteOffer(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({ 
          error: 'Oferta no encontrada' 
        });
        return;
      }

      res.status(200).json({
        message: 'Oferta eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  // Método placeholder para otros métodos que puedan existir
  async uploadMainPhoto(_req: Request, res: Response): Promise<void> {
    // Implementación existente para subir foto principal
    res.status(501).json({ error: 'Método no implementado aún' });
  }

  async uploadMultimedia(_req: Request, res: Response): Promise<void> {
    // Implementación existente para subir multimedia
    res.status(501).json({ error: 'Método no implementado aún' });
  }
}
