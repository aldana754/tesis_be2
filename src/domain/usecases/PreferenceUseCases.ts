import { Preference } from '../entities/Preference';
import { PreferenceRepository, PreferenceStatistic } from '../repositories/PreferenceRepository';
import { TagRepository } from '../repositories/TagRepository';

export class PreferenceUseCases {
  constructor(
    private preferenceRepository: PreferenceRepository,
    private tagRepository: TagRepository
  ) {}

  async addPreference(userId: number | null, tagId: number): Promise<Preference> {
    // Verificar que el tag existe
    const tag = await this.tagRepository.findById(tagId);
    if (!tag) {
      throw new Error('Tag no encontrado');
    }

    // Crear la preferencia
    const preference = Preference.create(userId, tagId, tag.name);
    
    return await this.preferenceRepository.save(preference);
  }

  async getUserPreferences(userId: number): Promise<Preference[]> {
    return await this.preferenceRepository.findByUserId(userId);
  }

  async getPreferenceStatistics(): Promise<PreferenceStatistic[]> {
    return await this.preferenceRepository.getStatistics();
  }

  async getAllPreferences(): Promise<Preference[]> {
    return await this.preferenceRepository.findAll();
  }

  async getTotalResponses(): Promise<number> {
    return await this.preferenceRepository.getTotalResponses();
  }

  async getPreferencesByTag(tagId: number): Promise<Preference[]> {
    return await this.preferenceRepository.findByTagId(tagId);
  }

  async clearUserPreferences(userId: number): Promise<number> {
    return await this.preferenceRepository.deleteByUserId(userId);
  }
}
