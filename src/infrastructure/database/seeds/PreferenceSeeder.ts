import { DataSource } from 'typeorm';
import { PreferenceEntity } from '../entities/PreferenceEntity';
import { UserProfileEntity } from '../entities/UserEntity';
import { TagEntity } from '../entities/TagEntity';

export class PreferenceSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Seeding preferences...');
    
    const preferenceRepository = dataSource.getRepository(PreferenceEntity);
    const userRepository = dataSource.getRepository(UserProfileEntity);
    const tagRepository = dataSource.getRepository(TagEntity);

    // Verificar si ya existen preferencias
    const existingPreferences = await preferenceRepository.find();
    if (existingPreferences.length > 0) {
      console.log('📝 Preferences already exist in the database');
      return;
    }

    // Obtener usuarios y tags
    const users = await userRepository.find();
    const tags = await tagRepository.find();

    if (users.length === 0 || tags.length === 0) {
      console.log('⚠️ Missing required data. Please run other seeders first.');
      return;
    }

    // Crear preferencias para algunos usuarios
    const preferenceData = [
      // Cliente 1 - prefiere servicios de mantenimiento del hogar
      { userId: users[0]?.id, tagNames: ['Plomería', 'Electricidad', 'Pintura'] },
      
      // Usuario anónimo 1 - interesado en servicios de jardín
      { userId: null, tagNames: ['Jardinería', 'Limpieza'] },
      
      // Usuario anónimo 2 - servicios variados
      { userId: null, tagNames: ['Tecnología', 'Carpintería', 'Fitness'] },
      
      // Cliente 2 - servicios premium
      { userId: users[1]?.id, tagNames: ['Cocina', 'Belleza', 'Mascotas'] },
      
      // Usuario anónimo 3 - servicios básicos
      { userId: null, tagNames: ['Limpieza', 'Transporte'] },
      
      // Cliente 3 - servicios técnicos
      { userId: users[2]?.id, tagNames: ['Tecnología', 'Electricidad', 'Reparaciones'] },
      
      // Más preferencias anónimas para estadísticas
      { userId: null, tagNames: ['Plomería'] },
      { userId: null, tagNames: ['Jardinería'] },
      { userId: null, tagNames: ['Tecnología'] },
      { userId: null, tagNames: ['Limpieza'] },
      { userId: null, tagNames: ['Pintura'] },
      { userId: null, tagNames: ['Electricidad'] },
      { userId: null, tagNames: ['Carpintería'] },
      { userId: null, tagNames: ['Fitness'] },
      { userId: null, tagNames: ['Cocina'] },
      { userId: null, tagNames: ['Belleza'] },
      
      // Algunos usuarios con preferencias múltiples
      { userId: null, tagNames: ['Plomería', 'Electricidad'] },
      { userId: null, tagNames: ['Jardinería', 'Limpieza', 'Pintura'] },
      { userId: null, tagNames: ['Tecnología', 'Reparaciones'] },
      { userId: null, tagNames: ['Fitness', 'Belleza', 'Mascotas'] },
      { userId: null, tagNames: ['Cocina', 'Limpieza'] },
    ];

    for (const prefData of preferenceData) {
      for (const tagName of prefData.tagNames) {
        const tag = tags.find(t => t.name === tagName);
        if (!tag) continue;

        const preference = preferenceRepository.create({
          userId: prefData.userId,
          tagId: tag.id,
          tagName: tag.name
        });

        await preferenceRepository.save(preference);
      }
    }

    console.log('✅ Sample preferences created successfully');
    console.log('📊 Created preferences for popular tourism categories');
  }
}
