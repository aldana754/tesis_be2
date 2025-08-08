import { AppDataSource } from '../data-source';
import { CountryEntity } from '../entities/LocationEntities';
import { ProvinceEntity } from '../entities/LocationEntities';
import { LocalityEntity } from '../entities/LocationEntities';
import { argentinaData } from './argentina-data';

export class LocationSeeder {
  static async run() {
    try {
      console.log('🌱 Starting location seeding...');

      // Initialize database connection
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      const countryRepository = AppDataSource.getRepository(CountryEntity);
      const provinceRepository = AppDataSource.getRepository(ProvinceEntity);
      const localityRepository = AppDataSource.getRepository(LocalityEntity);

      // Check if Argentina already exists
      let argentina = await countryRepository.findOne({ 
        where: { name: argentinaData.country.name } 
      });

      if (!argentina) {
        // Create Argentina
        console.log('📍 Creating country: Argentina');
        argentina = countryRepository.create({
          name: argentinaData.country.name
        });
        argentina = await countryRepository.save(argentina);
        console.log(`✅ Country created with ID: ${argentina.id}`);
      } else {
        console.log('📍 Argentina already exists, skipping country creation');
      }

      // Process provinces
      for (const provinceData of argentinaData.provinces) {
        console.log(`🏛️ Processing province: ${provinceData.name}`);

        // Check if province already exists
        let province = await provinceRepository.findOne({
          where: { 
            name: provinceData.name,
            countryId: argentina.id 
          }
        });

        if (!province) {
          // Create province
          province = provinceRepository.create({
            name: provinceData.name,
            countryId: argentina.id
          });
          province = await provinceRepository.save(province);
          console.log(`  ✅ Province created: ${province.name} (ID: ${province.id})`);
        } else {
          console.log(`  📍 Province ${provinceData.name} already exists`);
        }

        // Process localities for this province
        for (const localityName of provinceData.localities) {
          // Check if locality already exists
          const existingLocality = await localityRepository.findOne({
            where: { 
              name: localityName,
              provinceId: province.id 
            }
          });

          if (!existingLocality) {
            // Create locality
            const locality = localityRepository.create({
              name: localityName,
              provinceId: province.id
            });
            await localityRepository.save(locality);
            console.log(`    ✅ Locality created: ${localityName}`);
          } else {
            console.log(`    📍 Locality ${localityName} already exists`);
          }
        }
      }

      console.log('🎉 Location seeding completed successfully!');
      
      // Print summary
      const countryCount = await countryRepository.count();
      const provinceCount = await provinceRepository.count();
      const localityCount = await localityRepository.count();
      
      console.log('\n📊 Summary:');
      console.log(`   Countries: ${countryCount}`);
      console.log(`   Provinces: ${provinceCount}`);
      console.log(`   Localities: ${localityCount}`);

    } catch (error) {
      console.error('❌ Error during location seeding:', error);
      throw error;
    }
  }
}
