import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

const userService = new UserService();

export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    success: true,
    data: { users },
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});
