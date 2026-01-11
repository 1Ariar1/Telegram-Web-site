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

    btn.disabled = true;
    resultBox.style.display = "block";
    spinner.style.display = "block";
    resultText.innerText = "";

    let saveBtn = document.getElementById('save-ai-btn');
    if (!saveBtn) {
        saveBtn = document.createElement('button');
        saveBtn.id = 'save-ai-btn';
        saveBtn.className = 'menu-btn';
        saveBtn.style.cssText = "background: #2ecc71; margin-top: 15px; display: none; width: 100%; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold;";
        saveBtn.innerText = 'Додати до моїх тренувань';
        saveBtn.onclick = saveAiWorkoutToSystem;
        resultBox.appendChild(saveBtn);
    }

    const prompt = `Склади тренування українською мовою. Ціль: ${goal}, складність: ${level}, місце: ${place}. Напиши список з 5-6 вправ (назва - підходи х повторення). Без вступу.`;

    try {
        // ВИПРАВЛЕНО: посилання змінено з v1beta на v1
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        spinner.style.display = "none";
        resultText.innerText = aiResponse;
        saveBtn.style.display = "block";

        currentGeneratedWorkout = {
            id: Date.now(),
            name: "AI: " + goal,
            exercises: aiResponse,
            difficulty: level,
            isCompleted: false
        };
    } catch (error) {
        spinner.style.display = "none";
        resultText.innerHTML = `<span style="color: #ff4d4d;">⚠️ Помилка: ${error.message}</span>`;
        console.error("AI Error:", error);
    } finally {
        btn.disabled = false;
    }
}

function saveAiWorkoutToSystem() {
    if (!currentGeneratedWorkout) return;

    const STORAGE_KEY = 'userWorkouts'; 
    let allWorkouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Додаємо статус, щоб save-train.js його бачив
    currentGeneratedWorkout.isCompleted = false; 
    
    allWorkouts.push(currentGeneratedWorkout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allWorkouts));
    
    alert("AI тренування збережено!");
    window.location.href = 'Create_training.html'; 
}