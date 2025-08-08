import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { LoginRequest, RegisterRequest } from '../../domain/entities/Auth';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;

      if (!loginData.email || !loginData.password) {
        res.status(400).json({ 
          error: 'El email y la contraseña son requeridos' 
        });
        return;
      }

      const result = await this.authService.login(loginData);

      if (!result) {
        res.status(401).json({ 
          error: 'Credenciales inválidas' 
        });
        return;
      }

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        data: result
      });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterRequest = req.body;

      // Verificar que todos los campos requeridos estén presentes
      if (!registerData.email || !registerData.password || !registerData.firstName || !registerData.lastname) {
        res.status(400).json({ 
          error: 'Email, contraseña, nombre y apellido son requeridos' 
        });
        return;
      }

      // Validar formato del email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        res.status(400).json({ 
          error: 'Formato de email inválido' 
        });
        return;
      }

      // Validar longitud mínima de la contraseña
      if (registerData.password.length < 6) {
        res.status(400).json({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
        return;
      }

      const result = await this.authService.register(registerData);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error: any) {
      console.error('Error en el registro:', error);
      
      if (error.message === 'User already exists with this email') {
        res.status(409).json({ 
          error: 'Ya existe un usuario con este email' 
        });
        return;
      }

      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({ 
          error: 'Token no proporcionado' 
        });
        return;
      }

      const result = await this.authService.validateToken(token);

      if (!result) {
        res.status(401).json({ 
          error: 'Token inválido o expirado' 
        });
        return;
      }

      res.status(200).json({
        message: 'Token válido',
        data: result
      });
    } catch (error) {
      console.error('Error en la validación del token:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor' 
      });
    }
  }
}
