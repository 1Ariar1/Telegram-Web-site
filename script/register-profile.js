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

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // 1. Виведення дати
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('uk-UA', options);
    }

    // 2. Отримання даних користувача
    const user = tg.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');
    const nameElement = document.getElementById('display-name');

    if (user) {
        console.log("Telegram User Data:", user); // Перевірка в консолі

        // Встановлюємо ім'я (пріоритет Telegram)
        if (nameElement) {
            nameElement.innerText = user.first_name || "Користувач";
        }

        // Спроба встановити фото
        if (avatarImg) {
            if (user.photo_url) {
                avatarImg.src = user.photo_url;
                console.log("Фото знайдено:", user.photo_url);
            } else {
                console.warn("Telegram не надав photo_url. Можливо, обмеження приватності.");
                // Можна поставити колір за замовчуванням або залишити бота
                avatarImg.style.border = "2px solid red"; // Тимчасова позначка для тесту
            }
        }
    }

    // 3. Завантаження решти даних з localStorage
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
            // Не переписуємо ім'я, якщо воно вже прийшло з ТГ
            if (key === 'userName' && user && user.first_name) continue;
            element.textContent = val;
        }
    }
});