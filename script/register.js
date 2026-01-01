document.getElementById('reg-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Збираємо всі значення
    const name = document.getElementById('user-name').value;
    const age = document.getElementById('user-age').value;
    const gender = document.getElementById('user-gender').value;
    const weight = document.getElementById('user-weight').value;
    const activity = document.getElementById('user-activity').value;

    // Зберігаємо в LocalStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userAge', age);
    localStorage.setItem('userGender', gender);
    localStorage.setItem('userWeight', weight);
    localStorage.setItem('userActivity', activity);

    // Перенаправлення
    window.location.href = 'Main.html'; 
});