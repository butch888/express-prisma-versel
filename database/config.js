// database/config.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Проверка подключения (только для разработки)
if (process.env.NODE_ENV !== 'production') {
  async function checkConnection() {
    try {
      await prisma.$connect();
      console.log('✅ Успешное подключение к БД через Prisma');
      
      const result = await prisma.$queryRaw`SELECT NOW()`;
      console.log('Время БД:', result[0].now);
      
    } catch (error) {
      console.error('❌ Ошибка подключения Prisma:', error.message);
    }
  }
  checkConnection();
}

module.exports = prisma;