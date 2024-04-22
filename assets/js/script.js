const cityInput = document.getElementById('input-city');
const searchBtn = document.getElementById('btn-search');

const API_KEY = '0da1455d9ed9eed2bab607b8c3dbad8a'; // API key for OpenWeatherMap API
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

    }).catch(() => {
        alert('An error occurred while fetching the weather forecast!');
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
        alert('An error occurred while fetching the coordinates!');
    });
}

searchBtn.addEventListener('click', fetchCityCoordinates)