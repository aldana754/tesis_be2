import { Tag } from '../entities/Tag';

export interface TagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  findByName(name: string): Promise<Tag | null>;
  findByNames(names: string[]): Promise<Tag[]>;
  save(tag: Tag): Promise<Tag>;
  update(tag: Tag): Promise<Tag>;
  delete(id: number): Promise<void>;
}
