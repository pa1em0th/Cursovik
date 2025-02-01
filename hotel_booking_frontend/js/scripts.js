const API_URL = 'http://localhost:5000/api';

// Плавное изменение фона шапки при скролле
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Мобильное меню
const mobileMenu = document.getElementById('mobile-menu');
const nav = document.querySelector('.nav');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    nav.classList.toggle('active');
});
// Регистрация пользователя
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        window.location.href = 'login.html';
    }
});

// Вход пользователя
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user)); // Сохраняем пользователя в localStorage
        window.location.href = 'profile.html';
    }
});

// Поиск номеров
document.getElementById('searchForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const checkInDate = document.getElementById('check_in_date').value;
    const checkOutDate = document.getElementById('check_out_date').value;

    const response = await fetch(`${API_URL}/hotels?city=${city}`);
    const data = await response.json();

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';
    data.forEach(hotel => {
        resultsDiv.innerHTML += `
            <div>
                <h3>${hotel.name}</h3>
                <p>${hotel.address}, ${hotel.city}</p>
                <button onclick="bookHotel(${hotel.id})">Забронировать</button>
            </div>
        `;
    });
});

// Бронирование номера
async function bookHotel(hotelId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Пожалуйста, войдите в систему.');
        return;
    }

    const checkInDate = document.getElementById('check_in_date').value;
    const checkOutDate = document.getElementById('check_out_date').value;

    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: user.id,
            hotelId,
            checkInDate,
            checkOutDate,
        }),
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        window.location.href = 'profile.html';
    }
}

// Загрузка бронирований пользователя
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('profile.html')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Пожалуйста, войдите в систему.');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_URL}/bookings?userId=${user.id}`);
        const data = await response.json();

        const bookingsDiv = document.getElementById('bookings');
        bookingsDiv.innerHTML = '';
        data.forEach(booking => {
            bookingsDiv.innerHTML += `
                <div>
                    <p>Отель: ${booking.hotelName}</p>
                    <p>Дата заезда: ${booking.checkInDate}</p>
                    <p>Дата выезда: ${booking.checkOutDate}</p>
                    <button onclick="cancelBooking(${booking.id})">Отменить бронирование</button>
                </div>
            `;
        });
    }
});

// Отмена бронирования
async function cancelBooking(bookingId) {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
        window.location.reload();
    }
}