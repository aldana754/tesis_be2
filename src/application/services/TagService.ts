import { TagUseCases } from '../../domain/usecases/TagUseCases';
import { Tag } from '../../domain/entities/Tag';

export class TagService {
  constructor(private tagUseCases: TagUseCases) {}

  async getAllTags(): Promise<Tag[]> {
    return await this.tagUseCases.getAllTags();
  }

  async getTagById(id: number): Promise<Tag | null> {
    return await this.tagUseCases.getTagById(id);
  }

  async getTagByName(name: string): Promise<Tag | null> {
    return await this.tagUseCases.getTagByName(name);
  }

  async getTagsByNames(names: string[]): Promise<Tag[]> {
    return await this.tagUseCases.getTagsByNames(names);
  }

  async createTag(name: string, description?: string, color?: string): Promise<Tag> {
    return await this.tagUseCases.createTag(name, description, color);
  }

  async updateTag(id: number, name: string, description?: string, color?: string): Promise<Tag> {
    return await this.tagUseCases.updateTag(id, name, description, color);
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagUseCases.deleteTag(id);
  }
}
