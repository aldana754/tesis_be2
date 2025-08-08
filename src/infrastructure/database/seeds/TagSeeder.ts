import { DataSource } from 'typeorm';
import { TagEntity } from '../entities/TagEntity';

export async function seedTags(dataSource: DataSource): Promise<void> {
  const tagRepository = dataSource.getRepository(TagEntity);

  // Verificar si ya existen tags
  const existingTags = await tagRepository.find();
  if (existingTags.length > 0) {
    console.log('Tags ya existen en la base de datos');
    return;
  }

  const tags = [
    { name: 'Plomería', description: 'Servicios de instalación y reparación de tuberías', color: '#2196F3' },
    { name: 'Electricidad', description: 'Instalaciones y reparaciones eléctricas', color: '#FF9800' },
    { name: 'Jardinería', description: 'Cuidado y mantenimiento de jardines', color: '#4CAF50' },
    { name: 'Limpieza', description: 'Servicios de limpieza doméstica y comercial', color: '#9C27B0' },
    { name: 'Pintura', description: 'Trabajos de pintura interior y exterior', color: '#F44336' },
    { name: 'Carpintería', description: 'Trabajos en madera y muebles', color: '#795548' },
    { name: 'Albañilería', description: 'Construcción y reparaciones de albañilería', color: '#607D8B' },
    { name: 'Tecnología', description: 'Servicios de informática y tecnología', color: '#3F51B5' },
    { name: 'Educación', description: 'Clases particulares y tutorías', color: '#009688' },
    { name: 'Belleza', description: 'Servicios de estética y cuidado personal', color: '#E91E63' },
    { name: 'Mascotas', description: 'Cuidado y servicios para mascotas', color: '#CDDC39' },
    { name: 'Transporte', description: 'Servicios de mudanza y transporte', color: '#FFC107' },
    { name: 'Cocina', description: 'Servicios de catering y cocina', color: '#FF5722' },
    { name: 'Fitness', description: 'Entrenamiento personal y fitness', color: '#8BC34A' },
    { name: 'Reparaciones', description: 'Reparación de electrodomésticos y equipos', color: '#673AB7' }
  ];

  for (const tagData of tags) {
    const tag = new TagEntity();
    tag.name = tagData.name;
    tag.description = tagData.description;
    tag.color = tagData.color;
    await tagRepository.save(tag);
  }

  console.log('✅ Tags iniciales creados exitosamente');
}
