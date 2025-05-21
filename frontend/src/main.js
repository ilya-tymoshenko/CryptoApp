// // Импортируем стили, если они есть и настроен импорт CSS в JS
// // import './style.css'; // Раскомментируйте, если используете сборщик, который это поддерживает

// // Функция для отображения приветствия
// function displayGreeting(message) {
//     const resultDiv = document.getElementById('greetingResult');
//     resultDiv.innerText = message;
// }

// // Обработчик нажатия кнопки
// document.getElementById('greetButton').addEventListener('click', () => {
//     const nameInput = document.getElementById('name');
//     const name = nameInput.value;

//     // Вызов Go-функции Greet
//     // window.go.main.App.Greet - это путь к вашей Go-функции.
//     // 'main' - это имя пакета Go (обычно 'main').
//     // 'App' - это имя вашей структуры, методы которой вы привязали.
//     // 'Greet' - это имя метода.
//     if (window.go && window.go.main && window.go.main.App && window.go.main.App.Greet) {
//         window.go.main.App.Greet(name)
//             .then(result => {
//                 displayGreeting(result);
//             })
//             .catch(err => {
//                 console.error("Ошибка при вызове Greet:", err);
//                 displayGreeting("Не удалось получить приветствие: " + err);
//             });
//     } else {
//         console.error("Функция Greet не найдена. Убедитесь, что Wails готов.");
//         displayGreeting("Ошибка: бэкенд-функция Greet не доступна.");
//     }
// });