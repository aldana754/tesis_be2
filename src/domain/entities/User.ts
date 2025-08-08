import { UserRole } from './UserRole';

export class UserProfile {
  constructor(
    public readonly id: number,
    public readonly role: UserRole,
    public readonly firstName: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly phoneNumber: string,
    public readonly profilePhotoUrl: string | null,
    public readonly addressId: number | null,
    public readonly offers: string[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    firstName: string,
    lastname: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: UserRole = UserRole.CLIENT,
    addressId: number | null = null,
    offers: string[] = [],
    profilePhotoUrl: string | null = null
  ): UserProfile {
    const now = new Date();
    return new UserProfile(
      0, // El ID será generado automáticamente por la base de datos
      role,
      firstName,
      lastname,
      email,
      password,
      phoneNumber,
      profilePhotoUrl,
      addressId,
      offers,
      now,
      now
    );
  }
}
