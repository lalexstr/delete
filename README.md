# Task Management System

Серверное приложение для управления задачами с REST API.

## Технологии

- **Платформа**: Node.js
- **Язык**: TypeScript
- **Фреймворк**: Express.js
- **База данных**: PostgreSQL
- **ORM**: Prisma
- **Аутентификация**: JWT
- **Валидация**: Joi

## Структура проекта

```
src/
├── controllers/     # Контроллеры для обработки HTTP запросов
├── middleware/      # Middleware для аутентификации, валидации и обработки ошибок
├── routes/          # Определение маршрутов API
├── services/        # Бизнес-логика приложения
├── types/           # TypeScript типы и интерфейсы
├── utils/           # Утилиты (конфигурация, база данных, JWT)
└── server.ts        # Главный файл сервера
```

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 3. Настройка базы данных
```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:migrate
```

### 4. Запуск приложения
```bash
# Режим разработки
npm run dev

# Продакшн
npm run build
npm start
```

## API Документация

### Аутентификация

#### Регистрация пользователя
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Вход в систему
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Получение профиля
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Обновление профиля
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

### Управление задачами

#### Создание задачи
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Название задачи",
  "description": "Описание задачи",
  "status": "todo"
}
```

#### Получение списка задач
```http
GET /api/tasks?page=1&limit=10&status=todo&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### Получение задачи по ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Обновление задачи
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Обновленное название",
  "description": "Обновленное описание",
  "status": "in_progress"
}
```

#### Удаление задачи
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

### Управление пользователями (только для администраторов)

#### Получение всех пользователей
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Получение пользователя по ID
```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Получение всех задач (админ)
```http
GET /api/tasks/admin/all?page=1&limit=10&status=todo
Authorization: Bearer <admin_token>
```

## Модели данных

### User
```typescript
{
  id: string
  email: string
  password: string (зашифрован)
  role: 'user' | 'admin'
  createdAt: Date
}
```

### Task
```typescript
{
  id: string
  title: string
  description: string
  status: 'todo' | 'in_progress' | 'done'
  userId: string
  createdAt: Date
}
```

## Статусы задач

- `todo` - К выполнению
- `in_progress` - В процессе
- `done` - Выполнено

## Роли пользователей

- `user` - Обычный пользователь (может работать только со своими задачами)
- `admin` - Администратор (имеет доступ ко всем данным)

## Валидация

- Email должен быть корректным
- Пароль минимум 6 символов
- Заголовок задачи: 1-200 символов
- Описание задачи: максимум 1000 символов

## Пагинация и фильтрация

- `page` - номер страницы (по умолчанию: 1)
- `limit` - количество элементов на странице (по умолчанию: 10, максимум: 100)
- `status` - фильтр по статусу задачи
- `sortBy` - поле для сортировки (createdAt, title)
- `sortOrder` - порядок сортировки (asc, desc)

## Обработка ошибок

Все ошибки возвращаются в формате:
```json
{
  "success": false,
  "error": {
    "message": "Описание ошибки"
  }
}
```

## Безопасность

- Пароли хешируются с использованием bcrypt
- JWT токены для аутентификации
- Rate limiting (100 запросов в 15 минут)
- CORS настроен
- Helmet для базовой безопасности
- Валидация всех входящих данных

## Переменные окружения

```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```
