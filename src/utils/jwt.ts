import jwt from 'jsonwebtoken';
import { config } from './config';

export interface JwtPayload {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    throw new Error('Недействительный токен');
  }
};
