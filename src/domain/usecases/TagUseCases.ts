import { Tag } from '../entities/Tag';
import { TagRepository } from '../repositories/TagRepository';

export class TagUseCases {
  constructor(private tagRepository: TagRepository) {}

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.findAll();
  }

  async getTagById(id: number): Promise<Tag | null> {
    return await this.tagRepository.findById(id);
  }

  async getTagByName(name: string): Promise<Tag | null> {
    return await this.tagRepository.findByName(name);
  }

  async getTagsByNames(names: string[]): Promise<Tag[]> {
    return await this.tagRepository.findByNames(names);
  }

  async createTag(name: string, description?: string, color?: string): Promise<Tag> {
    // Verificar que no exista un tag con el mismo nombre
    const existingTag = await this.tagRepository.findByName(name);
    if (existingTag) {
      throw new Error('Ya existe un tag con ese nombre');
    }

    const tag = Tag.create(name, description || null, color || null);
    return await this.tagRepository.save(tag);
  }

  async updateTag(id: number, name: string, description?: string, color?: string): Promise<Tag> {
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag no encontrado');
    }

    // Verificar que no exista otro tag con el mismo nombre
    const tagWithSameName = await this.tagRepository.findByName(name);
    if (tagWithSameName && tagWithSameName.id !== id) {
      throw new Error('Ya existe otro tag con ese nombre');
    }

    const updatedTag = new Tag(
      id,
      name,
      description || null,
      color || null,
      existingTag.createdAt,
      new Date()
    );

    return await this.tagRepository.update(updatedTag);
  }

  async deleteTag(id: number): Promise<void> {
    const existingTag = await this.tagRepository.findById(id);
    if (!existingTag) {
      throw new Error('Tag no encontrado');
    }

    await this.tagRepository.delete(id);
  }
}
