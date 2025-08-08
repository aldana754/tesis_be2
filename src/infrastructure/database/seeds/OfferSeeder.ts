import { DataSource } from 'typeorm';
import { OfferEntity } from '../entities/OfferEntity';
import { TagEntity } from '../entities/TagEntity';
import { UserProfileEntity } from '../entities/UserEntity';
import { Currency } from '../../../domain/entities/Currency';
import { OfferPriceUnit } from '../../../domain/entities/OfferPriceUnit';

export class OfferSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Seeding offers...');
    
    const offerRepository = dataSource.getRepository(OfferEntity);
    const tagRepository = dataSource.getRepository(TagEntity);
    const userRepository = dataSource.getRepository(UserProfileEntity);

    // Verificar si ya existen ofertas
    const existingOffers = await offerRepository.find();
    if (existingOffers.length > 0) {
      console.log('📝 Offers already exist in the database');
      return;
    }

    // Obtener datos necesarios
    const users = await userRepository.find();
    const tags = await tagRepository.find();

    if (users.length === 0 || tags.length === 0) {
      console.log('⚠️ Missing required data. Please run other seeders first.');
      return;
    }

    const offers = [
      {
        title: 'Reparación de tuberías y grifería',
        shortDescription: 'Servicio completo de plomería residencial',
        longDescription: 'Servicio completo de plomería. Reparo fugas, instalo grifería nueva, destapado de cañerías y mantenimiento general. Trabajo con materiales de primera calidad y garantía de 6 meses en todos los trabajos realizados.',
        price: 2500,
        tagName: 'Plomería',
        userIndex: 0,
        priceUnit: OfferPriceUnit.PER_HOUR,
        currency: Currency.ARS,
        multimedia: ['plomeria1.jpg', 'plomeria2.jpg']
      },
      {
        title: 'Instalación eléctrica residencial',
        shortDescription: 'Electricista matriculado para instalaciones',
        longDescription: 'Electricista matriculado. Instalaciones nuevas, reparaciones, puesta a tierra, tableros eléctricos. Trabajo certificado con materiales homologados y garantía técnica.',
        price: 3000,
        tagName: 'Electricidad',
        userIndex: 1,
        priceUnit: OfferPriceUnit.PER_HOUR,
        currency: Currency.ARS,
        multimedia: ['electricidad1.jpg', 'electricidad2.jpg']
      },
      {
        title: 'Diseño y mantenimiento de jardines',
        shortDescription: 'Paisajismo profesional y jardines sustentables',
        longDescription: 'Paisajismo profesional. Diseño de jardines, poda, plantación, sistemas de riego automático. Enfoque en plantas nativas y jardines sustentables con bajo mantenimiento.',
        price: 1800,
        tagName: 'Jardinería',
        userIndex: 2,
        priceUnit: OfferPriceUnit.PER_HOUR,
        currency: Currency.ARS,
        multimedia: ['jardineria1.jpg', 'jardineria2.jpg']
      },
      {
        title: 'Muebles a medida y restauración',
        shortDescription: 'Carpintería artesanal y restauración',
        longDescription: 'Carpintero artesanal. Muebles personalizados, restauración de antigüedades, trabajos en madera maciza. Diseños únicos y terminaciones de alta calidad con maderas nobles.',
        price: 4500,
        tagName: 'Carpintería',
        userIndex: 3,
        priceUnit: OfferPriceUnit.UNIQUE,
        currency: Currency.ARS,
        multimedia: ['carpinteria1.jpg', 'carpinteria2.jpg']
      },
      {
        title: 'Limpieza profunda y organización',
        shortDescription: 'Servicio integral con productos eco-friendly',
        longDescription: 'Servicio integral de limpieza. Productos eco-friendly, organización de espacios, limpieza post-obra. Atención personalizada y resultados garantizados con métodos sustentables.',
        price: 2000,
        tagName: 'Limpieza',
        userIndex: 4,
        priceUnit: OfferPriceUnit.UNIQUE,
        currency: Currency.ARS,
        multimedia: ['limpieza1.jpg', 'limpieza2.jpg']
      },
      {
        title: 'Pintura decorativa y murales',
        shortDescription: 'Técnicas decorativas y arte mural',
        longDescription: 'Pintor profesional especializado en técnicas decorativas. Murales artísticos, efectos especiales, restauración de fachadas. Portfolio disponible con trabajos personalizados.',
        price: 2800,
        tagName: 'Pintura',
        userIndex: 5,
        priceUnit: OfferPriceUnit.PER_HOUR,
        currency: Currency.ARS,
        multimedia: ['pintura1.jpg', 'pintura2.jpg']
      },
      {
        title: 'Soporte técnico informático',
        shortDescription: 'Reparación y mantenimiento de equipos',
        longDescription: 'Reparación y mantenimiento de PC y notebooks. Instalación de software, limpieza de virus, configuración de redes domésticas. Servicio a domicilio con diagnóstico gratuito.',
        price: 2200,
        tagName: 'Tecnología',
        userIndex: 6,
        priceUnit: OfferPriceUnit.UNIQUE,
        currency: Currency.ARS,
        multimedia: ['tecnologia1.jpg', 'tecnologia2.jpg']
      },
      {
        title: 'Entrenamiento personal funcional',
        shortDescription: 'Personal trainer certificado',
        longDescription: 'Personal trainer certificado. Entrenamientos personalizados, rehabilitación, preparación física. Equipamiento propio, planes nutricionales incluidos y seguimiento constante.',
        price: 3500,
        tagName: 'Fitness',
        userIndex: 7,
        priceUnit: OfferPriceUnit.PER_HOUR,
        currency: Currency.ARS,
        multimedia: ['fitness1.jpg', 'fitness2.jpg']
      },
      {
        title: 'Catering y eventos especiales',
        shortDescription: 'Chef profesional para eventos',
        longDescription: 'Chef profesional. Catering para eventos, clases de cocina, menús personalizados. Especialidad en cocina argentina y internacional con ingredientes de primera calidad.',
        price: 5000,
        tagName: 'Cocina',
        userIndex: 8,
        priceUnit: OfferPriceUnit.UNIQUE,
        currency: Currency.ARS,
        multimedia: ['cocina1.jpg', 'cocina2.jpg']
      }
    ];

    for (const offerData of offers) {
      // Buscar el tag correspondiente
      const tag = tags.find(t => t.name === offerData.tagName);
      if (!tag) continue;

      // Seleccionar usuario
      const user = users[offerData.userIndex % users.length];

      const offer = offerRepository.create({
        title: offerData.title,
        shortDescription: offerData.shortDescription,
        longDescription: offerData.longDescription,
        price: offerData.price,
        currency: offerData.currency,
        priceUnit: offerData.priceUnit,
        multimedia: offerData.multimedia,
        mainPhoto: offerData.multimedia[0],
        owner: user,
        ownerId: user.id,
        tags: [tag]
      });

      await offerRepository.save(offer);
    }

    console.log('✅ Sample offers created successfully');
  }
}
