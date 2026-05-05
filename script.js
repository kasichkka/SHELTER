// Получаем форму по id
const helpForm = document.getElementById('helpForm');

// Проверяем, существует ли форма на странице
if (helpForm) {
    helpForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        // Отменяем стандартную отправку формы (без перезагрузки страницы)

        const name = document.getElementById('name').value; 
        // Получаем значение поля "имя"

        alert(`Спасибо, ${name}! Ваша заявка успешно отправлена. Мы скоро с вами свяжемся! ❤️`);
        // Показываем уведомление пользователю

        this.reset(); 
        // Очищаем форму после отправки
    });
}


// Срабатывает после полной загрузки HTML-документа
document.addEventListener('DOMContentLoaded', () => {

    // Проверяем, есть ли на странице блок с животными
    if (document.getElementById('animalsGrid')) {
        loadAnimals(); 
        // Загружаем список животных
    }
});


// Функция загрузки животных из XML
function loadAnimals(filterType = 'all') {

    const grid = document.getElementById('animalsGrid');
    // Получаем контейнер для карточек

    if (!grid) return; 
    // Если контейнера нет — прекращаем выполнение

    fetch('animals.xml') 
    // Загружаем XML-файл

        .then(response => {
            if (!response.ok) throw new Error('Файл XML не найден');
            // Проверка, найден ли файл

            return response.text(); 
            // Преобразуем ответ в текст
        })

        // Преобразуем текст XML в структуру DOM
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))

        .then(data => {

            const animals = data.getElementsByTagName('animal');
            // Получаем список всех животных

            grid.innerHTML = ''; 
            // Очищаем контейнер перед загрузкой новых данных

            // Перебираем всех животных
            for (let animal of animals) {

                const type = animal.getAttribute('type'); 
                // Получаем тип (кот, собака и т.д.)

                // Фильтрация по типу
                if (filterType !== 'all' && filterType !== type) continue;

                // Получаем данные из XML
                const name = animal.getElementsByTagName('name')[0].textContent;
                const desc = animal.getElementsByTagName('description')[0].textContent;
                const tag = animal.getElementsByTagName('tag')[0].textContent;
                const img = animal.getElementsByTagName('image')[0].textContent;

                // Создаем карточку
                const card = document.createElement('div');
                card.className = 'animal-card';

                // Заполняем карточку HTML-разметкой
                card.innerHTML = `
                    <div class="animal-photo">
                        <img src="${img}" alt="${name}">
                    </div>
                    <div class="animal-info">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <span class="tag">${tag}</span>
                    </div>
                `;

                // Добавляем карточку на страницу
                grid.appendChild(card);
            }
        })

        // Обработка ошибок
        .catch(err => console.error('Ошибка:', err));
}


// Функция фильтрации животных
function filterAnimals(event, type) {

    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.filter-btn')
        .forEach(btn => btn.classList.remove('active'));

    // Добавляем активный класс на нажатую кнопку
    event.currentTarget.classList.add('active');

    // Перезагружаем список с выбранным фильтром
    loadAnimals(type);
}


// Переключатель темы
const btn = document.getElementById('theme-toggle');

// Обработка клика по переключателю
btn.onclick = () => {

    document.body.classList.toggle('dark-theme'); 
    // Переключаем тёмную тему

    // Сохраняем выбор пользователя в localStorage
    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    );
};


// При загрузке страницы проверяем сохраненную тему
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    // Если ранее была выбрана тёмная тема — включаем её
}