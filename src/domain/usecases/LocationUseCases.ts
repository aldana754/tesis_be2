import { Country, Province, Locality } from '../entities/Locations';
import { CountryRepository, ProvinceRepository, LocalityRepository } from '../repositories/LocationRepositories';

export class LocationUseCases {
  constructor(
    private countryRepository: CountryRepository,
    private provinceRepository: ProvinceRepository,
    private localityRepository: LocalityRepository
  ) {}

  // ==================== COUNTRY USE CASES ====================
  
  async createCountry(name: string): Promise<Country> {
    // Verificar que no exista un país con el mismo nombre
    const existingCountry = await this.countryRepository.findByName(name);
    if (existingCountry) {
      throw new Error('Country with this name already exists');
    }

    // Validar datos de entrada
    if (!name || name.trim().length === 0) {
      throw new Error('Country name is required');
    }

    if (name.length < 2) {
      throw new Error('Country name must be at least 2 characters long');
    }

    if (name.length > 100) {
      throw new Error('Country name must not exceed 100 characters');
    }

    // Crear nuevo país
    const country = Country.create(name.trim());
    return await this.countryRepository.save(country);
  }

  async getCountryById(id: number): Promise<Country | null> {
    return await this.countryRepository.findById(id);
  }

  async getCountryByName(name: string): Promise<Country | null> {
    return await this.countryRepository.findByName(name);
  }

  async getAllCountries(): Promise<Country[]> {
    return await this.countryRepository.findAll();
  }

  async updateCountry(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Country | null> {
    const existingCountry = await this.countryRepository.findById(id);
    if (!existingCountry) {
      return null;
    }

    // Validar nombre si se está actualizando
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error('Country name is required');
      }

      if (updates.name.length < 2) {
        throw new Error('Country name must be at least 2 characters long');
      }

      if (updates.name.length > 100) {
        throw new Error('Country name must not exceed 100 characters');
      }

      // Verificar que no exista otro país con el mismo nombre
      const existingWithSameName = await this.countryRepository.findByName(updates.name.trim());
      if (existingWithSameName && existingWithSameName.id !== id) {
        throw new Error('Country with this name already exists');
      }
    }

    // Crear nuevo objeto con los datos actualizados
    const updatedCountry = new Country(
      existingCountry.id,
      updates.name?.trim() ?? existingCountry.name,
      existingCountry.createdAt,
      new Date() // updatedAt
    );

