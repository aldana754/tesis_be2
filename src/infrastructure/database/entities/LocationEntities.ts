// Location-related infrastructure entities
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity("country")
export class CountryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  // Relación OneToMany - un país puede tener muchas provincias
  // Usamos string para evitar dependencia circular
  @OneToMany('ProvinceEntity', 'country')
  provinces!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("province")
export class ProvinceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // Relación ManyToOne - muchas provincias pueden pertenecer a un país
  @ManyToOne('CountryEntity', 'provinces')
  country!: any;

  @Column()
  countryId!: number; // Foreign key

  // Relación OneToMany - una provincia puede tener muchas localidades
  @OneToMany('LocalityEntity', 'province')
  localities!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("locality")
export class LocalityEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // Relación ManyToOne - muchas localidades pueden pertenecer a una provincia
  @ManyToOne('ProvinceEntity', 'localities')
  province!: any;

  @Column()
  provinceId!: number; // Foreign key

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("address")
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación ManyToOne - muchas direcciones pueden pertenecer a una localidad
  @ManyToOne('LocalityEntity', { nullable: false, eager: true })
  @JoinColumn()
  locality!: any;

  @Column({ nullable: false })
  localityId!: number; // Foreign key

  @Column({ type: 'varchar', length: 255, nullable: false })
  street!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  floor!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
