import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/task_management',
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
};

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Отсутствует переменная окружения: ${envVar}`);
    if (config.nodeEnv === 'production') {
      throw new Error(`Отсутствует обязательная переменная окружения: ${envVar}`);
    }
  }
}
