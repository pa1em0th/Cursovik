document.addEventListener('DOMContentLoaded', () => {
    // Обработчик для формы входа (уже есть)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Предотвращаем стандартную отправку формы

            // Получаем элементы формы
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitButton = e.target.querySelector('button[type="submit"]');
            
            // Собираем данные из формы
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Валидация полей
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            // Проверка формата email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email');
                emailInput.focus();
                return;
            }

            // Блокируем кнопку во время выполнения запроса
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';

            try {
                // Проверка административных учетных данных
                if (email === 'admin@admin.com' && password === 'admin') {
                    localStorage.setItem('sessionId', 'admin_session_id');
                    localStorage.setItem('userRole', 'admin');
                    window.location.href = 'admin.html';
                    return;
                }

                // Отправляем POST-запрос на сервер
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Ошибка входа');
                }

                // Сохраняем данные пользователя
                localStorage.setItem('sessionId', result.sessionId);
                localStorage.setItem('userData', JSON.stringify({
                    id: result.user?.id,
                    name: result.user?.name,
                    email: result.user?.email,
                    role: result.user?.role || 'user'
                }));

                // Перенаправляем в зависимости от роли
                const redirectPage = result.user?.role === 'admin' ? 'admin.html' : 'profile.html';
                window.location.href = redirectPage;

            } catch (error) {
                console.error('Ошибка при входе:', error);
                
                // Показываем пользователю понятное сообщение об ошибке
                const errorMessage = error.message.includes('credentials')
                    ? 'Неверный email или пароль'
                    : 'Произошла ошибка при входе. Пожалуйста, попробуйте позже.';
                
                alert(errorMessage);
                
                // Возвращаем фокус на поле ввода
                passwordInput.value = '';
                passwordInput.focus();
            } finally {
                // Восстанавливаем кнопку
                submitButton.disabled = false;
                submitButton.innerHTML = 'Войти';
            }
        });
    }

    // Новый обработчик для формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Предотвращаем стандартную отправку формы

            // Получаем элементы формы
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitButton = e.target.querySelector('button[type="submit"]');

            // Собираем данные из формы
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Валидация полей
            if (!name || !email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }

            // Проверка формата email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email');
                emailInput.focus();
                return;
            }

            // Блокируем кнопку во время выполнения запроса
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';

            try {
                // Отправляем POST-запрос на сервер
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Ошибка регистрации');
                }

                // Успешная регистрация
                alert('Регистрация успешна! Теперь вы можете войти.');
                window.location.href = 'login.html';

            } catch (error) {
                console.error('Ошибка при регистрации:', error);
                
                // Показываем пользователю понятное сообщение об ошибке
                const errorMessage = error.message.includes('уже существует')
                    ? 'Пользователь с таким email уже существует'
                    : error.message || 'Произошла ошибка при регистрации. Пожалуйста, попробуйте позже.';
                
                alert(errorMessage);
                
                // Возвращаем фокус на поле ввода
                emailInput.focus();
            } finally {
                // Восстанавливаем кнопку
                submitButton.disabled = false;
                submitButton.innerHTML = 'Зарегистрироваться';
            }
        });
    }
});