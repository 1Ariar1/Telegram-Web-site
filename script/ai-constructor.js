const API_KEY = 'AIzaSyC1FDqj5ub8zSP4Sb63ugK0zhr33qP-yrc'; // Отримай на https://aistudio.google.com/

document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    const mainAvatar = document.getElementById('main-avatar');
    
    // Синхронізація аватара
    const savedPhoto = localStorage.getItem('userCustomPhoto');
    if (savedPhoto) mainAvatar.src = savedPhoto;
    else if (tg.initDataUnsafe?.user?.photo_url) mainAvatar.src = tg.initDataUnsafe.user.photo_url;
    
    tg.ready();
});

async function generateWithAI() {
    const goal = document.getElementById('ai-goal').value;
    const level = document.getElementById('ai-level').value;
    const place = document.getElementById('ai-place').value;
    
    const btn = document.getElementById('gen-btn');
    const resultBox = document.getElementById('result-box');
    const resultText = document.getElementById('result-text');
    const spinner = document.getElementById('loading-spinner');

    // Налаштування інтерфейсу
    btn.disabled = true;
    resultBox.style.display = "block";
    spinner.style.display = "block";
    resultText.innerText = "";

    const prompt = `Склади тренування для користувача. Ціль: ${goal}. Рівень складності: ${level}. Місце: ${place}. 
    Напиши список з 5 вправ, кількість підходів та повторень. Пиши українською мовою.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        spinner.style.display = "none";
        resultText.innerText = aiResponse;
    } catch (error) {
        spinner.style.display = "none";
        resultText.innerText = "Помилка зв'язку з AI. Перевір API Key або інтернет.";
        console.error(error);
    } finally {
        btn.disabled = false;
    }
}