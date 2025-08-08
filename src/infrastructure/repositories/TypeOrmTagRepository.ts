import { Repository, In } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { TagEntity } from '../database/entities/TagEntity';
import { Tag } from '../../domain/entities/Tag';
import { TagRepository } from '../../domain/repositories/TagRepository';

export class TypeOrmTagRepository implements TagRepository {
  private repository: Repository<TagEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(TagEntity);
  }

  async findAll(): Promise<Tag[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findById(id: number): Promise<Tag | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByName(name: string): Promise<Tag | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? this.mapEntityToDomain(entity) : null;
  }

  async findByNames(names: string[]): Promise<Tag[]> {
    const entities = await this.repository.find({
      where: { name: In(names) }
    });
    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async save(tag: Tag): Promise<Tag> {
    const entity = new TagEntity();
    entity.name = tag.name;
    entity.description = tag.description;
    entity.color = tag.color;

    const savedEntity = await this.repository.save(entity);
    return this.mapEntityToDomain(savedEntity);
  }

  async update(tag: Tag): Promise<Tag> {
    const entity = await this.repository.findOne({ where: { id: tag.id } });
    if (!entity) {
      throw new Error('Tag not found');
    }

    entity.name = tag.name;
    entity.description = tag.description;
    entity.color = tag.color;

    const updatedEntity = await this.repository.save(entity);
    return this.mapEntityToDomain(updatedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private mapEntityToDomain(entity: TagEntity): Tag {
    return new Tag(
      entity.id,
      entity.name,
      entity.description,
      entity.color,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
