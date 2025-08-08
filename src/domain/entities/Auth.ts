export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: string;
  addressId?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastname: string;
    email: string;
    role: string;
    profilePhotoUrl: string | null;
  };
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
