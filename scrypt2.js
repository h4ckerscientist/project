// Данные о активностях
const activities = [
    {
        title: "Утренняя пробежка",
        description: "Легкая пробежка для бодрости",
        time: "morning",
        minTemp: 10,
        maxTemp: 30
    },
    {
        title: "Прогулка в парке",
        description: "Спокойная прогулка на свежем воздухе",
        time: "day",
        minTemp: 5,
        maxTemp: 35
    },
    {
        title: "Велосипедная прогулка",
        description: "Активный отдых на велосипеде",
        time: "day",
        minTemp: 15,
        maxTemp: 30
    },
    {
        title: "Посещение музея",
        description: "Культурное времяпрепровождение",
        time: "any",
        minTemp: -50,
        maxTemp: 50
    },
    {
        title: "Поход в кино",
        description: "Новый фильм в кинотеатре",
        time: "evening",
        minTemp: -50,
        maxTemp: 50
    },
    {
        title: "Катание на лыжах",
        description: "Зимний вид спорта",
        time: "day",
        minTemp: -20,
        maxTemp: 5
    },
    {
        title: "Плавание в бассейне",
        description: "Водные процедуры",
        time: "any",
        minTemp: 20,
        maxTemp: 50
    },
    {
        title: "Пикник на природе",
        description: "Отдых с друзьями на природе",
        time: "day",
        minTemp: 15,
        maxTemp: 30
    },
    {
        title: "Вечерние коктейли",
        description: "Расслабляющий вечер в баре",
        time: "evening",
        minTemp: 10,
        maxTemp: 35
    },
    {
        title: "Наблюдение за звездами",
        description: "Астрономические наблюдения",
        time: "night",
        minTemp: 5,
        maxTemp: 25
    },
    {
        title: "Йога на рассвете",
        description: "Утренние практики",
        time: "morning",
        minTemp: 10,
        maxTemp: 30
    },
    {
        title: "Катание на коньках",
        description: "Ледовый каток",
        time: "any",
        minTemp: -10,
        maxTemp: 10
    }
];

// Функция для определения времени суток
function getTimeOfDay(hours) {
    if (hours >= 5 && hours < 12) return "morning";
    if (hours >= 12 && hours < 17) return "day";
    if (hours >= 17 && hours < 22) return "evening";
    return "night";
}

// Функция для определения температурной категории
function getTempCategory(temp) {
    if (temp < 0) return "very-cold";
    if (temp < 10) return "cold";
    if (temp < 20) return "cool";
    if (temp < 30) return "warm";
    return "hot";
}

// Функция для получения текущего времени с сайта
function getCurrentTimeFromSite() {
    // Предполагаем, что время отображается в элементе с id "time-display"
    const timeElement = document.getElementById('time');
    if (!timeElement) return new Date(); // fallback
    
    const timeString = timeElement.textContent.trim();
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Создаем объект Date с текущей датой и полученным временем
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
}

// Функция для получения текущей температуры с сайта
function getCurrentTempFromSite() {
    // Предполагаем, что температура отображается в элементе с id "temp-display"
    const tempElement = document.getElementById('weather');
    if (!tempElement) return 20; // fallback
    
    const tempString = tempElement.textContent.trim();
    // Удаляем все нечисловые символы (включая °C)
    const tempValue = parseFloat(tempString.replace(/[^\d.-]/g, ''));
    return isNaN(tempValue) ? 20 : tempValue;
}

// Основная функция для обновления активностей
function updateActivities() {
    // Получаем текущее время и температуру с сайта
    const currentTime = getCurrentTimeFromSite();
    const temperature = getCurrentTempFromSite();
    const hours = currentTime.getHours();
    
    // Получаем текущее время суток
    const timeOfDay = getTimeOfDay(hours);
    const tempCategory = getTempCategory(temperature);
    
    // Фильтруем активности по времени и температуре
    const filteredActivities = activities.filter(activity => {
        const timeMatch = activity.time === "any" || activity.time === timeOfDay;
        const tempMatch = temperature >= activity.minTemp && temperature <= activity.maxTemp;
        return timeMatch && tempMatch;
    });
    
    // Отображаем подходящие активности
    displayActivities(filteredActivities, timeOfDay, tempCategory);
}

// Функция для отображения активностей
function displayActivities(activitiesToShow, timeOfDay, tempCategory) {
    const container = document.getElementById('activities-container');
    container.innerHTML = '';
    
    if (activitiesToShow.length === 0) {
        container.innerHTML = '<p>Нет подходящих активностей для текущих условий.</p>';
        return;
    }
    
    activitiesToShow.forEach(activity => {
        const card = document.createElement('div');
        card.className = `activity-card ${timeOfDay} ${tempCategory}`;
        
        card.innerHTML = `
            <div class="activity-title">${activity.title}</div>
            <div class="activity-details">${activity.description}</div>
            <div class="activity-details" style="margin-top: 10px;">
                <small>Подходит: ${activity.time === 'any' ? 'в любое время' : activity.time}</small><br>
                <small>Температура: ${activity.minTemp}°C - ${activity.maxTemp}°C</small>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Запускаем обновление активностей при загрузке страницы
document.addEventListener('DOMContentLoaded', updateActivities);

// Обновляем активности каждую минуту (на случай, если время на сайте обновляется)
setInterval(updateActivities, 60000);