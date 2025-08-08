import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/services/JwtService';

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
      };
    }
  }
}

export class AuthMiddleware {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Debug log for Railway deployment
      console.log(`[AUTH DEBUG] ${req.method} ${req.path} - Headers:`, req.headers.authorization ? 'Token present' : 'No token');
      
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Access token required' });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const payload = this.jwtService.verifyToken(token);

      if (!payload) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }

      // Agregar información del usuario al request
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Middleware opcional para verificar roles específicos
  authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      next();
    };
  };
}
