const cityInput = document.getElementById('input-city');
const searchBtn = document.getElementById('btn-search');

const API_KEY = '0da1455d9ed9eed2bab607b8c3dbad8a'; // API key for OpenWeatherMap API

const fetchCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //Get user entered city name and remove extras. 
    if(!cityName) return; // Return if cityName is empty.
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL)
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
    .catch(() => {
        alert('An error occurred while fetching the coordinates!');
    });
}

searchBtn.addEventListener('click', fetchCityCoordinates)