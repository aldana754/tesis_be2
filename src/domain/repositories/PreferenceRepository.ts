import { Preference } from '../entities/Preference';

export interface PreferenceStatistic {
  tagId: number;
  tagName: string;
  count: number;
  percentage: number;
}

export interface PreferenceRepository {
  save(preference: Preference): Promise<Preference>;
  findByUserId(userId: number): Promise<Preference[]>;
  findAll(): Promise<Preference[]>;
  getStatistics(): Promise<PreferenceStatistic[]>;
  getTotalResponses(): Promise<number>;
  findByTagId(tagId: number): Promise<Preference[]>;
  deleteByUserId(userId: number): Promise<number>;
}
