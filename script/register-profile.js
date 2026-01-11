// 1. Функція копіювання посилання
function handleInvite(selectElement) {
    const url = selectElement.value;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
        alert("Посилання скопійовано!");
    }).catch(() => prompt("Скопіюйте посилання:", url));
    selectElement.selectedIndex = 0;
}

// 2. Функція ручного завантаження фото
function uploadPhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarImg = document.getElementById('user-avatar');
            const container = document.getElementById('avatar-container');
            
            // Якщо була літера — замінюємо назад на тег img
            container.innerHTML = `<img src="${e.target.result}" class="avatar-profile" id="user-avatar" alt="Avatar">`;
            
            // Зберігаємо в пам'ять
            localStorage.setItem('userCustomPhoto', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 3. Завантаження даних
document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Дата
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const user = tg.initDataUnsafe?.user;
    const avatarImg = document.getElementById('user-avatar');
    const nameElement = document.getElementById('display-name');
    const avatarContainer = document.getElementById('avatar-container');

    // Пріоритет завантаження фото:
    // 1. Ручне фото з localStorage
    // 2. Фото з Telegram
    // 3. Літера імені (якщо фото немає)
    
    const savedPhoto = localStorage.getItem('userCustomPhoto');
    const firstName = user?.first_name || localStorage.getItem('userName') || "Користувач";

    if (nameElement) nameElement.innerText = firstName;

    if (savedPhoto) {
        avatarImg.src = savedPhoto;
    } else if (user && user.photo_url) {
        avatarImg.src = user.photo_url;
    } else {
        const firstLetter = firstName.charAt(0).toUpperCase();
        avatarContainer.innerHTML = `<div class="avatar-placeholder">${firstLetter}</div>`;
    }

    // Завантаження решти полів
    const dataMap = { 'userAge': 'display-age', 'userGender': 'display-gender', 'userWeight': 'display-weight', 'userActivity': 'display-activity' };
    for (const [key, id] of Object.entries(dataMap)) {
        const val = localStorage.getItem(key);
        if (val) document.getElementById(id).textContent = val;
    }
});