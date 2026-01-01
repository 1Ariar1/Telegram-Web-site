function handleInvite(selectElement) {
    const url = selectElement.value;
    if (!url) return;

    // Копіювання посилання в буфер обміну
    navigator.clipboard.writeText(url).then(() => {
        alert("Посилання скопійовано: " + url);
    }).catch(err => {
        // Якщо браузер заблокував копіювання, просто показуємо посилання
        prompt("Скопіюйте посилання звідси:", url);
    });

    // Повертаємо селект у початковий стан
    selectElement.selectedIndex = 0;
}

//код для дати та профілю
document.addEventListener('DOMContentLoaded', function() {
    // Виведення поточної дати
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('uk-UA', options);
    }

    // Виведення даних профілю
    const dataMap = {
        'userName': 'display-name',
        'userAge': 'display-age',
        'userGender': 'display-gender',
        'userWeight': 'display-weight',
        'userActivity': 'display-activity'
    };

    for (const [key, id] of Object.entries(dataMap)) {
        const val = localStorage.getItem(key);
        if (val) document.getElementById(id).textContent = val;
    }
});