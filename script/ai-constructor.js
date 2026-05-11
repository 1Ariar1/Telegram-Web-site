const API_KEY = 'AIzaSyANCxDaaBGnVz6Zyf5Mg_DGL5Qt5yzW-pQ';

document.addEventListener('DOMContentLoaded', function () {
    // Підключення Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }

    // Синхронізація аватара (якщо елемент є на сторінці)
    const mainAvatar = document.getElementById('main-avatar');
    if (mainAvatar) {
        const savedPhoto = localStorage.getItem('userCustomPhoto');
        const tgPhoto = window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url;
        if (savedPhoto) mainAvatar.src = savedPhoto;
        else if (tgPhoto) mainAvatar.src = tgPhoto;
    }
});

// Поточне згенероване тренування
let currentGeneratedWorkout = null;

async function generateWithAI() {
    const goal  = document.getElementById('ai-goal').value;
    const level = document.getElementById('ai-level').value;
    const place = document.getElementById('ai-place').value;

    const btn       = document.getElementById('gen-btn');
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');
    const spinner   = document.getElementById('loading-spinner');

    // Блокуємо кнопку та показуємо спінер
    btn.disabled = true;
    btn.innerText = '⏳ Генерація...';
    resultBox.style.display = 'block';
    spinner.style.display = 'block';
    resultText.innerText = '';

    // Кнопка збереження — створюємо один раз
    let saveBtn = document.getElementById('save-ai-btn');
    if (!saveBtn) {
        saveBtn = document.createElement('button');
        saveBtn.id = 'save-ai-btn';
        saveBtn.className = 'menu-btn';
        saveBtn.style.cssText = `
            background: #2ecc71;
            margin-top: 15px;
            display: none;
            width: 100%;
            color: white;
            border: none;
            padding: 14px;
            border-radius: var(--radius, 14px);
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
        `;
        saveBtn.innerText = '💾 Додати до моїх тренувань';
        saveBtn.onclick = saveAiWorkoutToSystem;
        resultBox.appendChild(saveBtn);
    }
    saveBtn.style.display = 'none';

    // Промпт до Gemini
    const prompt = `Склади тренування українською мовою.
Ціль: ${goal}
Складність: ${level}
Місце: ${place}

Напиши рівно 5-6 вправ у форматі:
Назва вправи — X підходів x Y повторень

Без вступу, без пояснень, тільки список вправ.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 512
                    }
                })
            }
        );

        const data = await response.json();

        // Обробка помилок API
        if (data.error) {
            throw new Error(data.error.message || 'Помилка API Gemini');
        }

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('AI не повернув результат. Спробуйте ще раз.');
        }

        const aiResponse = data.candidates[0].content.parts[0].text.trim();

        spinner.style.display = 'none';
        resultText.innerText = aiResponse;
        saveBtn.style.display = 'block';

        // Зберігаємо дані тренування включно з goal/level/place для статистики
        currentGeneratedWorkout = {
            id: Date.now(),
            name: `AI: ${goal}`,
            exercises: aiResponse,
            source: 'ai',
            goal: goal,
            level: level,
            place: place,
            isCompleted: false
        };

    } catch (error) {
        spinner.style.display = 'none';

        // Зрозумілі повідомлення про помилки
        let msg = error.message;
        if (msg.includes('API key')) msg = 'Невірний API ключ Gemini.';
        else if (msg.includes('quota'))  msg = 'Перевищено ліміт запитів. Спробуйте пізніше.';
        else if (msg.includes('network') || msg.includes('fetch')) msg = 'Немає зʼєднання з інтернетом.';

        resultText.innerHTML = `<span style="color:#ff6b6b;">⚠️ ${msg}</span>`;
        console.error('AI Error:', error);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Згенерувати через AI ✨';
    }
}

function saveAiWorkoutToSystem() {
    if (!currentGeneratedWorkout) return;

    const STORAGE_KEY = 'userWorkouts';
    let allWorkouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // Перевірка на дублікат (якщо натиснули двічі)
    const alreadySaved = allWorkouts.some(w => w.id === currentGeneratedWorkout.id);
    if (alreadySaved) {
        alert('Це тренування вже збережено!');
        window.location.href = 'Create_training.html';
        return;
    }

    allWorkouts.push(currentGeneratedWorkout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allWorkouts));

    alert('✅ AI тренування збережено!');
    window.location.href = 'Create_training.html';
}