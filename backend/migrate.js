const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
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

<<<<<<< HEAD
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
=======
// Функция для вставки данных в таблицу users с обработкой дубликатов
const migrateUsers = async () => {
    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
    const users = readJsonFile(usersFilePath);

    for (const user of users) {
        try {
            await db.query(
                `INSERT INTO users (name, email, password) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                    name = VALUES(name),
                    password = VALUES(password)`,
                [user.name, user.email, user.password]
            );
        } catch (error) {
            console.error(`Ошибка при добавлении пользователя ${user.email}:`, error.message);
        }
    }
    console.log('Миграция users завершена.');
};

// Функция для вставки данных в таблицу hotels с обработкой дубликатов
const migrateHotels = async () => {
    const hotelsFilePath = path.join(__dirname, '..', 'data', 'hotels.json');
    const hotels = readJsonFile(hotelsFilePath);

    for (const hotel of hotels) {
        try {
            await db.query(
                `INSERT INTO hotels (name, location, pricePerNight) 
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE 
                    location = VALUES(location),
                    pricePerNight = VALUES(pricePerNight)`,
                [hotel.name, hotel.location, hotel.pricePerNight]
            );
        } catch (error) {
            console.error(`Ошибка при добавлении отеля ${hotel.name}:`, error.message);
        }
    }
    console.log('Миграция hotels завершена.');
};

// Функция для вставки данных в таблицу bookings
const migrateBookings = async () => {
    const bookingsFilePath = path.join(__dirname, '..', 'data', 'bookings.json');
    const bookings = readJsonFile(bookingsFilePath);

    for (const booking of bookings) {
        try {
            // Проверяем существование пользователя и отеля
            const [user] = await db.query('SELECT id FROM users WHERE id = ?', [booking.userId]);
            const [hotel] = await db.query('SELECT id FROM hotels WHERE id = ?', [booking.hotelId]);

            if (!user.length || !hotel.length) {
                console.warn(`Пропуск бронирования: пользователь ${booking.userId} или отель ${booking.hotelId} не существуют`);
                continue;
            }

            await db.query(
                'INSERT INTO bookings (userId, hotelId, checkInDate, checkOutDate, roomNumber, bookingNumber) VALUES (?, ?, ?, ?, ?, ?)',
                [booking.userId, booking.hotelId, booking.checkInDate, booking.checkOutDate, booking.roomNumber, booking.bookingNumber]
            );
        } catch (error) {
            console.error('Ошибка при добавлении бронирования:', error.message);
        }
    }
    console.log('Миграция bookings завершена.');
};

const migrateReviews = async () => {
    const reviewsFilePath = path.join(__dirname, '..', 'data', 'reviews.json');
    const reviews = readJsonFile(reviewsFilePath);

    for (const review of reviews) {
        try {
            // Проверяем существование пользователя и отеля
            const [user] = await db.query('SELECT id FROM users WHERE id = ?', [review.userId]);
            const [hotel] = await db.query('SELECT id FROM hotels WHERE id = ?', [review.hotelId]);

            if (!user.length || !hotel.length) {
                console.warn(`Пропуск отзыва: пользователь ${review.userId} или отель ${review.hotelId} не существуют`);
                continue;
            }

            // Преобразуем ISO-дату в формат, понятный MySQL
            const mysqlTimestamp = new Date(review.timestamp).toISOString().slice(0, 19).replace('T', ' ');

            await db.query(
                'INSERT INTO reviews (userId, hotelId, rating, comment, timestamp) VALUES (?, ?, ?, ?, ?)',
                [review.userId, review.hotelId, review.rating, review.comment, mysqlTimestamp]
            );
        } catch (error) {
            console.error('Ошибка при добавлении отзыва:', error.message);
        }
    }
    console.log('Миграция reviews завершена.');
};

// Основная функция для запуска миграции
const migrateData = async () => {
    try {
        console.log('Начало миграции данных...');
        await migrateUsers();
        await migrateHotels();
        await migrateBookings();
        await migrateReviews();
        console.log('Все данные успешно перенесены в базу данных.');
    } catch (error) {
        console.error('Ошибка при переносе данных:', error);
    } finally {
        await db.end(); // Закрываем соединение с базой данных
        process.exit(); // Завершаем процесс
    }
};
>>>>>>> 6d288d8d54cbca52036496de920beffea6102a54

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Некорректный email' });
        }

        // Проверка, существует ли пользователь в базе данных
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохранение в базу данных
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
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

        // Поиск пользователя в базе данных
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
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

