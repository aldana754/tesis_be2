import { PreferenceUseCases } from '../../domain/usecases/PreferenceUseCases';
import { Preference } from '../../domain/entities/Preference';
import { PreferenceStatistic } from '../../domain/repositories/PreferenceRepository';

export class PreferenceService {
  constructor(
    private preferenceUseCases: PreferenceUseCases
  ) {}

  async addPreference(userId: number | null, tagId: number): Promise<Preference> {
    return await this.preferenceUseCases.addPreference(userId, tagId);
  }

  async getUserPreferences(userId: number): Promise<Preference[]> {
    return await this.preferenceUseCases.getUserPreferences(userId);
  }

  async getStatistics(): Promise<PreferenceStatistic[]> {
    return await this.preferenceUseCases.getPreferenceStatistics();
  }

  async getAllPreferences(): Promise<Preference[]> {
    return await this.preferenceUseCases.getAllPreferences();
  }

  async getTotalResponses(): Promise<number> {
    return await this.preferenceUseCases.getTotalResponses();
  }

  async getPreferencesByTag(tagId: number): Promise<Preference[]> {
    return await this.preferenceUseCases.getPreferencesByTag(tagId);
  }

  async clearUserPreferences(userId: number): Promise<number> {
    return await this.preferenceUseCases.clearUserPreferences(userId);
  }
}
