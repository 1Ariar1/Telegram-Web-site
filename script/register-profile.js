// 1. Функція для копіювання посилання (Запросити друзів)
function handleInvite(selectElement) {
    const url = selectElement.value;
    if (!url) return;

    // Копіювання в буфер обміну
    navigator.clipboard.writeText(url).then(() => {
        alert("Посилання скопійовано: " + url);
    }).catch(err => {
        // Запасний варіант, якщо браузер блокує автоматичне копіювання
        prompt("Скопіюйте посилання звідси:", url);
    });

    // Повертаємо селект у початковий стан
    selectElement.selectedIndex = 0;
}

// 2. Основна логіка після завантаження сторінки
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready(); // Повідомляємо ТГ, що додаток завантажився
    tg.expand(); // Розгортаємо додаток на весь екран

    // --- Виведення поточної дати ---
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('uk-UA', options);
    }

    // --- Робота з даними Telegram (Аватар та Ім'я) ---
    const user = tg.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');
    const nameElement = document.getElementById('display-name');

    if (user) {
        // Встановлюємо ім'я з Телеграму
        if (nameElement) {
            nameElement.innerText = user.first_name || "Користувач";
        }

        // Встановлюємо фото з Телеграму, якщо воно доступне
        if (avatarImg && user.photo_url) {
            avatarImg.src = user.photo_url;
            console.log("Фото завантажено з Telegram:", user.photo_url);
        } else {
            console.log("Telegram не надав photo_url або елемент не знайдено.");
        }
    }

    // --- Виведення даних з локального сховища (localStorage) ---
    const dataMap = {
        'userName': 'display-name',
        'userAge': 'display-age',
        'userGender': 'display-gender',
        'userWeight': 'display-weight',
        'userActivity': 'display-activity'
    };

    for (const [key, id] of Object.entries(dataMap)) {
        const val = localStorage.getItem(key);
        const element = document.getElementById(id);
        
        if (val && element) {
            // Пріоритет: якщо це ім'я і воно вже взяте з Telegram, не переписуємо його
            if (key === 'userName' && user && user.first_name) {
                continue;
            }
            element.textContent = val;
        }
    }
});