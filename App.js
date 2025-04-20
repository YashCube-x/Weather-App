const inputBox = document.querySelector('input');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temprature');
const description = document.querySelector('.discripton');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Create a new element for the city name if it doesn't exist yet
let cityNameElement = document.querySelector('.city-name');
if (!cityNameElement) {
    cityNameElement = document.createElement('p');
    cityNameElement.className = 'city-name';
    // Insert it right before the temperature in the weather-box
    const weatherBox = document.querySelector('.weather-box');
    weatherBox.insertBefore(cityNameElement, temperature);
}

// Function to get full country name from country code
function getCountryName(countryCode) {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    try {
        return regionNames.of(countryCode);
    } catch (error) {
        console.error("Error getting country name:", error);
        return countryCode; // Return the code if unable to get the name
    }
}

async function checkWeather(city) {
    if (!city.trim()) return; // Don't search if the input is empty
    
    // Add loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
    
    const api_key = "5926e2ef11417d396e60b8b3c3aa547e";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        // Remove loading state
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.disabled = false;

        if (weather_data.cod === "404") {
            weather_body.style.display = "none";
            location_not_found.style.display = "flex";
            console.log("Location not found");
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        
        // Display the city name with full country name
        const countryFullName = getCountryName(weather_data.sys.country);
        cityNameElement.textContent = `${weather_data.name}, ${countryFullName}`;
        
        temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}<sup>°C</sup>`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

        // Clear the input box after successful search
        inputBox.value = "";

        switch (weather_data.weather[0].main) {
            case 'Clouds':
                weather_img.src = "cloud.png";
                break;
            case 'Clear':
                weather_img.src = "clear.png";
                break;
            case 'Rain':
                weather_img.src = "rain.png";
                break;
            case 'Mist':
                weather_img.src = "mist.png";
                break;
            case 'Snow':
                weather_img.src = "snow.png";
                break;
            case 'Thunderstorm':
                weather_img.src = "thunderstorm.png";
                break;
            case 'Drizzle':
                weather_img.src = "rain.png";
                break;
            default:
                weather_img.src = "clear.png";
                break;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        // Remove loading state and show error
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.disabled = false;
    }
}

// Event listener for the search button
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Event listener for the Enter key
inputBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }
});

// Initialize with default display state
location_not_found.style.display = "none";
weather_body.style.display = "none";