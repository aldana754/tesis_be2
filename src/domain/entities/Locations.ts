// Location-related domain entities

export class Country {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(name: string): Country {
    const now = new Date();
    return new Country(
      0, // ID será generado por la base de datos
      name,
      now,
      now
    );
  }
}

export class Province {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly countryId: number, // Relación ManyToOne - una provincia pertenece a un país
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(name: string, countryId: number): Province {
    const now = new Date();
    return new Province(
      0, // ID será generado por la base de datos
      name,
      countryId,
      now,
      now
    );
  }
}

export class Locality {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly provinceId: number, // Relación ManyToOne - una localidad pertenece a una provincia
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(name: string, provinceId: number): Locality {
    const now = new Date();
    return new Locality(
      0, // ID será generado por la base de datos
      name,
      provinceId,
      now,
      now
    );
  }
}

export class Address {
  constructor(
    public readonly id: number,
    public readonly localityId: number, // Relación ManyToOne - una dirección pertenece a una localidad
    public readonly street: string,
    public readonly floor: string | null,
    public readonly postalCode: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    localityId: number,
    street: string,
    postalCode?: string,
    floor?: string
  ): Address {
    const now = new Date();
    return new Address(
      0, // ID será generado por la base de datos
      localityId,
      street,
      floor || null,
      postalCode || null,
      now,
      now
    );
  }
}
