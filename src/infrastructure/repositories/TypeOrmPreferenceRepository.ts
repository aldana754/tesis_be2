import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { PreferenceEntity } from '../database/entities/PreferenceEntity';
import { Preference } from '../../domain/entities/Preference';
import { PreferenceRepository, PreferenceStatistic } from '../../domain/repositories/PreferenceRepository';

export class TypeOrmPreferenceRepository implements PreferenceRepository {
  private repository: Repository<PreferenceEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(PreferenceEntity);
  }

  async save(preference: Preference): Promise<Preference> {
    const entity = new PreferenceEntity();
    entity.userId = preference.userId;
    entity.tagId = preference.tagId;
    entity.tagName = preference.tagName;

    const savedEntity = await this.repository.save(entity);
    return this.mapEntityToDomain(savedEntity);
  }

  async findByUserId(userId: number): Promise<Preference[]> {
    const entities = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findAll(): Promise<Preference[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async getStatistics(): Promise<PreferenceStatistic[]> {
    const rawResults = await this.repository
      .createQueryBuilder('preference')
      .select('preference.tagId', 'tagId')
      .addSelect('preference.tagName', 'tagName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('preference.tagId')
      .addGroupBy('preference.tagName')
      .orderBy('count', 'DESC')
      .getRawMany();

    const totalResponses = await this.getTotalResponses();

    return rawResults.map(result => ({
      tagId: parseInt(result.tagId),
      tagName: result.tagName,
      count: parseInt(result.count),
      percentage: totalResponses > 0 ? Math.round((parseInt(result.count) / totalResponses) * 100 * 100) / 100 : 0
    }));
  }

  async getTotalResponses(): Promise<number> {
    return await this.repository.count();
  }

  async findByTagId(tagId: number): Promise<Preference[]> {
    const entities = await this.repository.find({
      where: { tagId },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async deleteByUserId(userId: number): Promise<number> {
    const result = await this.repository.delete({ userId });
    return result.affected || 0;
  }

  private mapEntityToDomain(entity: PreferenceEntity): Preference {
    return new Preference(
      entity.id,
      entity.userId,
      entity.tagId,
      entity.tagName,
      entity.createdAt
    );
  }
}
