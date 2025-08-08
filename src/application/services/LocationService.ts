import { LocationUseCases } from '../../domain/usecases/LocationUseCases';
import { Country, Province, Locality } from '../../domain/entities/Locations';

export class LocationService {
  constructor(private locationUseCases: LocationUseCases) {}

  // ==================== COUNTRY SERVICES ====================
  
  async createCountry(name: string): Promise<Country> {
    return await this.locationUseCases.createCountry(name);
  }

  async getCountryById(id: number): Promise<Country | null> {
    return await this.locationUseCases.getCountryById(id);
  }

  async getCountryByName(name: string): Promise<Country | null> {
    return await this.locationUseCases.getCountryByName(name);
  }

  async getAllCountries(): Promise<Country[]> {
    return await this.locationUseCases.getAllCountries();
  }

  async updateCountry(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Country | null> {
    return await this.locationUseCases.updateCountry(id, updates);
  }

  async deleteCountry(id: number): Promise<void> {
    return await this.locationUseCases.deleteCountry(id);
  }

  // ==================== PROVINCE SERVICES ====================
  
  async createProvince(name: string, countryId: number): Promise<Province> {
    return await this.locationUseCases.createProvince(name, countryId);
  }

  async getProvinceById(id: number): Promise<Province | null> {
    return await this.locationUseCases.getProvinceById(id);
  }

  async getProvinceByName(name: string): Promise<Province | null> {
    return await this.locationUseCases.getProvinceByName(name);
  }

  async getProvincesByCountryId(countryId: number): Promise<Province[]> {
    return await this.locationUseCases.getProvincesByCountryId(countryId);
  }

  async getAllProvinces(): Promise<Province[]> {
    return await this.locationUseCases.getAllProvinces();
  }

  async updateProvince(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Province | null> {
    return await this.locationUseCases.updateProvince(id, updates);
  }

  async deleteProvince(id: number): Promise<void> {
    return await this.locationUseCases.deleteProvince(id);
  }

  // ==================== LOCALITY SERVICES ====================
  
  async createLocality(name: string, provinceId: number): Promise<Locality> {
    return await this.locationUseCases.createLocality(name, provinceId);
  }

  async getLocalityById(id: number): Promise<Locality | null> {
    return await this.locationUseCases.getLocalityById(id);
  }

  async getLocalityByName(name: string): Promise<Locality | null> {
    return await this.locationUseCases.getLocalityByName(name);
  }

  async getLocalitiesByProvinceId(provinceId: number): Promise<Locality[]> {
    return await this.locationUseCases.getLocalitiesByProvinceId(provinceId);
  }

  async getAllLocalities(): Promise<Locality[]> {
    return await this.locationUseCases.getAllLocalities();
  }

  async updateLocality(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Locality | null> {
    return await this.locationUseCases.updateLocality(id, updates);
  }

  async deleteLocality(id: number): Promise<void> {
    return await this.locationUseCases.deleteLocality(id);
  }
}
