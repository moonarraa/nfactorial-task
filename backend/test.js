const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const list = await prisma.shoppingList.create({ data: { name: 'Тестовый список' } });
  console.log('Список:', list);
  await prisma.$disconnect();
}

main();
