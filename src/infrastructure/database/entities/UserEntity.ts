import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../../domain/entities/UserRole';
import { OfferEntity } from './OfferEntity';

@Entity("userProfile")
export class UserProfileEntity {
  @PrimaryGeneratedColumn()  // Volvemos a auto-increment
  id!: number;

  @Column({ type: "enum", enum: UserRole, default: UserRole.CLIENT })
  role!: UserRole;

  @Column({ nullable: false })
  firstName!: string;
    
  @Column({ nullable: false })
  lastname!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column()
  phoneNumber!: string;

  @Column({ type: "varchar", nullable: true })
  profilePhotoUrl!: string | null;
    
  // Relación OneToOne - un usuario tiene una dirección
  @ManyToOne('AddressEntity', { nullable: true, eager: true })
  @JoinColumn()
  address!: any;

  @Column({ nullable: true })
  addressId!: number | null; // Foreign key

  // Relación OneToMany - un usuario puede tener muchas ofertas
  @OneToMany(() => OfferEntity, (offer) => offer.owner)
  offers!: OfferEntity[];

  // Relación OneToMany - un usuario puede tener muchas reviews
  @OneToMany('ReviewEntity', 'user')
  reviews!: any[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
