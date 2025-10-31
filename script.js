class WeatherApp {
    constructor() {
        this.weatherData = {
            'london': { name: 'London', country: 'GB', temp: 15, feels_like: 13, humidity: 72, wind_speed: 3.2, visibility: 10, weather: 'Clouds', description: 'overcast clouds' },
            'new york': { name: 'New York', country: 'US', temp: 22, feels_like: 25, humidity: 65, wind_speed: 4.1, visibility: 16, weather: 'Clear', description: 'clear sky' },
            'tokyo': { name: 'Tokyo', country: 'JP', temp: 28, feels_like: 32, humidity: 78, wind_speed: 2.8, visibility: 8, weather: 'Rain', description: 'light rain' },
            'paris': { name: 'Paris', country: 'FR', temp: 18, feels_like: 16, humidity: 68, wind_speed: 3.5, visibility: 12, weather: 'Clouds', description: 'few clouds' },
            'sydney': { name: 'Sydney', country: 'AU', temp: 25, feels_like: 27, humidity: 60, wind_speed: 5.2, visibility: 20, weather: 'Clear', description: 'clear sky' },
            'mumbai': { name: 'Mumbai', country: 'IN', temp: 32, feels_like: 38, humidity: 85, wind_speed: 2.1, visibility: 6, weather: 'Rain', description: 'heavy rain' },
            'dubai': { name: 'Dubai', country: 'AE', temp: 38, feels_like: 45, humidity: 45, wind_speed: 4.8, visibility: 15, weather: 'Clear', description: 'clear sky' },
            'moscow': { name: 'Moscow', country: 'RU', temp: 8, feels_like: 5, humidity: 80, wind_speed: 6.2, visibility: 5, weather: 'Snow', description: 'light snow' }
        };
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentDate();
        this.loadDefaultWeather();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.cityName = document.getElementById('cityName');
        this.currentDate = document.getElementById('currentDate');
        this.temp = document.getElementById('temp');
        this.description = document.getElementById('description');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.visibility = document.getElementById('visibility');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.feelsLike = document.getElementById('feelsLike');
        this.forecastGrid = document.getElementById('forecastGrid');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        this.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    loadDefaultWeather() {
        this.getWeatherByCity('London');
    }

    searchWeather() {
        const city = this.cityInput.value.trim();
        if (city) {
            this.getWeatherByCity(city);
            this.cityInput.value = '';
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getWeatherByCity('New York'); // Default to New York for demo
                },
                (error) => {
                    alert('Unable to get your location. Showing New York weather.');
                    this.getWeatherByCity('New York');
                }
            );
        } else {
            alert('Geolocation not supported. Showing New York weather.');
            this.getWeatherByCity('New York');
        }
    }

    getWeatherByCity(city) {
        const cityKey = city.toLowerCase();
        const data = this.weatherData[cityKey];
        
        if (data) {
            this.updateCurrentWeather(data);
            this.updateForecast(data);
        } else {
            alert('City not found. Try: London, New York, Tokyo, Paris, Sydney, Mumbai, Dubai, or Moscow');
        }
    }

    updateCurrentWeather(data) {
        this.cityName.textContent = `${data.name}, ${data.country}`;
        this.temp.textContent = Math.round(data.temp);
        this.description.textContent = data.description;
        this.visibility.textContent = `${data.visibility} km`;
        this.humidity.textContent = `${data.humidity}%`;
        this.windSpeed.textContent = `${data.wind_speed.toFixed(1)} km/h`;
        this.feelsLike.textContent = `${Math.round(data.feels_like)}°C`;
        
        this.updateWeatherIcon(data.weather);
    }

    updateWeatherIcon(weatherMain) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-drizzle',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Haze': 'fas fa-smog'
        };
        
        this.weatherIcon.className = iconMap[weatherMain] || 'fas fa-sun';
    }

    updateForecast(data) {
        this.forecastGrid.innerHTML = '';
        
        const forecasts = [
            { day: 'Today', weather: data.weather, desc: data.description, high: data.temp + 2, low: data.temp - 3 },
            { day: 'Tomorrow', weather: 'Clear', desc: 'sunny', high: data.temp + 5, low: data.temp },
            { day: 'Wed', weather: 'Clouds', desc: 'cloudy', high: data.temp + 1, low: data.temp - 2 },
            { day: 'Thu', weather: 'Rain', desc: 'light rain', high: data.temp - 2, low: data.temp - 5 },
            { day: 'Fri', weather: 'Clear', desc: 'clear sky', high: data.temp + 3, low: data.temp - 1 }
        ];
        
        forecasts.forEach(forecast => {
            const forecastItem = this.createForecastItem(forecast);
            this.forecastGrid.appendChild(forecastItem);
        });
    }

    createForecastItem(forecast) {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${forecast.day}</div>
            <div class="forecast-icon">
                <i class="${this.getForecastIcon(forecast.weather)}"></i>
            </div>
            <div class="forecast-desc">${forecast.desc}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${Math.round(forecast.high)}°</span>
                <span class="forecast-low">${Math.round(forecast.low)}°</span>
            </div>
        `;
        
        return forecastItem;
    }

    getForecastIcon(weatherMain) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-drizzle',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Haze': 'fas fa-smog'
        };
        
        return iconMap[weatherMain] || 'fas fa-sun';
    }
}

// Initialize the weather app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});