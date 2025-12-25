import { prisma } from '../utils/database';
import { CustomError } from '../middleware/errorHandler';
import { CreateTaskRequest, UpdateTaskRequest, TaskFilters } from '../types';

export class TaskService {
  async createTask(userId: string, taskData: CreateTaskRequest) {
    const { title, description, status = 'TODO' } = taskData;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status.toUpperCase() as 'TODO' | 'IN_PROGRESS' | 'DONE',
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    };
  }

  async getUserTasks(userId: string, filters: TaskFilters) {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    
    // Построение условий фильтрации
    const where: any = { userId };
    
    if (status) {
      where.status = status.toUpperCase();
    }

    // Построение условий сортировки
    const orderBy: any = {};
    if (sortBy === 'createdAt' || sortBy === 'title') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc'; // По умолчанию
    }

    // Получение задач с пагинацией
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Форматирование результата
    const formattedTasks = tasks.map(task => ({
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    }));

    return {
      tasks: formattedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getAllTasks(filters: TaskFilters) {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    
    // Построение условий фильтрации
    const where: any = {};
    
    if (status) {
      where.status = status.toUpperCase();
    }

    // Построение условий сортировки
    const orderBy: any = {};
    if (sortBy === 'createdAt' || sortBy === 'title') {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = 'desc'; // По умолчанию
    }

    // Получение задач с пагинацией
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.task.count({ where }),
    ]);

    // Форматирование результата
    const formattedTasks = tasks.map(task => ({
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    }));

    return {
      tasks: formattedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new CustomError('Задача не найдена', 404);
    }

    return {
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    };
  }

  async updateTask(taskId: string, userId: string, updateData: UpdateTaskRequest) {
    // Проверяем, существует ли задача и принадлежит ли она пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new CustomError('Задача не найдена', 404);
    }

    // Подготавливаем данные для обновления
    const updatePayload: any = {};
    
    if (updateData.title !== undefined) {
      updatePayload.title = updateData.title;
    }
    
    if (updateData.description !== undefined) {
      updatePayload.description = updateData.description;
    }
    
    if (updateData.status !== undefined) {
      updatePayload.status = updateData.status.toUpperCase();
    }

    // Обновляем задачу
    const task = await prisma.task.update({
      where: { id: taskId },
      data: updatePayload,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    };
  }

  async deleteTask(taskId: string, userId: string) {
    // Проверяем, существует ли задача и принадлежит ли она пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });

    if (!existingTask) {
      throw new CustomError('Задача не найдена', 404);
    }

    // Удаляем задачу
    await prisma.task.delete({
      where: { id: taskId },
    });

    return true;
  }

  // Админская функция для получения задачи по ID (любого пользователя)
  async getTaskByIdAdmin(taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!task) {
      throw new CustomError('Задача не найдена', 404);
    }

    return {
      ...task,
      status: task.status.toLowerCase(),
      user: {
        ...task.user,
        role: task.user.role.toLowerCase(),
      },
    };
  }
}


