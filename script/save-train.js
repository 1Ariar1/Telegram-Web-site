document.addEventListener('DOMContentLoaded', function() {
    const savedWorkout = localStorage.getItem('lastCreatedWorkout');
    
    if (savedWorkout) {
        const data = JSON.parse(savedWorkout);
        
        // Перевіряємо, чи тренування існує і чи воно НЕ завершене
        if (data && !data.isCompleted) {
            const container = document.querySelector('.choice-container'); 
            
            // Створюємо посилання-обгортку
            const newBtnAnchor = document.createElement('a');
            newBtnAnchor.href = 'View-Workout.html';
            newBtnAnchor.style.textDecoration = 'none'; // Прибираємо підкреслення

            // Створюємо саму кнопку
            const newBtn = document.createElement('button');
            newBtn.className = 'big-btn active-workout-btn';
            newBtn.innerHTML = `🚀 Почати: ${data.name}`;
            
            // Додаємо кнопку в якір, а якір — в КІНЕЦЬ контейнера
            newBtnAnchor.appendChild(newBtn);
            container.appendChild(newBtnAnchor); // appendChild додає в кінець (знизу)
        }
    }
});