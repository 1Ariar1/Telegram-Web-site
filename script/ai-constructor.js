const API_KEY = 'AIzaSyC1FDqj5ub8zSP4Sb63ugK0zhr33qP-yrc'; 

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    const mainAvatar = document.getElementById('main-avatar');
    
    // Синхронізація аватара (як на інших сторінках)
    const savedPhoto = localStorage.getItem('userCustomPhoto');
    if (savedPhoto) mainAvatar.src = savedPhoto;
    else if (tg.initDataUnsafe?.user?.photo_url) mainAvatar.src = tg.initDataUnsafe.user.photo_url;
    
    tg.ready();
});

let currentGeneratedWorkout = null;

async function generateWithAI() {
    const muscle = document.getElementById('ai-muscle').value;
    const level = document.getElementById('ai-level').value;
    
    const btn = document.getElementById('gen-btn');
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');
    const spinner = document.getElementById('loading-spinner');
    const saveBtn = document.getElementById('save-ai-btn');

    btn.disabled = true;
    resultBox.style.display = "block";
    spinner.style.display = "block";
    saveBtn.style.display = "none";
    resultText.innerText = "";

    // Формуємо запит для AI
    const prompt = `Склади професійне тренування. Група м'язів: ${muscle}. Складність: ${level}. 
    Напиши список з 5-6 вправ. Для кожної вправи вкажи кількість підходів та повторень. 
    Формат: Назва вправи - Підходи х Повторення.
    Пиши тільки список вправ без зайвих слів.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        spinner.style.display = "none";
        resultText.innerText = aiResponse;
        saveBtn.style.display = "block";

        // Створюємо об'єкт тренування, який ідентичний твоєму звичайному створенню
        currentGeneratedWorkout = {
            id: 'workout_' + Date.now(), // Унікальний ID
            name: `AI: ${muscle}`, // Назва для списку
            difficulty: level,
            exercises: aiResponse, // Текст вправ
            createdAt: new Date().toISOString(),
            status: 'pending' // Статус: ще не виконано
        };

    } catch (error) {
        spinner.style.display = "none";
        resultText.innerText = "Помилка зв'язку з AI. Спробуй пізніше.";
        console.error(error);
    } finally {
        btn.disabled = false;
    }
}

// Функція збереження, яка робить AI-тренування "звичайним"
function saveAiWorkoutToSystem() {
    if (!currentGeneratedWorkout) return;

    // 1. Отримуємо масив усіх створених тренувань (ключ має збігатися з твоїм основним)
    let allWorkouts = JSON.parse(localStorage.getItem('userWorkouts') || '[]');
    
    // 2. Додаємо нове згенероване тренування
    allWorkouts.push(currentGeneratedWorkout);
    
    // 3. Зберігаємо оновлений список
    localStorage.setItem('userWorkouts', JSON.stringify(allWorkouts));
    
    alert("AI-тренування успішно створено та додано до вашого списку!");
    
    // 4. Перенаправляємо на сторінку, де відображаються всі кнопки тренувань
    // (заміни 'Create_training.html' на назву своєї сторінки зі списком, якщо вона інша)
    window.location.href = 'Create_training.html'; 
}