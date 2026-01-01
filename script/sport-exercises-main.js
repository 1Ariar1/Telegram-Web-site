const exerciseList = [
    "https://image.tuasaude.com/media/article/ox/hv/full-body-dumbbell-workout_44481.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/oi/lx/full-body-dumbbell-workout_44475.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/kp/fo/full-body-dumbbell-workout_44483.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/sv/jz/full-body-dumbbell-workout_44478.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/xa/te/chest-workout_44360.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/rh/ho/chest-workout_44358.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/ds/pf/chest-workout_44361.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/dw/pt/chest-workout_44359.gif?width=1372&height=974",
    "https://image.tuasaude.com/media/article/xz/ku/chest-workout_44357.gif?width=1372&height=974",
    "https://i.pinimg.com/originals/a0/11/20/a01120423ce7cab0379e4c5a31d3bc37.gif",
    "https://fitnessprogramer.com/wp-content/uploads/2022/02/Incline-Dumbbell-Hammer-Row.gif",
    "https://fitliferegime.com/wp-content/uploads/2023/10/Chest-Supported-T-Bar-Row.gif",
    "https://media.tenor.com/2NYcfHsikFcAAAAM/seated-row.gif" 
];

function updateExercises() {
    const images = document.querySelectorAll('#exercise-gallery .small-image img');
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());

    images.forEach((img, index) => {
        // 1. Плавно скрываем картинку
        img.style.opacity = '0';

        setTimeout(() => {
            if (shuffled[index]) {
                // 2. Меняем источник
                img.src = shuffled[index];
                
                // 3. Плавно проявляем после загрузки
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                // Запасной вариант для кэшированных фото
                setTimeout(() => { img.style.opacity = '1'; }, 300);
            }
        }, 500);
    });
}

setInterval(updateExercises, 10000);
window.addEventListener('load', updateExercises);