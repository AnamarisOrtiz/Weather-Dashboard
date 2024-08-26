const form = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const pastSearches = document.getElementById("past-searches");
const currentSearchResult = document.getElementById("current-search-results");
const futureForecast = document.getElementById("future-forecast");
const futureForecastText = document.getElementById("future-forecast-text");

const formInput = document.querySelector(".form-input");
const apiKey = "166a433c57516f51dfab1f7edaed8413";

// Function to create the current weather card
function createCurrentWeatherCard(cityName, temp, wind, humidity, iconPath) {
    currentSearchResult.innerHTML = ''; // Clear previous results

    const cityCard = document.createElement('div');
    cityCard.classList.add('current-results-card');

    const cityNameEl = document.createElement("h3");
    cityNameEl.textContent = `${cityName} (${dayjs().format("MM/DD/YYYY")})`;

    const cityIcon = document.createElement('img');
    cityIcon.src = iconPath;
    cityIcon.alt = "weather icon image";
    cityIcon.style.width = "50px";
    cityIcon.style.height = "50px";

    const cityTemp = document.createElement("p");
    cityTemp.textContent = `Temp: ${temp}`;

    const cityWind = document.createElement("p");
    cityWind.textContent = `Wind: ${wind}`;

    const cityHumid = document.createElement("p");
    cityHumid.textContent = `Humidity: ${humidity}`;

    cityCard.append(cityNameEl, cityIcon, cityTemp, cityWind, cityHumid);
    currentSearchResult.appendChild(cityCard);
}

// Function to create the forecast card
function createForecastCard(date, temp, wind, humidity, iconPath) {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('future-results-card');

    const dateEl = document.createElement("h5");
    dateEl.textContent = date;
    dateEl.style.fontWeight = "bolder";

    const forecastIcon = document.createElement('img');
    forecastIcon.src = iconPath;
    forecastIcon.alt = "weather icon image";
    forecastIcon.style.width = "50px";
    forecastIcon.style.height = "50px";

    const forecastTemp = document.createElement("p");
    forecastTemp.textContent = `Temp: ${temp}`;

    const forecastWind = document.createElement("p");
    forecastWind.textContent = `Wind: ${wind}`;

    const forecastHumid = document.createElement("p");
    forecastHumid.textContent = `Humidity: ${humidity}`;

    forecastCard.append(dateEl, forecastIcon, forecastTemp, forecastWind, forecastHumid);
    futureForecast.appendChild(forecastCard);
}

// Fetch and display current weather data
function fetchCurrentWeather(query) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=imperial`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp + " °F";
            const wind = data.wind.speed + " MPH";
            const humidity = data.main.humidity + " %";
            const iconPath = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            createCurrentWeatherCard(data.name, temp, wind, humidity, iconPath);
        });
}

// Fetch and display future forecast data
function fetchFutureForecast(query) {
    const forecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&cnt=5&appid=${apiKey}&units=imperial`;
    fetch(forecastApi)
        .then(response => response.json())
        .then(data => {
            futureForecast.innerHTML = ''; // Clear previous forecasts
            const fiveDayForcastText = document.createElement("h3");
            fiveDayForcastText.innerHTML = "5-Day Forcast:";
            futureForecastText.innerHTML = '';
            futureForecastText.appendChild(fiveDayForcastText);
            data.list.forEach((forecast) => {
                const date = dayjs.unix(forecast.dt).format("MM/DD/YYYY");
                const temp = forecast.main.temp + " °F";
                const wind = forecast.wind.speed + " MPH";
                const humidity = forecast.main.humidity + " %";
                const iconPath = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
                createForecastCard(date, temp, wind, humidity, iconPath);
            });
        });
}

// Load past searches and display them
function loadPastSearches() {
    const pSearches = JSON.parse(window.localStorage.getItem('pastSearches')) || [];
    pastSearches.innerHTML = '';
    pSearches.slice(-5).forEach((search) => {
        const pastSearch = document.createElement("p");
        pastSearch.textContent = search;
        pastSearch.addEventListener('click', function (event) {
            event.preventDefault();
            const query = event.target.textContent.trim();
            if (query) {
                clearCurrentSearchResults();
                fetchCurrentWeather(query);
                fetchFutureForecast(query);
            }
        });
        pastSearches.appendChild(pastSearch);
    });
}

// Add searched query to localStorage
function addSearchedQuery(query) {
    const items = JSON.parse(window.localStorage.getItem('pastSearches')) || [];
    items.push(query);
    window.localStorage.setItem('pastSearches', JSON.stringify(items));
}

// Clear search results and local storage
function clearStorage() {
    window.localStorage.removeItem('pastSearches');
}

// Event listener for search button
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const query = formInput.value.trim();
    if (query) {
        clearCurrentSearchResults();
        addSearchedQuery(query);
        loadPastSearches();
        fetchCurrentWeather(query);
        fetchFutureForecast(query);
    }
});

// Clear current search results
function clearCurrentSearchResults() {
    currentSearchResult.innerHTML = '';
    futureForecast.innerHTML = '';
}

// Load past searches on page load
loadPastSearches();
//window.addEventListener('beforeunload', clearStorage);
