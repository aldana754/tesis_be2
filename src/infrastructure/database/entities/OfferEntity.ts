import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { OfferPriceUnit } from '../../../domain/entities/OfferPriceUnit';
import { Currency } from '../../../domain/entities/Currency';
import { UserProfileEntity } from './UserEntity';
import { TagEntity } from './TagEntity';

@Entity("offer")
export class OfferEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ length: 200 })
  shortDescription!: string;

  @Column({ length: 600 })
  longDescription!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "enum", enum: OfferPriceUnit, default: OfferPriceUnit.UNIQUE })
  priceUnit!: OfferPriceUnit;

  @Column({ type: "enum", enum: Currency, default: Currency.USD })
  currency!: Currency;

  @Column({ type: "varchar", nullable: true })
  mainPhoto!: string | null;

  @Column({ type: "text", array: true, default: () => "ARRAY[]::text[]" })
  multimedia!: string[];

  // Relación con el propietario de la oferta
  @ManyToOne(() => UserProfileEntity, (user) => user.offers)
  owner!: UserProfileEntity;

  @Column()
  ownerId!: number;

  // Relación con la dirección
  @ManyToOne('AddressEntity', { nullable: true, eager: true })
  @JoinColumn()
  address!: any;

  @Column({ nullable: true })
  addressId!: number | null;

  // Relación muchos a muchos con tags
  @ManyToMany(() => TagEntity, tag => tag.offers)
  @JoinTable({
    name: 'offer_tags',
    joinColumn: { name: 'offer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags!: TagEntity[];

  // Relación con reseñas
  @OneToMany('ReviewEntity', 'offer')
  reviews!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
