const API_KEY = 'AIzaSyANCxDaaBGnVz6Zyf5Mg_DGL5Qt5yzW-pQ'; 

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    const mainAvatar = document.getElementById('main-avatar');
    
    // Синхронізація аватара (як у всьому додатку)
    const savedPhoto = localStorage.getItem('userCustomPhoto');
    if (savedPhoto) {
        mainAvatar.src = savedPhoto;
    } else if (tg.initDataUnsafe?.user?.photo_url) {
        mainAvatar.src = tg.initDataUnsafe.user.photo_url;
    }
    
    tg.ready();
});

let currentGeneratedWorkout = null;

async function generateWithAI() {

    const goal = document.getElementById('ai-goal').value;
    const level = document.getElementById('ai-level').value;
    const place = document.getElementById('ai-place').value;
    
    const btn = document.getElementById('gen-btn');
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');
    const spinner = document.getElementById('loading-spinner');

    // Очищення та підготовка
    btn.disabled = true;
    resultBox.style.display = "block";
    spinner.style.display = "block";
    resultText.innerText = "";

    // Створюємо кнопку збереження динамічно, якщо її немає
    let saveBtn = document.getElementById('save-ai-btn');
    if (!saveBtn) {
        saveBtn = document.createElement('button');
        saveBtn.id = 'save-ai-btn';
        saveBtn.className = 'menu-btn';
        saveBtn.style.background = '#28a745';
        saveBtn.style.marginTop = '15px';
        saveBtn.innerText = 'Додати до тренувань';
        saveBtn.onclick = saveAiWorkoutToSystem;
        saveBtn.style.display = 'none';
        resultBox.appendChild(saveBtn);
    } else {
        saveBtn.style.display = 'none';
    }

    const prompt = `Склади тренування українською мовою. Ціль: ${goal}, складність: ${level}, місце: ${place}. Напиши список з 5-6 вправ (назва - підходи х повторення). Тільки текст вправ.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`Помилка API: ${data.error.message}`);
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        spinner.style.display = "none";
        resultText.innerText = aiResponse;
        saveBtn.style.display = "block";

        // Тимчасово зберігаємо дані в об'єкт
        currentGeneratedWorkout = {
            id: Date.now(),
            name: "AI: " + goal,
            exercises: aiResponse,
            difficulty: level,
            date: new Date().toLocaleDateString('uk-UA')
        };

    } catch (error) {
        spinner.style.display = "none";
        resultText.innerHTML = `<span style="color: red;">⚠️ Помилка: ${error.message}</span>`;
        console.error("Деталі помилки:", error);
    } finally {
        btn.disabled = false;
    }
}

function saveAiWorkoutToSystem() {
    if (!currentGeneratedWorkout) return;

    // Ключ має збігатися з Create_training.html
    const STORAGE_KEY = 'userWorkouts'; 

    let allWorkouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    allWorkouts.push(currentGeneratedWorkout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allWorkouts));
    
    alert("Тренування успішно створено!");
    window.location.href = 'Create_training.html'; 
}