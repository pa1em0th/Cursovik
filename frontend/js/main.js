document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы

    // Собираем данные из формы
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log('Email:', email); // Логирование для отладки
    console.log('Password:', password); // Логирование для отладки

    // Проверка административных учетных данных
    if (email === 'admin@admin.com' && password === 'admin') {
        localStorage.setItem('sessionId', 'admin_session_id'); // Сохраняем идентификатор сессии
        window.location.href = 'admin.html'; // Перенаправление на страницу администратора
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
