// Location-related domain repositories
import { Country, Province, Locality, Address } from '../entities/Locations';

export interface CountryRepository {
  findById(id: number): Promise<Country | null>;
  findByName(name: string): Promise<Country | null>;
  findAll(): Promise<Country[]>;
  save(country: Country): Promise<Country>;
  delete(id: number): Promise<void>;
}

export interface ProvinceRepository {
  findById(id: number): Promise<Province | null>;
  findByName(name: string): Promise<Province | null>;
  findByCountryId(countryId: number): Promise<Province[]>;
  findAll(): Promise<Province[]>;
  save(province: Province): Promise<Province>;
  delete(id: number): Promise<void>;
}

export interface LocalityRepository {
  findById(id: number): Promise<Locality | null>;
  findByName(name: string): Promise<Locality | null>;
  findByProvinceId(provinceId: number): Promise<Locality[]>;
  findAll(): Promise<Locality[]>;
  save(locality: Locality): Promise<Locality>;
  delete(id: number): Promise<void>;
}

export interface AddressRepository {
  findById(id: number): Promise<Address | null>;
  findByLocalityId(localityId: number): Promise<Address[]>;
  findAll(): Promise<Address[]>;
  save(address: Address): Promise<Address>;
  delete(id: number): Promise<void>;
}
