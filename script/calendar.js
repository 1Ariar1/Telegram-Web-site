const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Визначаємо перший день місяця (0 - Нд, 1 - Пн і т.д.)
    let firstDay = new Date(year, month, 1).getDay();
    // Коригуємо під європейський стандарт (щоб Пн був першим, а не Нд)
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();

    const months = [
        "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", 
        "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
    ];

    monthYear.textContent = `${months[month]} ${year}`;

    // Отримуємо історію тренувань, щоб не робити це всередині циклу кожного разу
    const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    const trainingDates = history.map(item => item.date);

    let table = `
        <tr>
            <th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Нд</th>
        </tr>
        <tr>
    `;

    let day = 1;

    // Малюємо порожні клітинки до початку місяця
    for (let i = 0; i < firstDay; i++) {
        table += "<td></td>";
    }

    // Малюємо перший рядок
    for (let i = firstDay; i < 7; i++) {
        table += renderDay(day, trainingDates);
        day++;
    }

    table += "</tr>";

    // Малюємо решту рядків
    while (day <= lastDate) {
        table += "<tr>";
        for (let i = 0; i < 7; i++) {
            if (day <= lastDate) {
                table += renderDay(day, trainingDates);
                day++;
            } else {
                table += "<td></td>";
            }
        }
        table += "</tr>";
    }

    calendar.innerHTML = table;
}

function renderDay(d, trainingDates) {
    const today = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const dateStr = `${d.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;

    const isToday =
        d === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    const hasWorkout = trainingDates.includes(dateStr);

    let classes = [];
    if (isToday) classes.push("active"); // Фіолетовий
    if (hasWorkout) classes.push("workout-done"); // Зелений

    return `<td class='${classes.join(" ")}'>${d}</td>`;
}

document.getElementById("prev").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("next").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

renderCalendar();