    return await this.countryRepository.save(updatedCountry);
  }

  async deleteCountry(id: number): Promise<void> {
    const existingCountry = await this.countryRepository.findById(id);
    if (!existingCountry) {
      throw new Error('Country not found');
    }

    // Verificar que no tenga provincias asociadas antes de eliminar
    const provinces = await this.provinceRepository.findByCountryId(id);
    if (provinces.length > 0) {
      throw new Error('Cannot delete country with associated provinces');
    }

    await this.countryRepository.delete(id);
  }

  // ==================== PROVINCE USE CASES ====================
  
  async createProvince(name: string, countryId: number): Promise<Province> {
    // Verificar que el país exista
    const country = await this.countryRepository.findById(countryId);
    if (!country) {
      throw new Error('Country not found');
    }

    // Verificar que no exista una provincia con el mismo nombre en el mismo país
    const provinces = await this.provinceRepository.findByCountryId(countryId);
    const existingProvince = provinces.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingProvince) {
      throw new Error('Province with this name already exists in this country');
    }

    // Validar datos de entrada
    if (!name || name.trim().length === 0) {
      throw new Error('Province name is required');
    }

    if (name.length < 2) {
      throw new Error('Province name must be at least 2 characters long');
    }

    if (name.length > 100) {
      throw new Error('Province name must not exceed 100 characters');
    }

    // Crear nueva provincia
    const province = Province.create(name.trim(), countryId);
    return await this.provinceRepository.save(province);
  }

  async getProvinceById(id: number): Promise<Province | null> {
    return await this.provinceRepository.findById(id);
  }

  async getProvinceByName(name: string): Promise<Province | null> {
    return await this.provinceRepository.findByName(name);
  }

  async getProvincesByCountryId(countryId: number): Promise<Province[]> {
    return await this.provinceRepository.findByCountryId(countryId);
  }

  async getAllProvinces(): Promise<Province[]> {
    return await this.provinceRepository.findAll();
  }

  async updateProvince(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Province | null> {
    const existingProvince = await this.provinceRepository.findById(id);
    if (!existingProvince) {
      return null;
    }

    // Validar nombre si se está actualizando
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error('Province name is required');
      }

      if (updates.name.length < 2) {
        throw new Error('Province name must be at least 2 characters long');
      }

      if (updates.name.length > 100) {
        throw new Error('Province name must not exceed 100 characters');
      }

      // Verificar que no exista otra provincia con el mismo nombre en el mismo país
      const provinces = await this.provinceRepository.findByCountryId(existingProvince.countryId);
      const existingWithSameName = provinces.find(p => 
        p.name.toLowerCase() === updates.name!.toLowerCase() && p.id !== id
      );
      if (existingWithSameName) {
        throw new Error('Province with this name already exists in this country');
      }
    }

    // Crear nuevo objeto con los datos actualizados
    const updatedProvince = new Province(
      existingProvince.id,
      updates.name?.trim() ?? existingProvince.name,
      existingProvince.countryId,
      existingProvince.createdAt,
      new Date() // updatedAt
    );

    return await this.provinceRepository.save(updatedProvince);
  }

  async deleteProvince(id: number): Promise<void> {
    const existingProvince = await this.provinceRepository.findById(id);
    if (!existingProvince) {
      throw new Error('Province not found');
    }

    // Verificar que no tenga localidades asociadas antes de eliminar
    const localities = await this.localityRepository.findByProvinceId(id);
    if (localities.length > 0) {
      throw new Error('Cannot delete province with associated localities');
    }

    await this.provinceRepository.delete(id);
  }

  // ==================== LOCALITY USE CASES ====================
  
  async createLocality(name: string, provinceId: number): Promise<Locality> {
    // Verificar que la provincia exista
    const province = await this.provinceRepository.findById(provinceId);
    if (!province) {
      throw new Error('Province not found');
    }

    // Verificar que no exista una localidad con el mismo nombre en la misma provincia
    const localities = await this.localityRepository.findByProvinceId(provinceId);
    const existingLocality = localities.find(l => l.name.toLowerCase() === name.toLowerCase());
    if (existingLocality) {
      throw new Error('Locality with this name already exists in this province');
    }

    // Validar datos de entrada
    if (!name || name.trim().length === 0) {
      throw new Error('Locality name is required');
    }

    if (name.length < 2) {
      throw new Error('Locality name must be at least 2 characters long');
    }

    if (name.length > 100) {
      throw new Error('Locality name must not exceed 100 characters');
    }

    // Crear nueva localidad
    const locality = Locality.create(name.trim(), provinceId);
    return await this.localityRepository.save(locality);
  }

  async getLocalityById(id: number): Promise<Locality | null> {
    return await this.localityRepository.findById(id);
  }

  async getLocalityByName(name: string): Promise<Locality | null> {
    return await this.localityRepository.findByName(name);
  }

  async getLocalitiesByProvinceId(provinceId: number): Promise<Locality[]> {
    return await this.localityRepository.findByProvinceId(provinceId);
  }

  async getAllLocalities(): Promise<Locality[]> {
    return await this.localityRepository.findAll();
  }

  async updateLocality(
    id: number,
    updates: Partial<{ name: string }>
  ): Promise<Locality | null> {
    const existingLocality = await this.localityRepository.findById(id);
    if (!existingLocality) {
      return null;
    }

    // Validar nombre si se está actualizando
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error('Locality name is required');
      }

      if (updates.name.length < 2) {
        throw new Error('Locality name must be at least 2 characters long');
      }

      if (updates.name.length > 100) {
        throw new Error('Locality name must not exceed 100 characters');
      }

      // Verificar que no exista otra localidad con el mismo nombre en la misma provincia
      const localities = await this.localityRepository.findByProvinceId(existingLocality.provinceId);
      const existingWithSameName = localities.find(l => 
        l.name.toLowerCase() === updates.name!.toLowerCase() && l.id !== id
      );
      if (existingWithSameName) {
        throw new Error('Locality with this name already exists in this province');
      }
    }

    // Crear nuevo objeto con los datos actualizados
    const updatedLocality = new Locality(
      existingLocality.id,
      updates.name?.trim() ?? existingLocality.name,
      existingLocality.provinceId,
      existingLocality.createdAt,
      new Date() // updatedAt
    );

    return await this.localityRepository.save(updatedLocality);
  }

  async deleteLocality(id: number): Promise<void> {
    const existingLocality = await this.localityRepository.findById(id);
    if (!existingLocality) {
      throw new Error('Locality not found');
    }

    // TODO: Verificar que no tenga referencias en otras entidades (UserProfile, Offer, etc.)
    // antes de eliminar

    await this.localityRepository.delete(id);
  }
}
