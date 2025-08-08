import { DataSource } from 'typeorm';
import { UserProfileEntity } from '../entities/UserEntity';
import { UserRole } from '../../../domain/entities/UserRole';
import * as bcrypt from 'bcryptjs';

export class UserSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    console.log('🌱 Seeding users...');
    
    const userRepository = dataSource.getRepository(UserProfileEntity);

    // Verificar si ya existen usuarios
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('📝 Users already exist in the database');
      return;
    }

    // Hash para las contraseñas
    const passwordHash = await bcrypt.hash('123456', 10);

    const users = [
      {
        firstName: 'Ana',
        lastname: 'García',
        email: 'ana.garcia@example.com',
        phoneNumber: '+549112345678',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Carlos',
        lastname: 'Rodriguez',
        email: 'carlos.rodriguez@example.com',
        phoneNumber: '+549113456789',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'María',
        lastname: 'López',
        email: 'maria.lopez@example.com',
        phoneNumber: '+549114567890',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Juan',
        lastname: 'Pérez',
        email: 'juan.perez@example.com',
        phoneNumber: '+549115678901',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Laura',
        lastname: 'Martínez',
        email: 'laura.martinez@example.com',
        phoneNumber: '+549116789012',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Diego',
        lastname: 'Fernández',
        email: 'diego.fernandez@example.com',
        phoneNumber: '+549117890123',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Sofia',
        lastname: 'González',
        email: 'sofia.gonzalez@example.com',
        phoneNumber: '+549118901234',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Miguel',
        lastname: 'Vargas',
        email: 'miguel.vargas@example.com',
        phoneNumber: '+549119012345',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Carmen',
        lastname: 'Ruiz',
        email: 'carmen.ruiz@example.com',
        phoneNumber: '+549110123456',
        profilePhotoUrl: null,
        role: UserRole.OWNER,
        password: passwordHash
      },
      {
        firstName: 'Cliente',
        lastname: 'Test',
        email: 'cliente.test@example.com',
        phoneNumber: '+549111111111',
        profilePhotoUrl: null,
        role: UserRole.CLIENT,
        password: passwordHash
      }
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    console.log('✅ Sample users created successfully');
  }
}
