// Event Listener for the Get Weather Button
document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '759b0514174e82ac32473e50bcb04a80'; // Replace with your OpenWeatherMap API key

    // Fetch current weather data
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weather = `
                    <h2>${data.name}</h2>
                    <p>Temperature: ${data.main.temp}°C</p>
                    <p>Conditions: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                `;
                document.getElementById('weatherResult').innerHTML = weather;

                // Fetch 5-day forecast data
                fetchForecast(city, apiKey);
            } else {
                document.getElementById('weatherResult').innerHTML = '<p>City not found.</p>';
                document.getElementById('forecastResult').innerHTML = '';
            }
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = '<p>There was an error fetching the weather data.</p>';
            document.getElementById('forecastResult').innerHTML = '';
            console.error('Error fetching weather data:', error);
        });
});

// Event Listener for the Info Button
document.getElementById('infoBtn').addEventListener('click', function() {
    const infoContent = document.getElementById('infoContent');
    infoContent.classList.toggle('hidden');
});

// Function to Fetch 5-Day Forecast Data
function fetchForecast(city, apiKey) {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecastApiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastList = data.list;
            const dailyForecast = {};

            // Aggregate forecast data to get daily summaries
            forecastList.forEach(item => {
                const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                });

                if (!dailyForecast[date]) {
                    dailyForecast[date] = {
                        temp_min: item.main.temp_min,
                        temp_max: item.main.temp_max,
                        description: item.weather[0].description,
                        icon: item.weather[0].icon
                    };
                } else {
                    dailyForecast[date].temp_min = Math.min(dailyForecast[date].temp_min, item.main.temp_min);
                    dailyForecast[date].temp_max = Math.max(dailyForecast[date].temp_max, item.main.temp_max);
                }
            });

            // Display the 5-day forecast
            let forecastHTML = '<h2>5-Day Forecast</h2>';
            Object.keys(dailyForecast).forEach(date => {
                const dayForecast = dailyForecast[date];
                forecastHTML += `
                    <div class="forecast-day">
                        <h3>${date}</h3>
                        <p>Temperature: ${dayForecast.temp_min}°C - ${dayForecast.temp_max}°C</p>
                        <p>Conditions: ${dayForecast.description}</p>
                    </div>
                `;
            });

            document.getElementById('forecastResult').innerHTML = forecastHTML;
        })
        .catch(error => {
            document.getElementById('forecastResult').innerHTML = '<p>There was an error fetching the forecast data.</p>';
            console.error('Error fetching forecast data:', error);
        });
}
