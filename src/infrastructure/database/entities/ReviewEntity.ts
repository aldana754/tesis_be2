import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Check } from 'typeorm';

@Entity("review")
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación ManyToOne - muchas reviews pueden pertenecer a una oferta
  @ManyToOne('OfferEntity', 'reviews', { nullable: false })
  @JoinColumn({ name: 'offerId' })
  offer!: any;

  @Column({ nullable: false })
  offerId!: number; // Foreign key

  // Relación ManyToOne - muchas reviews pueden pertenecer a un usuario
  @ManyToOne('UserProfileEntity', 'reviews', { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: any;

  @Column({ nullable: false })
  userId!: number; // Foreign key

  @Column({ type: 'varchar', length: 600, nullable: false })
  comment!: string;

  @Column({ type: 'int', nullable: false })
  rating!: number; // De 1 a 5

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
