const cityInput = document.getElementById('input-city');
const searchBtn = document.getElementById('btn-search');
const weatherCardsEl = document.getElementById('weather-cards')

const API_KEY = '0da1455d9ed9eed2bab607b8c3dbad8a'; // API key for OpenWeatherMap API

const createWeatherCard = (weatherItem) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday', 'Friday','Saturday'];
    const date = new Date(weatherItem.dt_txt.split(' ')[0]);
    const dayOfWeek = days [date.getDay()];

    return `<li class="card">
    <h3 class="day-of-week">${dayOfWeek}</h3>
    <img src= "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    <h4>Weather: ${weatherItem.weather[0].main}</h4>
    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    </li>`;



}



const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays =[];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        console.log(fiveDayForecast);
        
        // Clear previous weather data from the weather cards element
        weatherCardsEl.innerHTML = '';

        // Iterate over each weather item and create weather cards
        fiveDayForecast.forEach(weatherItem => {
            weatherCardsEl.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
        });

    }).catch((error) => {
        alert('An error occurred while fetching the weather forecast!');
        console.log(error)
    });
}

const fetchCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //Get user entered city name and remove extras. 
    if(!cityName) return; // Return if cityName is empty.
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`)
        const {name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        console.log('An error occurred while fetching the coordinates!');
    });
}

searchBtn.addEventListener('click', fetchCityCoordinates)