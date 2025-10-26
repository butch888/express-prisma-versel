const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Проверка подключения
async function checkConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Успешное подключение к БД через Prisma');
    
    // Проверяем существование таблицы
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('Время БД:', result[0].now);
    
  } catch (error) {
    console.error('❌ Ошибка подключения Prisma:', error.message);
  }
}

checkConnection();

module.exports = prisma;