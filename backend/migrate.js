const fs = require('fs');
const path = require('path');
const db = require('./db');

// Функция для чтения JSON-файла
const readJsonFile = (filePath) => {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};

// Функция для вставки данных в таблицу users
const migrateUsers = async () => {
    const usersFilePath = path.join(__dirname, '..', 'data', 'users.json'); // Обновлённый путь
    const users = readJsonFile(usersFilePath);

    for (const user of users) {
        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [user.name, user.email, user.password]
        );
    }
    console.log('Данные users успешно перенесены в базу данных.');
};

// Функция для вставки данных в таблицу hotels
const migrateHotels = async () => {
    const hotelsFilePath = path.join(__dirname, '..', 'data', 'hotels.json'); // Обновлённый путь
    const hotels = readJsonFile(hotelsFilePath);

    for (const hotel of hotels) {
        await db.query(
            'INSERT INTO hotels (name, location, pricePerNight) VALUES (?, ?, ?)',
            [hotel.name, hotel.location, hotel.pricePerNight]
        );
    }
    console.log('Данные hotels успешно перенесены в базу данных.');
};

// Функция для вставки данных в таблицу bookings
const migrateBookings = async () => {
    const bookingsFilePath = path.join(__dirname, '..', 'data', 'bookings.json'); // Обновлённый путь
    const bookings = readJsonFile(bookingsFilePath);

    for (const booking of bookings) {
        await db.query(
            'INSERT INTO bookings (userId, hotelId, checkInDate, checkOutDate, roomNumber, bookingNumber) VALUES (?, ?, ?, ?, ?, ?)',
            [booking.userId, booking.hotelId, booking.checkInDate, booking.checkOutDate, booking.roomNumber, booking.bookingNumber]
        );
    }
    console.log('Данные bookings успешно перенесены в базу данных.');
};

// Функция для вставки данных в таблицу reviews
const migrateReviews = async () => {
    const reviewsFilePath = path.join(__dirname, '..', 'data', 'reviews.json'); // Обновлённый путь
    const reviews = readJsonFile(reviewsFilePath);

    for (const review of reviews) {
        await db.query(
            'INSERT INTO reviews (userId, hotelId, rating, comment, timestamp) VALUES (?, ?, ?, ?, ?)',
            [review.userId, review.hotelId, review.rating, review.comment, review.timestamp]
        );
    }
    console.log('Данные reviews успешно перенесены в базу данных.');
};

// Основная функция для запуска миграции
const migrateData = async () => {
    try {
        await migrateUsers();
        await migrateHotels();
        await migrateBookings();
        await migrateReviews();
        console.log('Все данные успешно перенесены в базу данных.');
    } catch (error) {
        console.error('Ошибка при переносе данных:', error);
    } finally {
        await db.end(); // Закрываем соединение с базой данных
    }
};

// Запуск миграции
migrateData();