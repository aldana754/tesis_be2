import { Request, Response } from 'express';
import { TagService } from '../../application/services/TagService';

export class TagController {
  constructor(private tagService: TagService) {}

  async getAllTags(_req: Request, res: Response): Promise<void> {
    try {
      const tags = await this.tagService.getAllTags();
      res.status(200).json({
        message: 'Tags obtenidos exitosamente',
        data: tags
      });
    } catch (error) {
      console.error('Error al obtener tags:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getTagById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ 
          error: 'ID de tag inválido' 
        });
        return;
      }

      const tag = await this.tagService.getTagById(id);
      if (!tag) {
        res.status(404).json({ 
          error: 'Tag no encontrado' 
        });
        return;
      }

      res.status(200).json({
        message: 'Tag obtenido exitosamente',
        data: tag
      });
    } catch (error) {
      console.error('Error al obtener tag:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, color } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ 
          error: 'El nombre del tag es requerido' 
        });
        return;
      }

      if (name.length > 50) {
        res.status(400).json({ 
          error: 'El nombre del tag no puede exceder 50 caracteres' 
        });
        return;
      }

      // Validar color si se proporciona (formato hex)
      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        res.status(400).json({ 
          error: 'El color debe estar en formato hexadecimal (#RRGGBB)' 
        });
        return;
      }

      const tag = await this.tagService.createTag(name.trim(), description?.trim(), color);
      res.status(201).json({
        message: 'Tag creado exitosamente',
        data: tag
      });
    } catch (error: any) {
      console.error('Error al crear tag:', error);
      
      if (error.message === 'Ya existe un tag con ese nombre') {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { name, description, color } = req.body;

      if (isNaN(id)) {
        res.status(400).json({ 
          error: 'ID de tag inválido' 
        });
        return;
      }

      if (!name || !name.trim()) {
        res.status(400).json({ 
          error: 'El nombre del tag es requerido' 
        });
        return;
      }

      if (name.length > 50) {
        res.status(400).json({ 
          error: 'El nombre del tag no puede exceder 50 caracteres' 
        });
        return;
      }

      // Validar color si se proporciona
      if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
        res.status(400).json({ 
          error: 'El color debe estar en formato hexadecimal (#RRGGBB)' 
        });
        return;
      }

      const tag = await this.tagService.updateTag(id, name.trim(), description?.trim(), color);
      res.status(200).json({
        message: 'Tag actualizado exitosamente',
        data: tag
      });
    } catch (error: any) {
      console.error('Error al actualizar tag:', error);
      
      if (error.message === 'Tag no encontrado') {
        res.status(404).json({ error: error.message });
        return;
      }

      if (error.message === 'Ya existe otro tag con ese nombre') {
        res.status(409).json({ error: error.message });
        return;
      }

      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ 
          error: 'ID de tag inválido' 
        });
        return;
      }

      await this.tagService.deleteTag(id);
      res.status(200).json({
        message: 'Tag eliminado exitosamente'
      });
    } catch (error: any) {
      console.error('Error al eliminar tag:', error);
      
      if (error.message === 'Tag no encontrado') {
        res.status(404).json({ error: error.message });
        return;
      }

      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}
