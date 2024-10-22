const API_KEY = "f0f4784fb3b719230f37e603ef552358"; // Your API key
const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric";

document.getElementById("fetchButton").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    if (city) {
        fetchWeather(city);
    } else {
        displayError("Please enter a city name.");
    }
});

async function fetchWeather(city) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.classList.remove("hidden");
    loadingIndicator.classList.add("show");

    const url = API_URL.replace("%s", city).replace("%s", API_KEY);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found");
            } else {
                throw new Error("Unable to fetch weather data");
            }
        }
        
        const data = await response.json();
        const weather = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const rain = data.rain ? data.rain["1h"] : 0; // Check for rain

        displayWeather(weather, temperature, humidity, windSpeed, rain);
    } catch (error) {
        displayError("Error fetching weather data: " + error.message);
    } finally {
        loadingIndicator.classList.add("hidden");
    }
}

function displayWeather(weather, temperature, humidity, windSpeed, rain) {
    const weatherOutput = document.getElementById("weatherOutput");
    const weatherDetails = document.querySelector(".weather-details");
    const rainMessage = rain > 0 ? "It might rain today." : "No rain expected today.";
    
    weatherDetails.innerHTML = `
        <h2>${temperature} °C</h2>
        <p>${weather.charAt(0).toUpperCase() + weather.slice(1)}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>${rainMessage}</p>
    `;
    
    weatherOutput.classList.remove("hidden");
    weatherOutput.classList.add("show");
    hideError();

    updateBackground(weather);
}

function updateBackground(weather) {
    const body = document.body;
    body.classList.remove("cloudy", "rainy", "sunny");

    if (weather.includes("cloud")) {
        body.classList.add("cloudy");
    } else if (weather.includes("rain")) {
        body.classList.add("rainy");
    } else if (weather.includes("clear") || weather.includes("sun")) {
        body.classList.add("sunny");
    } else {
        body.classList.add("cloudy");
    }
}

function displayError(message) {
    const errorOutput = document.getElementById("errorOutput");
    errorOutput.innerHTML = message;
    errorOutput.classList.remove("hidden");
    errorOutput.classList.add("show");
    hideWeather();
}

function hideWeather() {
    const weatherOutput = document.getElementById("weatherOutput");
    weatherOutput.classList.remove("show");
    weatherOutput.classList.add("hidden");
}

function hideError() {
    const errorOutput = document.getElementById("errorOutput");
    errorOutput.classList.remove("show");
    errorOutput.classList.add("hidden");
}
