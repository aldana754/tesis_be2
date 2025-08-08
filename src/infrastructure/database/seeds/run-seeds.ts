import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { LocationSeeder } from './LocationSeeder';
import { UserSeeder } from './UserSeeder';
import { OfferSeeder } from './OfferSeeder';
import { PreferenceSeeder } from './PreferenceSeeder';
import { seedTags } from './TagSeeder';
import { AppDataSource } from '../data-source';

// Cargar variables de entorno
dotenv.config();

async function runSeeder() {
  try {
    console.log('🚀 Starting database seeding process...');
    
    // Initialize data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Run seeders in order
    console.log('1️⃣ Running location seeder...');
    await LocationSeeder.run();
    
    console.log('2️⃣ Running tag seeder...');
    await seedTags(AppDataSource);
    
    console.log('3️⃣ Running user seeder...');
    await UserSeeder.run(AppDataSource);
    
    console.log('4️⃣ Running offer seeder...');
    await OfferSeeder.run(AppDataSource);
    
    console.log('5️⃣ Running preference seeder...');
    await PreferenceSeeder.run(AppDataSource);
    
    console.log('✅ All seeds completed successfully!');
    console.log('');
    console.log('📊 Database populated with:');
    console.log('  - 🌎 Countries, provinces and cities');
    console.log('  - 🏷️ Service tags (15 categories)');
    console.log('  - 👥 Sample users (9 service providers + 1 client)');
    console.log('  - 📝 Sample offers (9 different services)');
    console.log('  - ❤️ Sample preferences (realistic voting data)');
    console.log('');
    console.log('🔑 Default credentials:');
    console.log('  Email: ana.garcia@example.com (or any other user)');
    console.log('  Password: 123456');
    console.log('');
    console.log('🎯 You can now test the preferences system at:');
    console.log('  http://localhost:3000/test-preferences');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Execute seeder
runSeeder();
