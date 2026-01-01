// Об'єкт із вправами
const exercisesByGroup = {
    chest: [
        "Жим лежачи (горизонтальний)", "Жим гантелей на похилій лаві", "Віджимання від підлоги", 
        "Розведення гантелей", "Жим у тренажері (Hammer)", "Зведення рук у кросовері", 
        "Пуловер", "Віджимання на брусах (акцент на груди)", "Жим штанги вузьким хватом", "Зведення в пеку-деку (Butterfly)"
    ],
    back: [
        "Підтягування широким хватом", "Тяга штанги в нахилі", "Станова тяга", 
        "Тяга верхнього блоку до грудей", "Тяга гантелі однією рукою", "Тяга горизонтального блоку", 
        "Гіперекстензія", "Тяга Т-грифу", "Шраги зі штангою (трапеція)", "Тяга Рейдера"
    ],
    biceps: [
        "Підйом штанги на біцепс", "Молотки (Hammer curls)", "Підйом гантелей із супінацією", 
        "Згинання на лаві Скотта", "Концентрований підйом", "Підйом гантелей сидячи (під кутом)", 
        "Згинання рук у кросовері", "Підйом штанги зворотним хватом", "Згинання 'Павук'", "Підйом EZ-штанги"
    ],
    triceps: [
        "Французький жим", "Віджимання на брусах", "Розгинання рук на верхньому блоці", 
        "Вузький жим штанги", "Розгинання гантелі через голову", "Віджимання від лави (зворотні)", 
        "Розгинання рук з канатом", "Віджимання трицепсом від підлоги", "Кік-бек з гантеллю", "Жим донизу в тренажері"
    ],
    shoulders: [
        "Армійський жим (стоячи)", "Жим гантелей сидячи", "Махи гантелями в сторони", 
        "Махи перед собою", "Махи в нахилі (задня дельта)", "Тяга штанги до підборіддя", 
        "Жим Арнольда", "Підйоми рук у кросовері", "Обертання манжети плеча", "Жим у Сміті перед собою"
    ],
    legs: [
        "Присідання зі штангою", "Випади з гантелями", "Жим ногами в тренажері", 
        "Мертва тяга (на прямих ногах)", "Розгинання ніг у тренажері", "Згинання ніг лежачи", 
        "Підйоми на носки стоячи", "Гак-присідання", "Болгарські випади", "Крокуючі випади"
    ]
};

function updateExercises() {
    const groupSelect = document.getElementById('muscle-group');
    const exerciseSelect = document.getElementById('exercise-list');
    const selectedGroup = groupSelect.value;

    // Очищуємо список вправ перед додаванням нових
    exerciseSelect.innerHTML = '<option value="" disabled selected>Оберіть вправу...</option>';

    if (exercisesByGroup[selectedGroup]) {
        exercisesByGroup[selectedGroup].forEach(ex => {
            let option = document.createElement("option");
            option.value = ex;
            option.textContent = ex;
            exerciseSelect.appendChild(option);
        });
    }
}


function addExercise() {
    const exerciseSelect = document.getElementById('exercise-list');
    const exercise = exerciseSelect.value;
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const list = document.getElementById('selected-exercises-list');

    // Перевірка, чи всі дані введені
    if (!exercise || !sets || !reps) {
        alert("Заповніть назву вправи, кількість підходів та повторень!");
        return;
    }

    let li = document.createElement("li");
    li.className = "exercise-item";
    li.innerHTML = `
        <div class="exercise-info">
            <span class="ex-name">${exercise}</span>
            <span class="ex-details">${sets} підходи × ${reps} разів</span>
        </div>
        <button onclick="this.parentElement.remove()" class="delete-btn">❌</button>
    `;
    
    list.appendChild(li);
    
    // Очищення полів після додавання
    document.getElementById('sets').value = "";
    document.getElementById('reps').value = "";
}
function finishWorkout() {
    const workoutName = document.getElementById('workout-name').value || "Моє тренування";
    const exercises = [];
    
    document.querySelectorAll('.exercise-item').forEach(item => {
        exercises.push({
            name: item.querySelector('.ex-name').textContent,
            details: item.querySelector('.ex-details').textContent
        });
    });

    if (exercises.length === 0) {
        alert("Додайте вправи!");
        return;
    }

    // Зберігаємо нове тренування (isCompleted за замовчуванням false або просто відсутнє)
    const workoutData = { 
        name: workoutName, 
        exercises: exercises, 
        isCompleted: false  // Вказуємо, що воно нове
    };
    
    localStorage.setItem('lastCreatedWorkout', JSON.stringify(workoutData));
    window.location.href = 'Create_training.html';
}