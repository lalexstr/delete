import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './utils/config';
import { connectDatabase, disconnectDatabase } from './utils/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());

app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      message: 'Слишком много запросов с вашего IP, попробуйте позже',
    },
  },
});
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management System API работает!',
    version: '1.0.0',
  });
});
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      console.log(`🚀 Сервер запущен на порту ${config.port}`);
      console.log(`🌍 Окружение: ${config.nodeEnv}`);
      console.log(`📝 API доступно по адресу: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};
process.on('SIGTERM', async () => {
  console.log('🛑 Получен сигнал SIGTERM, завершение работы...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Получен сигнал SIGINT, завершение работы...');
  await disconnectDatabase();
  process.exit(0);
});

startServer();
