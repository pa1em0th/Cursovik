-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Апр 22 2025 г., 10:21
-- Версия сервера: 5.7.39
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `hotel_booking`
--

-- --------------------------------------------------------

--
-- Структура таблицы `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `hotelId` int(11) NOT NULL,
  `checkInDate` date NOT NULL,
  `checkOutDate` date NOT NULL,
  `roomNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bookingNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roomId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `bookings`
--

INSERT INTO `bookings` (`id`, `userId`, `hotelId`, `checkInDate`, `checkOutDate`, `roomNumber`, `bookingNumber`, `roomId`) VALUES
(1, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(2, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(3, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(4, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(5, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(6, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(7, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(8, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(9, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(10, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(11, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(12, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(13, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(14, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(15, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(16, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(17, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(18, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(19, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(20, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(21, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(22, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(23, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(24, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(25, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(26, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(27, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(28, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(29, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(30, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(31, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(32, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(33, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(34, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(35, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(36, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(37, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(38, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(39, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(40, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(41, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(42, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(43, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(44, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(45, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(46, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(47, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(48, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL),
(49, 4, 1, '2025-02-26', '2025-02-28', '101', 'BN-5HAI0P', NULL),
(50, 2, 2, '2025-02-18', '2025-02-28', '201', 'BN-X93USK', NULL),
(51, 4, 1, '2025-03-01', '2025-03-11', '101', 'BN-Z82Q6P', NULL),
(52, 5, 1, '2025-02-25', '2025-02-26', '101', '578094', NULL),
(53, 5, 1, '2025-03-27', '2025-03-29', '101', '734823', NULL),
(54, 5, 1, '2025-04-01', '2025-04-24', '101', 'BN-1E7SDV', NULL),
(55, 6, 1, '2025-04-01', '2025-04-30', '102', 'BN-51FCCW', NULL),
(56, 6, 2, '2025-04-02', '2025-04-16', '201', 'BN-I618UP', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `hotels`
--

CREATE TABLE `hotels` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pricePerNight` decimal(10,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `hotels`
--

INSERT INTO `hotels` (`id`, `name`, `location`, `pricePerNight`, `image`) VALUES
(1, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(2, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(3, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(4, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(5, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(6, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(7, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(8, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(9, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(10, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(11, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(12, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(13, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(14, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(15, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(16, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(17, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(18, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(19, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(20, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(21, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(22, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(23, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(24, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(25, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(26, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(27, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(28, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(29, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(30, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(31, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(32, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(33, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(34, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(35, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(36, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(37, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(38, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(39, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(40, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(41, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(42, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(43, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(44, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(45, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(46, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(47, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(48, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(49, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(50, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(51, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(52, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(53, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(54, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL),
(55, 'Hotel Hiltone', 'Moscow, Russia', '5500.00', NULL),
(56, 'Hotel Marriott', 'St. Petersburg, Russia', '6000.00', NULL),
(57, 'Hotel Ritz-Carlton', 'Novosibirsk, Russia', '7000.00', NULL),
(58, 'Hotel Four Seasons', 'Kazan, Russia', '8000.00', NULL),
(59, 'Hotel Hyatt', 'Ekaterinburg, Russia', '6500.00', NULL),
(60, 'Hotel InterContinental', 'Nizhny Novgorod, Russia', '7500.00', NULL),
(61, 'Hotel Sheraton', 'Samara, Russia', '5500.00', NULL),
(62, 'Hotel Radisson Blu', 'Rostov-on-Don, Russia', '6200.00', NULL),
(63, 'Hotel Crowne Plaza', 'Krasnodar, Russia', '5800.00', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `hotelId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `userId`, `hotelId`, `rating`, `comment`, `timestamp`) VALUES
(1, 4, 1, 5, 'Прекрасный отель! Отдыхали всей семьей', '2025-02-24 07:16:16'),
(2, 4, 1, 3, 'не понравилось обслуживание отеля/', '2025-02-24 07:16:40'),
(3, 4, 1, 5, 'Прекрасный отель! Отдыхали всей семьей', '2025-02-24 07:16:16'),
(4, 4, 1, 3, 'не понравилось обслуживание отеля/', '2025-02-24 07:16:40'),
(5, 4, 1, 5, 'Прекрасный отель! Отдыхали всей семьей', '2025-02-24 07:16:16'),
(6, 4, 1, 3, 'не понравилось обслуживание отеля/', '2025-02-24 07:16:40'),
(7, 4, 1, 5, 'Прекрасный отель! Отдыхали всей семьей', '2025-02-24 07:16:16'),
(8, 4, 1, 3, 'не понравилось обслуживание отеля/', '2025-02-24 07:16:40'),
(9, 4, 1, 5, 'Прекрасный отель! Отдыхали всей семьей', '2025-02-24 07:16:16'),
(10, 4, 1, 3, 'не понравилось обслуживание отеля/', '2025-02-24 07:16:40');

-- --------------------------------------------------------

--
-- Структура таблицы `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `hotelId` int(11) NOT NULL,
  `roomNumber` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'user', 'annaruabtseva052@gmail.com', '$2a$10$HUneNLhbynslzBFX5FG3LOB7Gp5uVnm5n9CfE8wZWtQ2f/U2Njqx2'),
(2, 'анна', 'antonsymkin3456@gmail.com', '$2a$10$82bAB8t4W5wpj.Ak54HqQe0QCdMHNlZBAL7BPKdGzwnIvK01XgNha'),
(3, 'анна', 'antonsymkin34446@gmail.com', '$2a$10$mzoK9A7BpwvBNH7qjJjv1uQBpTmyPNfixtWeCu4TleBJCltbkr9tC'),
(4, 'Andrey', 'ondruusha@gmail.com', '$2a$10$1Q6aN1eIeRO.YT7Ho/TZu.nGCWmXii7EW6Ciq9byd05hvpHQK2xxm'),
(5, 'anna', 'annaruabtseva050@gmail.com', '$2a$10$V1Xk3ZeSLhWLijSz.wgMouaHqh0YrPqYCIgicPcqAK81fttPWiYAC'),
(6, 'vadik', 'annaruabtseva0500@gmail.com', '$2a$10$0awpCJlUYR2swjCzZs/aTOx68dIjkcZSeuZFlJeO..3/QsIIUYLg6'),
(7, '11', 'annaruabtseva0509@gmail.com', '$2a$10$lTM209.C.D31RkYjZcKgFeHu2rZx1k8QO26yCCrQtlcWjjtU1Rvpm'),
(8, 'ёёё', 'annaruabtseva5009@gmail.com', '$2a$10$W9QJVSI1W9YKifXbSxm2luvHJkIW81dun7SJSXIAVLF97P4ywmahO'),
(17, 'www', 'antonsymkin3444222@gmail.com', '$2a$10$bGqkedLceFn5fw4BsRASBeaV37u/cRyMsmy/j1CioPdPvYKGSFI7a'),
(18, 'ee', 'antonsy@gmail.com', '$2a$10$OBBgZ8DilD2HYuyVGJjDTuczB9T/kDj3csyOXxkBgTNLllhuSOSnG'),
(19, 'admin', 'antonsymkin346@gmail.com', '$2a$10$QwpWhDy2HMG/m0PGZEnKdOnf1VDcACqcWZqXcCR1.0ftAPvMk.SMm'),
(44, 'eeee', 'antonsymkin@gmail.com', '$2a$10$hXGosSap1D9WsBNiMyInquvBJaaobg/QwdCoUVlzLhHjuYKtRq..e');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `hotelId` (`hotelId`);

--
-- Индексы таблицы `hotels`
--
ALTER TABLE `hotels`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `hotelId` (`hotelId`);

--
-- Индексы таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_hotel_room` (`hotelId`,`roomNumber`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT для таблицы `hotels`
--
ALTER TABLE `hotels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`);

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`);

--
-- Ограничения внешнего ключа таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hotelId`) REFERENCES `hotels` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
