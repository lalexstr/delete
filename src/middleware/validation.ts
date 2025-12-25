import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CustomError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new CustomError(errorMessage, 400));
    }

    req[property] = value;
    next();
  };
};

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Некорректный формат email',
    'any.required': 'Email обязателен',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Пароль должен содержать минимум 6 символов',
    'any.required': 'Пароль обязателен',
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Некорректный формат email',
    'any.required': 'Email обязателен',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Пароль обязателен',
  }),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Некорректный формат email',
  }),
  password: Joi.string().min(6).messages({
    'string.min': 'Пароль должен содержать минимум 6 символов',
  }),
}).min(1);

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Заголовок не может быть пустым',
    'string.min': 'Заголовок не может быть пустым',
    'string.max': 'Заголовок не может превышать 200 символов',
    'any.required': 'Заголовок обязателен',
  }),
  description: Joi.string().trim().max(1000).required().messages({
    'string.max': 'Описание не может превышать 1000 символов',
    'any.required': 'Описание обязательно',
  }),
  status: Joi.string().valid('todo', 'in_progress', 'done').default('todo'),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).messages({
    'string.empty': 'Заголовок не может быть пустым',
    'string.min': 'Заголовок не может быть пустым',
    'string.max': 'Заголовок не может превышать 200 символов',
  }),
  description: Joi.string().trim().max(1000).messages({
    'string.max': 'Описание не может превышать 1000 символов',
  }),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
}).min(1);

export const taskQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  sortBy: Joi.string().valid('createdAt', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const validateRegister = validate(registerSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateUser = validate(updateUserSchema);
export const validateCreateTask = validate(createTaskSchema);
export const validateUpdateTask = validate(updateTaskSchema);
export const validateTaskQuery = validate(taskQuerySchema, 'query');
