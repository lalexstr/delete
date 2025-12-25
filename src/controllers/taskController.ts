import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const taskService = new TaskService();

export const createTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const task = await taskService.createTask(req.user!.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Задача успешно создана',
    data: { task },
  });
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { page, limit, status, sortBy, sortOrder } = req.query;
  
  const result = await taskService.getUserTasks(req.user!.id, {
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 10,
    status: status as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getTaskById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const task = await taskService.getTaskById(req.params.id, req.user!.id);

  res.status(200).json({
    success: true,
    data: { task },
  });
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const task = await taskService.updateTask(req.params.id, req.user!.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Задача успешно обновлена',
    data: { task },
  });
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  await taskService.deleteTask(req.params.id, req.user!.id);

  res.status(200).json({
    success: true,
    message: 'Задача успешно удалена',
  });
});

// Админские функции
export const getAllTasks = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { page, limit, status, sortBy, sortOrder } = req.query;
  
  const result = await taskService.getAllTasks({
    page: page ? parseInt(page as string) : 1,
    limit: limit ? parseInt(limit as string) : 10,
    status: status as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
