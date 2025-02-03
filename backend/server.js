const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Для парсинга JSON
app.use(express.static(path.join(__dirname, '../frontend'))); // Для статических файлов

// Хранение текущих сессий пользователей (в памяти)
const sessions = {};

// Генерация уникального идентификатора сессии
const generateSessionId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Middleware для проверки аутентификации
const authenticateUser = (req, res, next) => {
    const sessionId = req.headers.authorization;
    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).json({ message: 'Неавторизованный доступ' });
    }
    req.user = sessions[sessionId];
    next();
};

// Маршрут для регистрации
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверяем, что все поля заполнены
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        // Проверяем формат email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Некорректный email' });
        }

        // Загружаем существующих пользователей из файла users.json
        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        // Проверяем, существует ли пользователь с таким email
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем нового пользователя
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
        };

        // Добавляем пользователя в массив
        users.push(newUser);

        // Сохраняем обновленный список пользователей в файл
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
        return res.status(201).json({ message: 'Регистрация успешна' });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для входа
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем, что все поля заполнены
        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        // Проверяем формат email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Некорректный email' });
        }

        // Загружаем существующих пользователей из файла users.json
        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        // Ищем пользователя по email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Сравниваем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        // Создаем сессию для пользователя
        const sessionId = generateSessionId();
        sessions[sessionId] = { id: user.id, email: user.email, name: user.name };

        // Отправляем успешный ответ с идентификатором сессии
        return res.status(200).json({ message: 'Вход выполнен успешно', sessionId });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    const sessionId = req.headers.authorization;
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId]; // Удаляем сессию
        return res.status(200).json({ message: 'Выход выполнен успешно' });
    }
    return res.status(400).json({ message: 'Сессия не найдена' });
});

// Маршрут для получения данных пользователя
app.get('/api/user', authenticateUser, (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});