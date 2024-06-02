const cityInput = document.getElementById('input-city');
const searchBtn = document.getElementById('btn-search');
const weatherCardsEl = document.getElementById('weather-cards');
const detailsEL = document.getElementById('details');
const currentWeatherEl = document.getElementById('current-weather');
const searchHistoryEl = document.getElementById('search-history')
const weatherData = document.querySelector('.weather-data')

const API_KEY = '0da1455d9ed9eed2bab607b8c3dbad8a'; // API key for OpenWeatherMap API

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

const createCurrentWeatherCard = (weatherItem) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = new Date(weatherItem.dt_txt.split(' ')[0]);
    const dayOfWeek = days[date.getDay()];
    return `
    <section id="currentDay">
        <h2> ${toTitleCase(cityInput.value)} (${dayOfWeek})</h2>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity:  ${weatherItem.main.humidity}%</h6>
    </section>
    <figure class="icon">
      <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
      <h4>Moderate Rain</h4>
    </figure>`
}


const createWeatherCard = (weatherItem) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const date = new Date(weatherItem.dt_txt.split(' ')[0]);
    const dayOfWeek = days[date.getDay()];

    return `<li class="card">
    <h3 class="day-of-week">${dayOfWeek}</h3>
    <img class="forecast-img" src= "https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
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
        console.log(data.city.name)
        const savedCitiesArray = JSON.parse(localStorage.getItem('saved-city')) || []
        const savedCitiesSet = new Set(savedCitiesArray)
        savedCitiesSet.add(data.city.name)
        const array = Array.from(savedCitiesSet);
        localStorage.setItem('saved-city', JSON.stringify(array));
        const uniqueForecastDays = [];
        const fiveDayForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        var currentWeather = fiveDayForecast[0]
        detailsEL.innerHTML = createCurrentWeatherCard(currentWeather)
        fiveDayForecast.shift()
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

const searchHistory = () => {
    const savedCitiesArray = JSON.parse(localStorage.getItem('saved-city')) || []
    savedCitiesArray.forEach(city => {
        const newBtn = document.createElement('button')
        newBtn.textContent = city
        newBtn.addEventListener('click', function(){
        cityInput.value = this.textContent
        searchBtn.click()
        })
        searchHistoryEl.appendChild(newBtn)
    })
}


const fetchCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //Get user entered city name and remove extras. 
    if (!cityName) return; // Return if cityName is empty.
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`)
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);

        currentWeatherEl.style.display = "block"
    }).catch(() => {
        console.log('An error occurred while fetching the coordinates!');
    });
}

searchBtn.addEventListener('click', fetchCityCoordinates)
searchBtn.addEventListener('click', function() {
    weatherData.classList.toggle('slide-down');
});

searchHistory()