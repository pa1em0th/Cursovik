const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const db = require('./db'); // Импортируем подключение к базе данных
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

// Генерация уникального номера бронирования
const generateBookingNumber = () => {
    return 'BN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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

// Middleware для проверки роли администратора
const authenticateAdmin = (req, res, next) => {
    const sessionId = req.headers.authorization;
    console.log('Session ID:', sessionId); // Логирование для отладки

    // Проверяем, является ли sessionId административным
    if (sessionId === 'admin_session_id' || (sessions[sessionId] && sessions[sessionId].email === 'admin@admin.com')) {
        next();
    } else {
        console.log('Доступ запрещен: неверный sessionId или не администратор'); // Логирование для отладки
        return res.status(403).json({ message: 'Доступ запрещен' });
    }
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

        // Сохранение в базу данных
        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [newUser.name, newUser.email, newUser.password]
        );

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
    console.log('Session ID:', sessionId); // Логирование для отладки

    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId];
        console.log('Сессия удалена:', sessionId); // Логирование для отладки
        return res.status(200).json({ message: 'Выход выполнен успешно' });
    } else {
        console.log('Сессия не найдена или недействительна'); // Логирование для отладки
        return res.status(400).json({ message: 'Сессия не найдена' });
    }
});

// Маршрут для получения списка отелей
app.get('/api/hotels', async (req, res) => {
    try {
        const [hotels] = await db.query('SELECT * FROM hotels');
        return res.status(200).json(hotels);
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
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
app.post('/api/bookings', authenticateUser, async (req, res) => {
    try {
        const { hotelId, checkInDate, checkOutDate, roomNumber } = req.body;
        const userId = req.user.id;

        if (!roomNumber || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: 'Номер комнаты и даты обязательны' });
        }

        const bookingsFilePath = path.join(__dirname, '../data', 'bookings.json');
        let bookings = [];

        if (fs.existsSync(bookingsFilePath)) {
            const rawData = fs.readFileSync(bookingsFilePath, 'utf-8');
            bookings = JSON.parse(rawData) || [];
        }

        const isRoomAvailable = bookings.every(booking => {
            if (booking.hotelId === hotelId && booking.roomNumber === roomNumber) {
                const existingCheckIn = new Date(booking.checkInDate);
                const existingCheckOut = new Date(booking.checkOutDate);
                const newCheckIn = new Date(checkInDate);
                const newCheckOut = new Date(checkOutDate);

                return (
                    newCheckOut <= existingCheckIn ||
                    newCheckIn >= existingCheckOut
                );
            }
            return true;
        });

        if (!isRoomAvailable) {
            return res.status(400).json({ message: 'Комната уже забронирована на выбранные даты' });
        }

        const newBooking = {
            id: bookings.length + 1,
            userId,
            hotelId,
            checkInDate,
            checkOutDate,
            roomNumber,
            bookingNumber: generateBookingNumber(),
        };

        bookings.push(newBooking);
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2), 'utf-8');

        // Сохранение в базу данных
        await db.query(
            'INSERT INTO bookings (userId, hotelId, checkInDate, checkOutDate, roomNumber, bookingNumber) VALUES (?, ?, ?, ?, ?, ?)',
            [newBooking.userId, newBooking.hotelId, newBooking.checkInDate, newBooking.checkOutDate, newBooking.roomNumber, newBooking.bookingNumber]
        );

        return res.status(201).json({ message: 'Бронирование успешно', bookingNumber: newBooking.bookingNumber });
    } catch (error) {
        console.error('Ошибка при бронировании:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка бронирований пользователя
app.get('/api/bookings', authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;

        const [bookings] = await db.query('SELECT * FROM bookings WHERE userId = ?', [userId]);

        const [hotels] = await db.query('SELECT * FROM hotels');

        const bookingsWithHotelInfo = bookings.map(booking => {
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
app.delete('/api/bookings/:bookingId', authenticateUser, async (req, res) => {
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

        // Удаление из базы данных
        await db.query('DELETE FROM bookings WHERE id = ?', [bookingId]);

        return res.status(200).json({ message: 'Бронирование успешно отменено' });
    } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения отзывов об отеле
app.get('/api/reviews/:hotelId', async (req, res) => {
    try {
        const hotelId = parseInt(req.params.hotelId, 10);

        const [reviews] = await db.query('SELECT * FROM reviews WHERE hotelId = ?', [hotelId]);

        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для добавления отзыва об отеле
app.post('/api/reviews', authenticateUser, async (req, res) => {
    try {
        const { hotelId, rating, comment } = req.body;
        const userId = req.user.id;

        const reviewsFilePath = path.join(__dirname, '../data', 'reviews.json');
        let reviews = [];

        if (fs.existsSync(reviewsFilePath)) {
            const rawData = fs.readFileSync(reviewsFilePath, 'utf-8');
            reviews = JSON.parse(rawData) || [];
        }

        const newReview = {
            id: reviews.length + 1,
            userId,
            hotelId,
            rating,
            comment,
            timestamp: new Date().toISOString(),
        };

        reviews.push(newReview);
        fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf-8');

        // Сохранение в базу данных
        await db.query(
            'INSERT INTO reviews (userId, hotelId, rating, comment) VALUES (?, ?, ?, ?)',
            [newReview.userId, newReview.hotelId, newReview.rating, newReview.comment]
        );

        return res.status(201).json({ message: 'Отзыв успешно добавлен' });
    } catch (error) {
        console.error('Ошибка при добавлении отзыва:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для страницы "Полезные статьи"
app.get('/articles', authenticateUser, (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../frontend/articles.html'));
    } catch (error) {
        console.error('Ошибка при загрузке страницы статей:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для добавления отеля (администратор)
app.post('/admin/addHotel', authenticateAdmin, async (req, res) => {
    try {
        const { hotelName, location, pricePerNight } = req.body;

        if (!hotelName || !location || pricePerNight == null) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const hotelsFilePath = path.join(__dirname, '../data', 'hotels.json');
        let hotels = [];

        if (fs.existsSync(hotelsFilePath)) {
            const rawData = fs.readFileSync(hotelsFilePath, 'utf-8');
            hotels = JSON.parse(rawData) || [];
        }

        const newHotel = {
            id: hotels.length + 1,
            name: hotelName,
            location,
            pricePerNight,
        };

        hotels.push(newHotel);
        fs.writeFileSync(hotelsFilePath, JSON.stringify(hotels, null, 2), 'utf-8');

        // Сохранение в базу данных
        await db.query(
            'INSERT INTO hotels (name, location, pricePerNight) VALUES (?, ?, ?)',
            [newHotel.name, newHotel.location, newHotel.pricePerNight]
        );

        return res.status(201).json({ message: 'Отель успешно добавлен' });
    } catch (error) {
        console.error('Ошибка при добавлении отеля:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка отелей (для администратора)
app.get('/admin/hotels', authenticateAdmin, async (req, res) => {
    try {
        const [hotels] = await db.query('SELECT * FROM hotels');
        return res.status(200).json(hotels);
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для удаления отеля
app.delete('/admin/deleteHotel/:hotelId', authenticateAdmin, async (req, res) => {
    try {
        const hotelId = parseInt(req.params.hotelId, 10);

        const hotelsFilePath = path.join(__dirname, '../data', 'hotels.json');
        let hotels = [];

        if (fs.existsSync(hotelsFilePath)) {
            const rawData = fs.readFileSync(hotelsFilePath, 'utf-8');
            hotels = JSON.parse(rawData) || [];
        }

        const hotelIndex = hotels.findIndex(hotel => hotel.id === hotelId);
        if (hotelIndex === -1) {
            return res.status(404).json({ message: 'Отель не найден' });
        }

        hotels.splice(hotelIndex, 1);
        fs.writeFileSync(hotelsFilePath, JSON.stringify(hotels, null, 2), 'utf-8');

        // Удаление из базы данных
        await db.query('DELETE FROM hotels WHERE id = ?', [hotelId]);

        return res.status(200).json({ message: 'Отель успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении отеля:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка пользователей (для администратора)
app.get('/admin/users', authenticateAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users');
        return res.status(200).json(users);
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для удаления пользователя
app.delete('/admin/deleteUser/:userId', authenticateAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        const usersFilePath = path.join(__dirname, '../data', 'users.json');
        let users = [];

        if (fs.existsSync(usersFilePath)) {
            const rawData = fs.readFileSync(usersFilePath, 'utf-8');
            users = JSON.parse(rawData) || [];
        }

        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        users.splice(userIndex, 1);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

        // Удаление из базы данных
        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        return res.status(200).json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка отзывов (для администратора)
app.get('/admin/reviews', authenticateAdmin, async (req, res) => {
    try {
        const [reviews] = await db.query('SELECT * FROM reviews');
        return res.status(200).json(reviews);
    } catch (error) {
        console.error('Ошибка при получении отзывов:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для удаления отзыва
app.delete('/admin/deleteReview/:reviewId', authenticateAdmin, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);

        const reviewsFilePath = path.join(__dirname, '../data', 'reviews.json');
        let reviews = [];

        if (fs.existsSync(reviewsFilePath)) {
            const rawData = fs.readFileSync(reviewsFilePath, 'utf-8');
            reviews = JSON.parse(rawData) || [];
        }

        const reviewIndex = reviews.findIndex(review => review.id === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Отзыв не найден' });
        }

        reviews.splice(reviewIndex, 1);
        fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf-8');

        // Удаление из базы данных
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

        return res.status(200).json({ message: 'Отзыв успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для редактирования отзыва
app.put('/admin/editReview/:reviewId', authenticateAdmin, async (req, res) => {
    try {
        const reviewId = parseInt(req.params.reviewId, 10);
        const { content } = req.body;

        const reviewsFilePath = path.join(__dirname, '../data', 'reviews.json');
        let reviews = [];

        if (fs.existsSync(reviewsFilePath)) {
            const rawData = fs.readFileSync(reviewsFilePath, 'utf-8');
            reviews = JSON.parse(rawData) || [];
        }

        const review = reviews.find(review => review.id === reviewId);
        if (!review) {
            return res.status(404).json({ message: 'Отзыв не найден' });
        }

        review.comment = content;
        fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2), 'utf-8');

        // Обновление в базе данных
        await db.query('UPDATE reviews SET comment = ? WHERE id = ?', [content, reviewId]);

        return res.status(200).json({ message: 'Отзыв успешно отредактирован' });
    } catch (error) {
        console.error('Ошибка при редактировании отзыва:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для редактирования отеля (администратор)
app.put('/admin/editHotel/:hotelId', authenticateAdmin, async (req, res) => {
    try {
        const hotelId = parseInt(req.params.hotelId, 10);
        const { hotelName, location, pricePerNight } = req.body;

        const hotelsFilePath = path.join(__dirname, '../data', 'hotels.json');
        let hotels = [];

        if (fs.existsSync(hotelsFilePath)) {
            const rawData = fs.readFileSync(hotelsFilePath, 'utf-8');
            hotels = JSON.parse(rawData) || [];
        }

        const hotel = hotels.find(hotel => hotel.id === hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Отель не найден' });
        }

        // Обновляем данные отеля
        hotel.name = hotelName;
        hotel.location = location;
        hotel.pricePerNight = pricePerNight;

        // Сохраняем обновленные данные в файл
        fs.writeFileSync(hotelsFilePath, JSON.stringify(hotels, null, 2), 'utf-8');

        // Обновление в базе данных
        await db.query(
            'UPDATE hotels SET name = ?, location = ?, pricePerNight = ? WHERE id = ?',
            [hotelName, location, pricePerNight, hotelId]
        );

        return res.status(200).json({ message: 'Отель успешно отредактирован' });
    } catch (error) {
        console.error('Ошибка при редактировании отеля:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для добавления пользователя (администратор)
app.post('/admin/addUser', authenticateAdmin, async (req, res) => {
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

        // Сохранение в базу данных
        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [newUser.name, newUser.email, newUser.password]
        );

        return res.status(201).json({ message: 'Пользователь успешно добавлен' });
    } catch (error) {
        console.error('Ошибка при добавлении пользователя:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});