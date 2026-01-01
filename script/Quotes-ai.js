const aiDatabase = {
    starts: [
        "Успіх — це", 
        "Твоя перемога — це", 
        "Справжня сила — це", 
        "Дисципліна — це", 
        "Твій результат — це", 
        "Спорт — це",
        "Кожне тренування — це"
    ],
    middles: [
        "щоденна робота над", 
        "здатність долати", 
        "повна концентрація на", 
        "вміння перетворювати втому в", 
        "відмова від страху перед",
        "крок вперед крізь"
    ],
    ends: [
        "власними слабкостями.", 
        "поставленими цілями.", 
        "новими викликами.", 
        "своїм майбутнім.", 
        "кожним тренуванням.",
        "неможливе."
    ]
};

// Функція генерації випадкової фрази
function generateAIQuote() {
    const s = aiDatabase.starts[Math.floor(Math.random() * aiDatabase.starts.length)];
    const m = aiDatabase.middles[Math.floor(Math.random() * aiDatabase.middles.length)];
    const e = aiDatabase.ends[Math.floor(Math.random() * aiDatabase.ends.length)];
    return `${s} ${m} ${e}`;
}

// Функція анімації та оновлення тексту
function updateQuote() {
    // Шукаємо саме внутрішній текст, який має рухатися
    const quoteText = document.getElementById('quote-text');
    
    if (!quoteText) {
        console.error("Елемент 'quote-text' не знайдено! Перевір HTML.");
        return;
    }

    // 1. Текст починає їхати вліво (клас slide-out додає зміщення та прозорість)
    quoteText.classList.add('slide-out');

    setTimeout(() => {
        // 2. Коли текст зник (через 0.5-0.6 сек):
        // - Вимикаємо анімацію (transition: none), щоб перекинути текст миттєво
        quoteText.style.transition = 'none';
        quoteText.classList.remove('slide-out');
        
        // - Ставимо його в позицію "справа" (slide-prepare)
        quoteText.classList.add('slide-prepare');
        
        // - Міняємо саму цитату
        quoteText.innerText = generateAIQuote();

        // 3. Даємо браузеру мікро-паузу, щоб він зрозумів, що текст уже справа
        setTimeout(() => {
            // - Вмикаємо анімацію назад
            quoteText.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            // - Прибираємо підготовчий клас, і текст плавно заїжджає в центр
            quoteText.classList.remove('slide-prepare');
        }, 50);

    }, 600); 
}

// Запускаємо зміну кожні 7 секунд
setInterval(updateQuote, 7000);

// Запускаємо першу цитату відразу при завантаженні сторінки
window.addEventListener('load', updateQuote);