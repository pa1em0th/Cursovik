const fs = require('fs');
const path = require('path');
const db = require('./db');

// Функция для чтения JSON-файла
const readJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};

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

// Запуск миграции
migrateData();