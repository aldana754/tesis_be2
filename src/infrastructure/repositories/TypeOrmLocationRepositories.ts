// Location-related TypeORM repository implementations
import { Repository } from 'typeorm';
import { CountryRepository, ProvinceRepository, LocalityRepository, AddressRepository } from '../../domain/repositories/LocationRepositories';
import { Country, Province, Locality, Address } from '../../domain/entities/Locations';
import { CountryEntity, ProvinceEntity, LocalityEntity, AddressEntity } from '../database/entities/LocationEntities';
import { AppDataSource } from '../database/data-source';

export class TypeOrmCountryRepository implements CountryRepository {
  private repository: Repository<CountryEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(CountryEntity);
  }

  async findById(id: number): Promise<Country | null> {
    const countryEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['provinces']
    });
    return countryEntity ? this.toDomain(countryEntity) : null;
  }

  async findByName(name: string): Promise<Country | null> {
    const countryEntity = await this.repository.findOne({ 
      where: { name },
      relations: ['provinces']
    });
    return countryEntity ? this.toDomain(countryEntity) : null;
  }

  async findAll(): Promise<Country[]> {
    const countryEntities = await this.repository.find({
      relations: ['provinces']
    });
    return countryEntities.map(this.toDomain);
  }

  async save(country: Country): Promise<Country> {
    const countryEntity = this.toEntity(country);
    const savedEntity = await this.repository.save(countryEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: CountryEntity): Country {
    return new Country(
      entity.id,
      entity.name,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(country: Country): CountryEntity {
    const entity = new CountryEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (country.id !== 0) {
      entity.id = country.id;
    }
    
    entity.name = country.name;
    
    // Solo establecer fechas si no es un nuevo país
    if (country.id !== 0) {
      entity.createdAt = country.createdAt;
      entity.updatedAt = country.updatedAt;
    }
    
    return entity;
  }
}

export class TypeOrmProvinceRepository implements ProvinceRepository {
  private repository: Repository<ProvinceEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(ProvinceEntity);
  }

  async findById(id: number): Promise<Province | null> {
    const provinceEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['country', 'localities']
    });
    return provinceEntity ? this.toDomain(provinceEntity) : null;
  }

  async findByName(name: string): Promise<Province | null> {
    const provinceEntity = await this.repository.findOne({ 
      where: { name },
      relations: ['country', 'localities']
    });
    return provinceEntity ? this.toDomain(provinceEntity) : null;
  }

  async findByCountryId(countryId: number): Promise<Province[]> {
    const provinceEntities = await this.repository.find({ 
      where: { countryId },
      relations: ['country', 'localities']
    });
    return provinceEntities.map(this.toDomain);
  }

  async findAll(): Promise<Province[]> {
    const provinceEntities = await this.repository.find({
      relations: ['country', 'localities']
    });
    return provinceEntities.map(this.toDomain);
  }

  async save(province: Province): Promise<Province> {
    const provinceEntity = this.toEntity(province);
    const savedEntity = await this.repository.save(provinceEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: ProvinceEntity): Province {
    return new Province(
      entity.id,
      entity.name,
      entity.countryId,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(province: Province): ProvinceEntity {
    const entity = new ProvinceEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (province.id !== 0) {
      entity.id = province.id;
    }
    
    entity.name = province.name;
    entity.countryId = province.countryId;
    
    // Solo establecer fechas si no es una nueva provincia
    if (province.id !== 0) {
      entity.createdAt = province.createdAt;
      entity.updatedAt = province.updatedAt;
    }
    
    return entity;
  }
}

export class TypeOrmLocalityRepository implements LocalityRepository {
  private repository: Repository<LocalityEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(LocalityEntity);
  }

  async findById(id: number): Promise<Locality | null> {
    const localityEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['province']
    });
    return localityEntity ? this.toDomain(localityEntity) : null;
  }

  async findByName(name: string): Promise<Locality | null> {
    const localityEntity = await this.repository.findOne({ 
      where: { name },
      relations: ['province']
    });
    return localityEntity ? this.toDomain(localityEntity) : null;
  }

  async findByProvinceId(provinceId: number): Promise<Locality[]> {
    const localityEntities = await this.repository.find({ 
      where: { provinceId },
      relations: ['province']
    });
    return localityEntities.map(this.toDomain);
  }

  async findAll(): Promise<Locality[]> {
    const localityEntities = await this.repository.find({
      relations: ['province']
    });
    return localityEntities.map(this.toDomain);
  }

  async save(locality: Locality): Promise<Locality> {
    const localityEntity = this.toEntity(locality);
    const savedEntity = await this.repository.save(localityEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: LocalityEntity): Locality {
    return new Locality(
      entity.id,
      entity.name,
      entity.provinceId,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(locality: Locality): LocalityEntity {
    const entity = new LocalityEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (locality.id !== 0) {
      entity.id = locality.id;
    }
    
    entity.name = locality.name;
    entity.provinceId = locality.provinceId;
    
    // Solo establecer fechas si no es una nueva localidad
    if (locality.id !== 0) {
      entity.createdAt = locality.createdAt;
      entity.updatedAt = locality.updatedAt;
    }
    
    return entity;
  }
}

export class TypeOrmAddressRepository implements AddressRepository {
  private repository: Repository<AddressEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AddressEntity);
  }

  async findById(id: number): Promise<Address | null> {
    const addressEntity = await this.repository.findOne({ 
      where: { id },
      relations: ['locality']
    });
    return addressEntity ? this.toDomain(addressEntity) : null;
  }

  async findByLocalityId(localityId: number): Promise<Address[]> {
    const addressEntities = await this.repository.find({ 
      where: { localityId },
      relations: ['locality']
    });
    return addressEntities.map(this.toDomain);
  }

  async findAll(): Promise<Address[]> {
    const addressEntities = await this.repository.find({
      relations: ['locality']
    });
    return addressEntities.map(this.toDomain);
  }

  async save(address: Address): Promise<Address> {
    const addressEntity = this.toEntity(address);
    const savedEntity = await this.repository.save(addressEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: AddressEntity): Address {
    return new Address(
      entity.id,
      entity.localityId,
      entity.street,
      entity.floor,
      entity.postalCode,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private toEntity(address: Address): AddressEntity {
    const entity = new AddressEntity();
    
    // Solo establecer el ID si no es 0 (para actualizaciones)
    if (address.id !== 0) {
      entity.id = address.id;
    }
    
    entity.localityId = address.localityId;
    entity.street = address.street;
    entity.floor = address.floor;
    entity.postalCode = address.postalCode;
    
    // Solo establecer fechas si no es una nueva dirección
    if (address.id !== 0) {
      entity.createdAt = address.createdAt;
      entity.updatedAt = address.updatedAt;
    }
    
    return entity;
  }
}
