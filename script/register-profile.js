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

    // 1. Дата
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('uk-UA', options);
    }

    // 2. Дані Telegram
    const user = tg.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');
    const nameElement = document.getElementById('display-name');
    const avatarContainer = document.getElementById('avatar-container');

    if (user) {
        // Встановлюємо ім'я
        const firstName = user.first_name || "Користувач";
        if (nameElement) nameElement.innerText = firstName;
        
        // Перевірка аватара
        if (user.photo_url) {
            avatarImg.src = user.photo_url;
        } else {
            // ЯКЩО ФОТО НЕМАЄ: створюємо іконку з літерою
            const firstLetter = firstName.charAt(0).toUpperCase();
            avatarContainer.innerHTML = `<div class="avatar-placeholder">${firstLetter}</div>`;
        }
    }

    // 3. Дані з localStorage
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
            if (key === 'userName' && user && user.first_name) continue;
            element.textContent = val;
        }
    }
});