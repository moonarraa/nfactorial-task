# NFactorial ShopSmart Web Application

**Совместное ведение списка покупок в реальном времени**


## Краткое описание проекта
ShopSmart - это веб-приложение, которое позволяет нескольким пользователям редактировать
один список покупок одновременно, по уникальной ссылке. Все изменения синхронизируются
с использованием WebSocket.

Демо доступно по ссылке: https://youtu.be/wGCsTa3h3Eg

---

### Prerequisites
* Node.js (LTS 16.x или новее)
* npm (Скачивается вместе с Node.js)
---

### Локальный запуск

1. **Клонировать репозиторий**
    ```bash
    git clone https://github.com/moonarraa/nfactorial-task
   ```
2. **Backend настройка**
    ```bash
    cd backend
    npm install
    # Создание схемы БД
    npm prisma db push
    # Скачивание примера .env
    cp .env.example .env
    # Запуск сервера
    npm run dev
    ```
    Доступ к бэкенд серверу по адресу:
    ```sh
    http://localhost:4000
    ```
4. **Frontend настройка**
   ```js
   cd frontend
   npm install
   # Создайте файл .env.local и укажите URL backend-a
   VITE_API_BASE=http://localhost:4000
   ```
      Приложение можно теперь открыть по адресу:
   ```sh
   http://localhost:5173
   ```

---

## Деплой

- **Frontend (Vercel):**
  https://nfactorial-task.vercel.app/
- **Backend (Render):**
  https://nfactorial-task.onrender.com

---

## Описание процесса проектирования и разработки

1. ### Планирование
    Методология спринтов для распределения задач по дням. Три основных
    этапа: UI, API, деплой.

2. ### Архитектура веб-приложения
    Были выбраны REST API (Express) и WebSocket с помощью Socket.IO для 
    синхронного обновления информации.

3. ### База даных (БД)
    Для простого и быстрого старта, были использованы Prisma ORM с SQLite.


4. ### Frontend
    React вместе с Vite позволили сделать быструю настройку.

5. ### Testing
    Проведена ручная проверка live-обновлений (CRUD-операции).

---

## Уникальные подходы и методологии
1. ### Секретная ссылка
    Вместо полноценной аутентификации, было решено генерировать уникальную
    секретную ссылку (UUID)

2. ### Prisma
    Автогенерация клиента, типобезопасный клиент

2. ### Простая архитектура
    Папки frontend и backend обеспечивают простое понимание кода при помощи 
    mono-repo подхода

---

## Обсуждение компромиссов


| Вопрос        | Решение                         | Причина выбора                              |
|---------------|---------------------------------|----------------------------------------------|
| База данных   | SQLite (файл `dev.db`)          | Простота настройки, отсутствие сервера БД    |
| Аутентификация| Доступ по ссылке (без логина)   | Упрощает MVP, фокус на функциональности      |
| Стилизация    | Inline-стили + минимальный CSS  | Быстрый прототип, минимум настроек           |
| Деплой        | Render + Vercel                 | Быстрый деплой, бесплатный тариф      

---
## Описание известных ошибок или проблем

- Оффлайн-режим не поддерживается, при отсутствии сети информация о списке не сохраняется
- Дубликация товаров: одинаковые названия для товаров не запрещены
- Автоудаление старых списков не реализовано
- Cold Start из-за отсутсвия сбора достаточной информации

---

## Объяснение выбора технического стэка
- **React + Vite**: быстрый запуск, HMR. 
- **Prisma ORM + SQLite**: автогенерация клиента, легкая интеграция
- **Socket IO**: Удобная работа с WebSocket, балансирование нагрузки
- **Node.js + Express**: простота Rest API в комбинации с единым языком для фронта и бэкенда
- **Vercel + Render**: бесплатные хостинги для деплоя

---

## Контакты

Tussupbekova Munara - munaratuss@yahoo.com

Ссылка на проект: [https://github.com/moonarraa/nfactorial-task](https://github.com/moonarraa/nfactorial-task)

---

