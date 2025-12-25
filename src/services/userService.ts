import bcrypt from 'bcryptjs';
import { prisma } from '../utils/database';
import { generateToken } from '../utils/jwt';
import { CustomError } from '../middleware/errorHandler';
import { CreateUserRequest, LoginRequest } from '../types';

export class UserService {
  async register(userData: CreateUserRequest) {
    const { email, password, role = 'user' } = userData;

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new CustomError('Пользователь с таким email уже существует', 409);
    }

    // Хешируем пароль
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase() as 'USER' | 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Генерируем JWT токен
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase() as 'user' | 'admin',
    });

    return {
      user: {
        ...user,
        role: user.role.toLowerCase(),
      },
      token,
    };
  }

  async login(loginData: LoginRequest) {
    const { email, password } = loginData;

    // Находим пользователя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CustomError('Неверный email или пароль', 401);
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError('Неверный email или пароль', 401);
    }

    // Генерируем JWT токен
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role.toLowerCase() as 'user' | 'admin',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new CustomError('Пользователь не найден', 404);
    }

    return {
      ...user,
      role: user.role.toLowerCase(),
    };
  }

  async updateUser(id: string, updateData: { email?: string; password?: string }) {
    const { email, password } = updateData;

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new CustomError('Пользователь не найден', 404);
    }

    // Если обновляется email, проверяем уникальность
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new CustomError('Пользователь с таким email уже существует', 409);
      }
    }

    // Подготавливаем данные для обновления
    const updatePayload: any = {};
    
    if (email) {
      updatePayload.email = email;
    }
    
    if (password) {
      const saltRounds = 12;
      updatePayload.password = await bcrypt.hash(password, saltRounds);
    }

    // Обновляем пользователя
    const user = await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      role: user.role.toLowerCase(),
    };
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => ({
      ...user,
      role: user.role.toLowerCase(),
    }));
  }
}
