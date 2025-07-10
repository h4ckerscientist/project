window.onload = function() {
    getLocation();
  };


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Получаем город через обратный геокодинг
          const city = await getCityName(latitude, longitude);
          document.getElementById('city').textContent = city;
          
          // Получаем погоду
          getWeather(latitude, longitude, city);
          
          // Устанавливаем время
          updateTime();
        },
        (error) => {
          console.error("Ошибка геолокации:", error);
          getLocationByIP();
        }
      );
    } else {
      getLocationByIP();
    }
  }
  
  async function getCityName(lat, lon) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village || data.address.county;
    } catch (error) {
      console.error("Ошибка получения города:", error);
      return "Неизвестный город";
    }
  }
  
  async function getLocationByIP() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      document.getElementById('city').textContent = data.city || "Неизвестный город";
      getWeather(data.latitude, data.longitude, data.city);
      updateTime();
    } catch (error) {
      console.error("Ошибка получения местоположения по IP:", error);
    }
  }

  async function getWeather(lat, lon, city) {
    const apiKey = '83fa5e074c657e1ed5b4ef64214e442f'; // Замените на ваш ключ
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`);
      const data = await response.json();
      
      const weatherInfo = `
        ${data.main.temp}°C
      `;
      document.getElementById('weather').innerHTML = weatherInfo;
    } catch (error) {
      console.error("Ошибка получения погоды:", error);
      document.getElementById('weather').textContent = "Погода недоступна";
    }
  }

  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    document.getElementById('time').textContent = timeString;
    
    // Обновляем время каждую секунду
    setTimeout(updateTime, 1000);
  }