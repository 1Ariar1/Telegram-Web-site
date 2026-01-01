    // Перевіряємо, чи є вже збережене ім'я в пам'яті
    if (localStorage.getItem('userName')) {
        // Якщо є — відправляємо користувача на головну
        window.location.href = 'Main.html';
    }
