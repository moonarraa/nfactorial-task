require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
const { Server } = require('socket.io');

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

/*
    Подключение к Socket.IO
*/
io.on('connection', socket => {
  socket.on('join', listId => socket.join(listId));
});


/*
    Создание нового списка
*/
app.post('/lists', async (req, res) => {
  const list = await prisma.shoppingList.create({});
  res.json(list);
});


/*
     Получение нового списка по UUID вместе с его элементами
*/
app.get('/lists/:id', async (req, res) => {
  const { id } = req.params;
  const list = await prisma.shoppingList.findUnique({
    where: { id },
    include: { items: true }
  });
  if (!list) return res.status(404).json({ error: 'List not found' });
  res.json(list);
});


/*
    Добавление товара в список
*/
app.post('/lists/:id/items', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Item text cannot be empty' });
  }
  const item = await prisma.item.create({
    data: { text, listId: id }
  });
  io.to(id).emit('itemAdded', item);
  res.json(item);
});


/*
    Изменение флага bought (куплено)
*/
app.patch('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { bought } = req.body;
  const item = await prisma.item.update({
    where: { id },
    data: { bought }
  });
  io.to(item.listId).emit('itemUpdated', item);
  res.json(item);
});


/*
    Удаление товара
*/
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const item = await prisma.item.delete({ where: { id } });
  io.to(item.listId).emit('itemDeleted', { id });
  res.json({ id });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
