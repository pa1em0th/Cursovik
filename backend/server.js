const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Для парсинга JSON
app.use(express.static(path.join(__dirname, '../frontend'))); // Для статических файлов

// Маршрут для регистрации
app.post('/register', async (req, res) => {
    try {
        console.log('Полученные данные:', req.body); // Логируем тело запроса

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

        try {
            if (fs.existsSync(usersFilePath)) {
                const rawData = fs.readFileSync(usersFilePath, 'utf-8');
                users = JSON.parse(rawData) || [];
            }
        } catch (error) {
            console.error('Ошибка при чтении файла users.json:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }

        // Проверяем, существует ли пользователь с таким email
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // Хешируем пароль
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Хешированный пароль:', hashedPassword);

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
            try {
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
                console.log('Пользователь успешно зарегистрирован:', newUser);
                return res.status(201).json({ message: 'Регистрация успешна' });
            } catch (error) {
                console.error('Ошибка при записи в файл users.json:', error);
                return res.status(500).json({ message: 'Ошибка сервера' });
            }
        } catch (error) {
            console.error('Ошибка при хешировании пароля:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
    } catch (error) {
        console.error('Общая ошибка при регистрации:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для входа
app.post('/login', async (req, res) => {
    try {
        console.log('Полученные данные:', req.body); // Логируем тело запроса

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

        try {
            if (fs.existsSync(usersFilePath)) {
                const rawData = fs.readFileSync(usersFilePath, 'utf-8');
                users = JSON.parse(rawData) || [];
            }
        } catch (error) {
            console.error('Ошибка при чтении файла users.json:', error);
            return res.status(500).json({ message: 'Ошибка сервера' });
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

        // Генерируем JWT токен (простой пример)
        const token = 'your_jwt_token'; // В production используйте jsonwebtoken

        // Отправляем успешный ответ с токеном
        return res.status(200).json({ message: 'Вход выполнен успешно', token });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});
// Маршрут для получения данных пользователя
app.get('/api/user', (req, res) => {
    try {
        // Имитация проверки токена (замените на реальную логику в production)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || token !== 'your_jwt_token') {
            return res.status(401).json({ message: 'Неавторизованный доступ' });
        }

        // Загружаем пользователей из файла users.json
        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        // Возвращаем первого пользователя (для тестов)
        const user = users[0]; // В production используйте ID или другой механизм аутентификации
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Отправляем данные пользователя без пароля
        const { password, ...userData } = user;
        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});
// Маршрут для получения бронирований пользователя
app.get('/api/bookings', (req, res) => {
    try {
        // Имитация проверки токена (замените на реальную логику в production)
        const token = req.headers.authorization?.split(' ')[1];
        if (!token || token !== 'your_jwt_token') {
            return res.status(401).json({ message: 'Неавторизованный доступ' });
        }

        // Загружаем бронирования из файла bookings.json
        const bookingsFilePath = path.join(__dirname, '../data', 'bookings.json');
        let bookings = [];

        if (fs.existsSync(bookingsFilePath)) {
            const rawData = fs.readFileSync(bookingsFilePath, 'utf-8');
            bookings = JSON.parse(rawData) || [];
        }

        // Возвращаем все бронирования (для тестов)
        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});