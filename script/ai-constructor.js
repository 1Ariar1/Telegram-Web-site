document.addEventListener('DOMContentLoaded', function() {
    // 1. Ініціалізація Telegram та Аватара (як у Main.html)
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe?.user;
    const mainAvatar = document.getElementById('main-avatar');

    if (mainAvatar) {
        const savedPhoto = localStorage.getItem('userCustomPhoto');
        if (savedPhoto) {
            mainAvatar.src = savedPhoto;
        } else if (user && user.photo_url) {
            mainAvatar.src = user.photo_url;
        }
    }
    tg.ready();
});

// 2. Функція генерації (Логіка AI Конструктора)
function startGeneration() {
    const goal = document.getElementById('ai-goal').value;
    const place = document.getElementById('ai-place').value;
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');

    // Ефект завантаження
    resultBox.style.display = "block";
    resultText.innerText = "Аналізую ваші дані... 🧠";

    setTimeout(() => {
        let plan = "";

        if (goal === "схуднення") {
            plan = "🔥 ПЛАН ДЛЯ СХУДНЕННЯ (" + place + "):\n" +
                   "1. Берпі: 3 підходи по 12 разів\n" +
                   "2. Стрибки 'Джампінг Джек': 4 х 45 сек\n" +
                   "3. Планка: 3 х 1 хв\n" +
                   "4. Біг на місці: 5 хв";
        } else if (goal === "набір маси") {
            plan = "💪 ПЛАН ДЛЯ МАСИ (" + place + "):\n" +
                   "1. Присідання: 4 підходи по 10 разів\n" +
                   "2. Віджимання (широко): 3 х 15\n" +
                   "3. Випади: 3 х 12 на кожну ногу\n" +
                   "4. Зворотні віджимання: 3 х 12";
        } else {
            plan = "⚡ ПЛАН НА ВИТРИВАЛІСТЬ (" + place + "):\n" +
                   "1. Скручування на прес: 3 х 25\n" +
                   "2. Альпініст (Mountain Climber): 4 х 40 сек\n" +
                   "3. Скакалка (або імітація): 5 хв\n" +
                   "4. Човниковий біг: 3 х 30 сек";
        }

        resultText.innerText = plan;
    }, 1500); // Імітація роздумів AI
}

// 3. Збереження результату
function saveToHistory() {
    const plan = document.getElementById('result-text').innerText;
    alert("Тренування збережено в історію!");
    // Тут можна додати запис у localStorage історії
}