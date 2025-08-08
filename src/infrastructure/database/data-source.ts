import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

// Railway and production support
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Railway provides a DATABASE_URL or individual components
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'clean_architecture_db',
  synchronize: !isProduction, // Never sync in production
  logging: !isProduction,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Required for Railway PostgreSQL
  entities: isProduction 
    ? ['dist/infrastructure/database/entities/**/*.js']
    : ['src/infrastructure/database/entities/**/*.ts'],
  migrations: isProduction 
    ? ['dist/infrastructure/database/migrations/**/*.js']
    : ['src/infrastructure/database/migrations/**/*.ts'],
  subscribers: isProduction 
    ? ['dist/infrastructure/database/subscribers/**/*.js']
    : ['src/infrastructure/database/subscribers/**/*.ts'],
  // Connection timeout and retry options for Railway
  connectTimeoutMS: 60000,
  extra: {
    max: 10, // Maximum number of connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 60000,
  }
});

// Add debug logging for Railway
if (isProduction) {
  console.log('[DB] Production database configuration:');
  console.log('[DB] Using DATABASE_URL:', !!process.env.DATABASE_URL);
  console.log('[DB] Host:', process.env.DATABASE_HOST || 'from DATABASE_URL');
  console.log('[DB] Port:', process.env.DATABASE_PORT || 'from DATABASE_URL');
  console.log('[DB] Database:', process.env.DATABASE_NAME || 'from DATABASE_URL');
  console.log('[DB] SSL enabled:', !!isProduction);
}
