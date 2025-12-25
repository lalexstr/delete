import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const userService = new UserService();

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'Пользователь успешно зарегистрирован',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Успешная авторизация',
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await userService.getUserById(req.user!.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = await userService.updateUser(req.user!.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Профиль успешно обновлен',
    data: { user },
  });
});
