import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Токен доступа не предоставлен', 401);
    }

    const token = authHeader.substring(7); // Убираем "Bearer "
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    next(new CustomError('Недействительный токен доступа', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Пользователь не аутентифицирован', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Недостаточно прав доступа', 403));
    }

    next();
  };
};
