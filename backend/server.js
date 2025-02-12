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
let sessions = {};

// Очистка всех сессий при старте сервера
console.log('Очистка всех сессий при старте сервера...');
sessions = {};

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

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Некорректный email' });
        }

        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
        };

        users.push(newUser);
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

        if (!email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Некорректный email' });
        }

        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }

        const sessionId = generateSessionId();
        sessions[sessionId] = { id: user.id, email: user.email, name: user.name };

        return res.status(200).json({ message: 'Вход выполнен успешно', sessionId });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    const sessionId = req.headers.authorization;
    console.log('Logout Session ID:', sessionId);

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        console.log('Session deleted successfully.');
        return res.status(200).json({ message: 'Выход выполнен успешно' });
    } else {
        console.log('Session not found.');
        return res.status(400).json({ message: 'Сессия не найдена' });
    }
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

// Маршрут для бронирования отеля
app.post('/api/bookings', authenticateUser, (req, res) => {
    try {
        const { hotelId, checkInDate, checkOutDate } = req.body;
        const userId = req.user.id;

        const bookingsFilePath = path.join(__dirname, '../data', 'bookings.json');
        let bookings = [];

        if (fs.existsSync(bookingsFilePath)) {
            const rawData = fs.readFileSync(bookingsFilePath, 'utf-8');
            bookings = JSON.parse(rawData) || [];
        }

        const existingBooking = bookings.find(booking => booking.userId === userId && booking.hotelId === hotelId);
        if (existingBooking) {
            return res.status(400).json({ message: 'Отель уже забронирован' });
        }

        const newBooking = {
            id: bookings.length + 1,
            userId,
            hotelId,
            checkInDate,
            checkOutDate,
        };

        bookings.push(newBooking);
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');

        return res.status(201).json({ message: 'Бронирование успешно' });
    } catch (error) {
        console.error('Ошибка при бронировании:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка бронирований пользователя
app.get('/api/bookings', authenticateUser, (req, res) => {
    try {
        const userId = req.user.id;

        const bookingsFilePath = path.join(__dirname, '../data', 'bookings.json');
        let bookings = [];

        if (fs.existsSync(bookingsFilePath)) {
            const rawData = fs.readFileSync(bookingsFilePath, 'utf-8');
            bookings = JSON.parse(rawData) || [];
        }

        const userBookings = bookings.filter(booking => booking.userId === userId);

        const hotelsFilePath = path.join(__dirname, '../data', 'hotels.json');
        let hotels = [];

        if (fs.existsSync(hotelsFilePath)) {
            const rawData = fs.readFileSync(hotelsFilePath, 'utf-8');
            hotels = JSON.parse(rawData) || [];
        }

        const bookingsWithHotelInfo = userBookings.map(booking => {
            const hotel = hotels.find(h => h.id === booking.hotelId);
            return {
                ...booking,
                hotelName: hotel ? hotel.name : 'Неизвестный отель',
                hotelLocation: hotel ? hotel.location : 'Неизвестная локация',
                hotelPricePerNight: hotel ? hotel.pricePerNight : 'Неизвестная цена',
            };
        });

        return res.status(200).json(bookingsWithHotelInfo);
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для отмены бронирования
app.delete('/api/bookings/:bookingId', authenticateUser, (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId, 10);
        const userId = req.user.id;

        const bookingsFilePath = path.join(__dirname, '../data', 'bookings.json');
        let bookings = [];

        if (fs.existsSync(bookingsFilePath)) {
            const rawData = fs.readFileSync(bookingsFilePath, 'utf-8');
            bookings = JSON.parse(rawData) || [];
        }

        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId && booking.userId === userId);
        if (bookingIndex === -1) {
            return res.status(404).json({ message: 'Бронирование не найдено' });
        }

        bookings.splice(bookingIndex, 1);
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');

        return res.status(200).json({ message: 'Бронирование успешно отменено' });
    } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для страницы "Полезные статьи"
app.get('/articles', authenticateUser, (req, res) => {
    try {
        // Отправляем HTML-страницу
        res.sendFile(path.join(__dirname, '../frontend/articles.html'));
    } catch (error) {
        console.error('Ошибка при загрузке страницы статей:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
