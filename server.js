// ДОЛЖНО БЫТЬ ПЕРВОЙ СТРОЧКОЙ!
require('dotenv').config();

const express = require('express');
const prisma = require('./database/config');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка CORS
app.use(cors({
  origin: [
    'https://react-vercel-opal.vercel.app',
    'http://localhost:5173', // для разработки
    'http://localhost:3000'  // на всякий случай
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

// Роут для получения всех пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Роут для добавления одного пользователя
app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const newUser = await prisma.users.create({
      data: {
        username,
        password
      }
    });
    
    res.json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Роут для удаления всех пользоватей
app.delete('/users', async (req, res) => {
  try {
    await prisma.users.deleteMany();

    res.json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

// Экспорт для Vercel
module.exports = app;

// Локальный запуск
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}