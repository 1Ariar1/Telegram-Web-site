// 1. Функція для запрошення друзів
function handleInvite(selectElement) {
    const url = selectElement.value;
    if (!url) return;

    navigator.clipboard.writeText(url).then(() => {
        alert("Посилання скопійовано: " + url);
    }).catch(err => {
        prompt("Скопіюйте посилання звідси:", url);
    });

    selectElement.selectedIndex = 0;
}

// 2. Основна логіка завантаження профілю
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.ready(); // Повідомляємо ТГ, що додаток готовий
    tg.expand(); // Розгортаємо на весь екран

    // --- Виведення дати ---
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('uk-UA', options);
    }

    // --- Пріоритет: Дані з Telegram ---
    const user = tg.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');
    const nameElement = document.getElementById('display-name');

    if (user) {
        // Якщо зайшли через ТГ, беремо ім'я звідти
        if (nameElement) {
            nameElement.innerText = user.first_name || "Користувач";
        }
        // Встановлюємо фото з ТГ
        if (user.photo_url && avatarImg) {
            avatarImg.src = user.photo_url;
        }
    }

    // --- Виведення решти даних (localStorage) ---
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
            // Якщо це ім'я і воно вже встановлено з Telegram, не переписуємо його
            if (key === 'userName' && user && user.first_name) {
                continue;
            }
            element.textContent = val;
        }
    }
});