// Маршрут для получения списка отелей с номерами
app.get('/api/hotels', async (req, res) => {
    try {
        // Получаем отели и их номера одним запросом
        const [hotels] = await db.query(`
            SELECT h.*, 
                   GROUP_CONCAT(r.roomNumber) AS roomNumbers,
                   GROUP_CONCAT(r.id) AS roomIds
            FROM hotels h
            LEFT JOIN rooms r ON h.id = r.hotelId
            GROUP BY h.id
        `);

        // Преобразуем строки с номерами в массивы
        const formattedHotels = hotels.map(hotel => ({
            ...hotel,
            rooms: hotel.roomNumbers ? hotel.roomNumbers.split(',').map(Number) : [],
            roomIds: hotel.roomIds ? hotel.roomIds.split(',').map(Number) : []
        }));

        return res.status(200).json(formattedHotels);
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

        // Проверка доступности комнаты
        const [bookings] = await db.query(
            'SELECT * FROM bookings WHERE hotelId = ? AND roomNumber = ?',
            [hotelId, roomNumber]
        );

        const isRoomAvailable = bookings.every(booking => {
            const existingCheckIn = new Date(booking.checkInDate);
            const existingCheckOut = new Date(booking.checkOutDate);
            const newCheckIn = new Date(checkInDate);
            const newCheckOut = new Date(checkOutDate);

            return (
                newCheckOut <= existingCheckIn ||
                newCheckIn >= existingCheckOut
            );
        });

        if (!isRoomAvailable) {
            return res.status(400).json({ message: 'Комната уже забронирована на выбранные даты' });
        }

        const bookingNumber = generateBookingNumber();

        // Сохранение в базу данных
        const [result] = await db.query(
            'INSERT INTO bookings (userId, hotelId, checkInDate, checkOutDate, roomNumber, bookingNumber) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, hotelId, checkInDate, checkOutDate, roomNumber, bookingNumber]
        );

        return res.status(201).json({ message: 'Бронирование успешно', bookingNumber });
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

        // Проверка, принадлежит ли бронирование пользователю
        const [booking] = await db.query('SELECT * FROM bookings WHERE id = ? AND userId = ?', [bookingId, userId]);
        if (booking.length === 0) {
            return res.status(404).json({ message: 'Бронирование не найдено' });
        }

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

        // Сохранение в базу данных
        const [result] = await db.query(
            'INSERT INTO reviews (userId, hotelId, rating, comment, timestamp) VALUES (?, ?, ?, ?, ?)',
            [userId, hotelId, rating, comment, new Date().toISOString()]
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

        // Сохранение в базу данных
        const [result] = await db.query(
            'INSERT INTO hotels (name, location, pricePerNight) VALUES (?, ?, ?)',
            [hotelName, location, pricePerNight]
        );

        return res.status(201).json({ message: 'Отель успешно добавлен' });
    } catch (error) {
        console.error('Ошибка при добавлении отеля:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Маршрут для получения списка отелей (админ)
app.get('/admin/hotels', authenticateAdmin, async (req, res) => {
    try {
        const [hotels] = await db.query(`
            SELECT h.*, 
                   COUNT(r.id) AS roomsCount
            FROM hotels h
            LEFT JOIN rooms r ON h.id = r.hotelId
            GROUP BY h.id
        `);
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

        // Проверка, существует ли отель
        const [hotel] = await db.query('SELECT * FROM hotels WHERE id = ?', [hotelId]);
        if (hotel.length === 0) {
            return res.status(404).json({ message: 'Отель не найден' });
        }

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

        // Проверка, существует ли пользователь
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

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

        // Проверка, существует ли отзыв
        const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        if (review.length === 0) {
            return res.status(404).json({ message: 'Отзыв не найден' });
        }

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

        // Проверка, существует ли отзыв
        const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        if (review.length === 0) {
            return res.status(404).json({ message: 'Отзыв не найден' });
        }

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

        // Проверка, существует ли отель
        const [hotel] = await db.query('SELECT * FROM hotels WHERE id = ?', [hotelId]);
        if (hotel.length === 0) {
            return res.status(404).json({ message: 'Отель не найден' });
        }

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

        // Проверка, существует ли пользователь
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Сохранение в базу данных
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
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