import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('preference')
export class PreferenceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId!: number | null;

  @Column({ name: 'tag_id', type: 'int' })
  tagId!: number;

  @Column({ name: 'tag_name', type: 'varchar', length: 50 })
  tagName!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
