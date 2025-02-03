// Обработка формы регистрации
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Собираем данные из формы
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Выводим данные в консоль для отладки
    console.log({ name, email, password });

    // Проверяем, что все поля заполнены
    if (!name || !email || !password) {
        alert('Заполните все поля!');
        return;
    }

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Некорректный email');
        return;
    }

    // Проверяем длину пароля (минимум 6 символов)
    if (password.length < 6) {
        alert('Пароль должен содержать минимум 6 символов');
        return;
    }

    // Отправляем POST-запрос на сервер
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Успешная регистрация
            window.location.href = 'login.html'; // Перенаправление на страницу входа
        } else {
            alert(result.message || 'Ошибка регистрации'); // Сообщение об ошибке
        }
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});

// Обработка формы входа
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Собираем данные из формы
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Выводим данные в консоль для отладки
    console.log({ email, password });

    // Проверяем, что все поля заполнены
    if (!email || !password) {
        alert('Заполните все поля!');
        return;
    }

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Некорректный email');
        return;
    }

    // Отправляем POST-запрос на сервер
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Вы успешно вошли!');
            localStorage.setItem('sessionId', result.sessionId); // Сохраняем sessionId в localStorage
            window.location.href = 'profile.html'; // Перенаправление на страницу профиля
        } else {
            alert(result.message || 'Ошибка входа');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});

// Функция для проверки авторизации
function checkAuthorization() {
    const sessionId = localStorage.getItem('sessionId'); // Используем sessionId вместо токена
    if (!sessionId) {
        alert('Пожалуйста, войдите в систему.');
        window.location.href = 'login.html';
    }
}

// Функция для получения данных пользователя
async function loadUserData() {
    try {
        checkAuthorization(); // Проверяем авторизацию перед запросом

        const response = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('sessionId'), // Используем sessionId
            },
        });

        if (!response.ok) {
            alert('Ошибка при загрузке данных пользователя.');
            return;
        }

        const result = await response.json();
        document.getElementById('userName').textContent = result.user.name;
        document.getElementById('userEmail').textContent = result.user.email;
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
}

// Функция для получения списка бронирований
async function loadBookings() {
    try {
        checkAuthorization(); // Проверяем авторизацию перед запросом

        const response = await fetch('/api/bookings', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem('sessionId'), // Используем sessionId
            },
        });

        if (!response.ok) {
            alert('Ошибка при загрузке бронирований.');
            return;
        }

        const bookings = await response.json();
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = ''; // Очищаем список

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p class="text-center text-primary">У вас нет бронирований.</p>';
        } else {
            bookings.forEach(booking => {
                const bookingItem = document.createElement('div');
                bookingItem.className = 'bg-[#222222] p-4 rounded-lg';
                bookingItem.innerHTML = `
                    <p class="text-sm text-primary">Отель: ${booking.hotelName}</p>
                    <p class="text-sm text-gray-400">Дата заезда: ${booking.checkInDate}</p>
                    <p class="text-sm text-gray-400">Дата выезда: ${booking.checkOutDate}</p>
                `;
                bookingsList.appendChild(bookingItem);
            });
        }
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
}

// Функция для выхода из системы
document.getElementById('logoutButton')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('sessionId'), // Используем sessionId
            },
        });

        if (response.ok) {
            localStorage.removeItem('sessionId'); // Удаляем sessionId из localStorage
            alert('Вы успешно вышли из системы.');
            window.location.href = 'login.html'; // Перенаправление на страницу входа
        } else {
            alert('Ошибка при выходе из системы.');
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});

// Переключение между вкладками
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
        // Убираем класс "active" у всех кнопок
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        // Добавляем класс "active" к нажатой кнопке
        button.classList.add('active');
        // Показываем соответствующий контент
        const tabId = button.id.replace('Tab', 'Content');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// Загрузка данных при открытии страницы профиля
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('profile.html')) {
        checkAuthorization(); // Проверяем авторизацию
        await loadUserData(); // Загружаем данные пользователя
        await loadBookings(); // Загружаем бронирования
        // По умолчанию показываем вкладку "Мои данные"
        document.getElementById('personalDataTab')?.click();
    }
});