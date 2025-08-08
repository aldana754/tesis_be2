import { Request, Response } from 'express';
import { LocationService } from '../../application/services/LocationService';

export class LocationController {
  constructor(private locationService: LocationService) {}

  // ==================== COUNTRY CONTROLLERS ====================
  
  async createCountry(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'name is required' });
        return;
      }

      const country = await this.locationService.createCountry(name);
      res.status(201).json(country);
    } catch (error) {
      console.error('Error creating country:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getCountryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid country ID' });
        return;
      }

      const country = await this.locationService.getCountryById(id);

      if (!country) {
        res.status(404).json({ error: 'Country not found' });
        return;
      }

      res.json(country);
    } catch (error) {
      console.error('Error getting country:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllCountries(_req: Request, res: Response): Promise<void> {
    try {
      const countries = await this.locationService.getAllCountries();
      res.json(countries);
    } catch (error) {
      console.error('Error getting countries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCountry(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid country ID' });
        return;
      }

      const { name } = req.body;

      const updatedCountry = await this.locationService.updateCountry(id, { name });

      if (!updatedCountry) {
        res.status(404).json({ error: 'Country not found' });
        return;
      }

      res.json(updatedCountry);
    } catch (error) {
      console.error('Error updating country:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteCountry(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid country ID' });
        return;
      }

      await this.locationService.deleteCountry(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting country:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // ==================== PROVINCE CONTROLLERS ====================
  
  async createProvince(req: Request, res: Response): Promise<void> {
    try {
      const { name, countryId } = req.body;

      if (!name || !countryId) {
        res.status(400).json({ error: 'name and countryId are required' });
        return;
      }

      const province = await this.locationService.createProvince(name, parseInt(countryId));
      res.status(201).json(province);
    } catch (error) {
      console.error('Error creating province:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getProvinceById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid province ID' });
        return;
      }

      const province = await this.locationService.getProvinceById(id);

      if (!province) {
        res.status(404).json({ error: 'Province not found' });
        return;
      }

      res.json(province);
    } catch (error) {
      console.error('Error getting province:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProvincesByCountryId(req: Request, res: Response): Promise<void> {
    try {
      const countryId = parseInt(req.params.countryId);
      if (isNaN(countryId)) {
        res.status(400).json({ error: 'Invalid country ID' });
        return;
      }

      const provinces = await this.locationService.getProvincesByCountryId(countryId);
      res.json(provinces);
    } catch (error) {
      console.error('Error getting provinces by country:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllProvinces(_req: Request, res: Response): Promise<void> {
    try {
      const provinces = await this.locationService.getAllProvinces();
      res.json(provinces);
    } catch (error) {
      console.error('Error getting provinces:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateProvince(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid province ID' });
        return;
      }

      const { name } = req.body;

      const updatedProvince = await this.locationService.updateProvince(id, { name });

      if (!updatedProvince) {
        res.status(404).json({ error: 'Province not found' });
        return;
      }

      res.json(updatedProvince);
    } catch (error) {
      console.error('Error updating province:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteProvince(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid province ID' });
        return;
      }

      await this.locationService.deleteProvince(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting province:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  // ==================== LOCALITY CONTROLLERS ====================
  
  async createLocality(req: Request, res: Response): Promise<void> {
    try {
      const { name, provinceId } = req.body;

      if (!name || !provinceId) {
        res.status(400).json({ error: 'name and provinceId are required' });
        return;
      }

      const locality = await this.locationService.createLocality(name, parseInt(provinceId));
      res.status(201).json(locality);
    } catch (error) {
      console.error('Error creating locality:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getLocalityById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid locality ID' });
        return;
      }

      const locality = await this.locationService.getLocalityById(id);

      if (!locality) {
        res.status(404).json({ error: 'Locality not found' });
        return;
      }

      res.json(locality);
    } catch (error) {
      console.error('Error getting locality:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLocalitiesByProvinceId(req: Request, res: Response): Promise<void> {
    try {
      const provinceId = parseInt(req.params.provinceId);
      if (isNaN(provinceId)) {
        res.status(400).json({ error: 'Invalid province ID' });
        return;
      }

      const localities = await this.locationService.getLocalitiesByProvinceId(provinceId);
      res.json(localities);
    } catch (error) {
      console.error('Error getting localities by province:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllLocalities(_req: Request, res: Response): Promise<void> {
    try {
      const localities = await this.locationService.getAllLocalities();
      res.json(localities);
    } catch (error) {
      console.error('Error getting localities:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateLocality(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid locality ID' });
        return;
      }

      const { name } = req.body;

      const updatedLocality = await this.locationService.updateLocality(id, { name });

      if (!updatedLocality) {
        res.status(404).json({ error: 'Locality not found' });
        return;
      }

      res.json(updatedLocality);
    } catch (error) {
      console.error('Error updating locality:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteLocality(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid locality ID' });
        return;
      }

      await this.locationService.deleteLocality(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting locality:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
