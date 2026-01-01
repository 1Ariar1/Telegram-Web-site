document.addEventListener('DOMContentLoaded', function() {
    // Шукаємо збережені дані
    const savedName = localStorage.getItem('userName');
    const savedActivity = localStorage.getItem('userActivity');

    // Якщо дані є — підставляємо їх у верстку
    if (savedName) {
        const nameElement = document.querySelector('.info .name');
        if (nameElement) nameElement.textContent = savedName;
    }

    if (savedActivity) {
        const activityElement = document.querySelector('.info .activity');
        if (activityElement) activityElement.textContent = savedActivity;
    }
});