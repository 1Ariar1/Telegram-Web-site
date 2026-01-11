document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.choice-container');
    if (!container) return;

    const STORAGE_KEY = 'userWorkouts';
    
    // 1. Отримуємо масив усіх тренувань
    let workouts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    // 2. Перевірка на старий формат (якщо залишилося щось у lastCreatedWorkout)
    const legacyWorkout = localStorage.getItem('lastCreatedWorkout');
    if (legacyWorkout) {
        const data = JSON.parse(legacyWorkout);
        if (data && !data.isCompleted) {
            workouts.push(data); // Переносимо в загальний масив
            localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        }
        localStorage.removeItem('lastCreatedWorkout'); // Видаляємо старий ключ
    }

    // 3. Відображаємо всі активні тренування
    workouts.forEach((data, index) => {
        if (data && !data.isCompleted) {
            const newBtnAnchor = document.createElement('a');
            newBtnAnchor.href = 'View-Workout.html';
            newBtnAnchor.style.textDecoration = 'none';

            const newBtn = document.createElement('button');
            newBtn.className = 'big-btn active-workout-btn';
            
            // Якщо це AI, додаємо іконку робота, якщо ні — ракету
            const icon = data.name.includes('AI:') ? '🤖' : '🚀';
            newBtn.innerHTML = `${icon} Почати: ${data.name}`;

            // При натисканні зберігаємо саме це тренування як "активне" для View-Workout.html
            newBtn.onclick = () => {
                localStorage.setItem('current_active_workout', JSON.stringify(data));
            };

            newBtnAnchor.appendChild(newBtn);
            container.appendChild(newBtnAnchor);
        }
    });
});