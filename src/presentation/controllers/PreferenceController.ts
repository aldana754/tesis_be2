import { Request, Response } from 'express';
import { PreferenceService } from '../../application/services/PreferenceService';

export class PreferenceController {
  constructor(
    private preferenceService: PreferenceService
  ) {}

  async addPreference(req: Request, res: Response): Promise<void> {
    try {
      const { tagId, tagIds } = req.body;
      const userId = req.user?.userId || null; // Puede ser null para respuestas anónimas

      // Aceptar tanto tagId (single) como tagIds (multiple) para retrocompatibilidad
      let tagsToProcess: number[] = [];
      
      if (tagIds && Array.isArray(tagIds)) {
        tagsToProcess = tagIds.map(id => parseInt(id)).filter(id => !isNaN(id));
      } else if (tagId) {
        const parsedId = parseInt(tagId);
        if (!isNaN(parsedId)) {
          tagsToProcess = [parsedId];
        }
      }

      if (tagsToProcess.length === 0) {
        res.status(400).json({ 
          error: 'Se requiere al menos un tagId válido (tagId o tagIds)' 
        });
        return;
      }

      // Validar que no excedan 5 tags
      if (tagsToProcess.length > 5) {
        res.status(400).json({ 
          error: 'No se pueden seleccionar más de 5 tags por vez' 
        });
        return;
      }

      // Si es un usuario autenticado, verificar que no exceda el límite total
      if (userId) {
        const existingPreferences = await this.preferenceService.getUserPreferences(userId);
        const totalTags = existingPreferences.length + tagsToProcess.length;
        
        if (totalTags > 5) {
          res.status(400).json({ 
            error: `Ya tienes ${existingPreferences.length} preferencias. Solo puedes agregar ${5 - existingPreferences.length} más (máximo 5 total)` 
          });
          return;
        }

        // Verificar que no agregue tags duplicados
        const existingTagIds = existingPreferences.map(p => p.tagId);
        const duplicates = tagsToProcess.filter(tagId => existingTagIds.includes(tagId));
        
        if (duplicates.length > 0) {
          res.status(400).json({ 
            error: 'Ya has seleccionado algunos de estos tags anteriormente' 
          });
          return;
        }
      }

      // Agregar todas las preferencias
      const addedPreferences = [];
      for (const tagIdToAdd of tagsToProcess) {
        try {
          const preference = await this.preferenceService.addPreference(userId, tagIdToAdd);
          addedPreferences.push(preference);
        } catch (error) {
          if (error instanceof Error && error.message === 'Tag no encontrado') {
            res.status(404).json({ 
              error: `Tag con ID ${tagIdToAdd} no encontrado` 
            });
            return;
          }
          throw error;
        }
      }

      res.status(201).json({
        message: `${addedPreferences.length} preferencia(s) agregada(s) exitosamente`,
        data: addedPreferences
      });
    } catch (error) {
      console.error('Error al agregar preferencia:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getStatistics(_req: Request, res: Response): Promise<void> {
    try {
      const [statistics, totalResponses] = await Promise.all([
        this.preferenceService.getStatistics(),
        this.preferenceService.getTotalResponses()
      ]);

      res.status(200).json({
        message: 'Estadísticas obtenidas exitosamente',
        data: {
          totalResponses,
          statistics
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getAllPreferences(_req: Request, res: Response): Promise<void> {
    try {
      const preferences = await this.preferenceService.getAllPreferences();
      const statistics = await this.preferenceService.getStatistics();
      const totalResponses = await this.preferenceService.getTotalResponses();

      res.status(200).json({
        message: 'Preferencias obtenidas exitosamente',
        preferences,
        statistics,
        totalResponses
      });
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getUserPreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(parseInt(userId))) {
        res.status(400).json({ 
          error: 'userId inválido' 
        });
        return;
      }

      const preferences = await this.preferenceService.getUserPreferences(parseInt(userId));

      res.status(200).json({
        message: 'Preferencias del usuario obtenidas exitosamente',
        data: preferences
      });
    } catch (error) {
      console.error('Error al obtener preferencias del usuario:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async getPreferencesByTag(req: Request, res: Response): Promise<void> {
    try {
      const { tagId } = req.params;

      if (!tagId || isNaN(parseInt(tagId))) {
        res.status(400).json({ 
          error: 'tagId inválido' 
        });
        return;
      }

      const preferences = await this.preferenceService.getPreferencesByTag(parseInt(tagId));

      res.status(200).json({
        message: 'Preferencias por tag obtenidas exitosamente',
        data: preferences
      });
    } catch (error) {
      console.error('Error al obtener preferencias por tag:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async clearUserPreferences(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId || isNaN(parseInt(userId))) {
        res.status(400).json({ 
          error: 'userId inválido' 
        });
        return;
      }

      const deleted = await this.preferenceService.clearUserPreferences(parseInt(userId));

      res.status(200).json({
        message: `${deleted} preferencias eliminadas exitosamente`
      });
    } catch (error) {
      console.error('Error al limpiar preferencias del usuario:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}
