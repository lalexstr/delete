export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  userId: string;
  createdAt: Date;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskQuery {
  status?: 'todo' | 'in_progress' | 'done';
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
