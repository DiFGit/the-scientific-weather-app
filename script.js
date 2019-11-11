function updateTime(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayHour = document.querySelector("#day-hour");
  dayHour.innerHTML = `${day}, ${hours}:${minutes}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastDay = days[day + 1];
  if (day == 6) {
    forecastDay = days[0];
  }
  return `${forecastDay}`;
}

function displayData(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentLocalTempMax = Math.round(response.data.main.temp_max);
  let currentLocalTempMin = Math.round(response.data.main.temp_min);
  let icon = response.data.weather[0].icon;
  let localDate = response.data.dt * 1000 + response.data.timezone * 1000;
  currentCity.innerHTML = response.data.name;
  currentTemperatureElement.innerHTML = `${temperature}`;
  currentLocalWeatherDes.innerHTML = response.data.weather[0].description;
  currentLocalTempAmplitude.innerHTML = `${currentLocalTempMax}º / ${currentLocalTempMin}º`;
  currentLocalWind.innerHTML = response.data.wind.speed;
  currentLocalHumidity.innerHTML = response.data.main.humidity;
  currentLocalPressure.innerHTML = response.data.main.pressure;
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${icon}@2x.png`
  );
  updateTime(localDate);
  getCityImage(response.data.name);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  forecast = null;
  for (let index = 0; index < 40; index += 8) {
    forecast = response.data.list[index];
    timezone = response.data.city.timezone * 1000;
    forecastElement.innerHTML += `
    <div class="col col-lg-2">
      <div id="forecast-date">${formatForecastDay(
        forecast.dt * 1000 + timezone
      )}</div>
      <img src="http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png"; class="forecastIcon" id="forecast-icon"/>
      <div id="forecast-main-temp">${Math.round(forecast.main.temp)}º</dvi>
    </div>`;
  }
}

function displayByDefault() {
  windUnits.innerHTML = `m/s`;
  let weatherApiUrl = `${apiUrl}weather?q=Lisbon&appid=${apiKey}&units=metric`;
  axios.get(weatherApiUrl).then(displayData);
  let apiForecastUrl = `${apiUrl}forecast?q=Lisbon&appid=${apiKey}&units=metric`;
  axios.get(apiForecastUrl).then(displayForecast);
}

function inputSearch(event) {
  event.preventDefault();
  let input = document.querySelector("#search-engine");
  if (input.value) {
    let city = document.querySelector("#location");
    city.innerHTML = input.value;
    windUnits.innerHTML = `m/s`;
    celsius.classList.add("active");
    celsius.classList.remove("inactive");
    fahrenheit.classList.remove("active");
    fahrenheit.classList.add("inactive");
    let weatherApiUrl = `${apiUrl}weather?q=${input.value}&appid=${apiKey}&units=metric`;
    axios.get(weatherApiUrl).then(displayData);
    let apiForecastUrl = `${apiUrl}forecast?q=${input.value}&appid=${apiKey}&units=metric`;
    axios.get(apiForecastUrl).then(displayForecast);
  } else {
    window.location.reload(false);
  }
}

function getLocalData(position) {
  let currentPosition = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  windUnits.innerHTML = `m/s`;
  celsius.classList.add("active");
  celsius.classList.remove("inactive");
  fahrenheit.classList.remove("active");
  fahrenheit.classList.add("inactive");
  let weatherApiUrl = `${apiUrl}weather?${currentPosition}&appid=${apiKey}&units=metric`;
  axios.get(weatherApiUrl).then(displayData);
  let apiForecastUrl = `${apiUrl}forecast?${currentPosition}&appid=${apiKey}&units=metric`;
  axios.get(apiForecastUrl).then(displayForecast);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getLocalData);
}

function convertToCelsius() {
  let displayedCity = document.querySelector("#location");
  windUnits.innerHTML = `m/s`;
  celsius.classList.add("active");
  celsius.classList.remove("inactive");
  fahrenheit.classList.remove("active");
  fahrenheit.classList.add("inactive");
  let apiCity = displayedCity.innerHTML;
  let weatherApiUrl = `${apiUrl}weather?q=${apiCity}&appid=${apiKey}&units=metric`;
  axios.get(weatherApiUrl).then(displayData);
  let apiForecastUrl = `${apiUrl}forecast?q=${apiCity}&appid=${apiKey}&units=metric`;
  axios.get(apiForecastUrl).then(displayForecast);
}

function getImperialData(currentCity) {
  event.preventDefault();
  let displayedCity = document.querySelector("#location");
  windUnits.innerHTML = `mph`;
  celsius.classList.remove("active");
  celsius.classList.add("inactive");
  fahrenheit.classList.add("active");
  fahrenheit.classList.remove("inactive");
  let apiCity = displayedCity.innerHTML;
  let weatherApiUrl = `${apiUrl}weather?q=${apiCity}&appid=${apiKey}&units=imperial`;
  axios.get(weatherApiUrl).then(displayData);
  let apiForecastUrl = `${apiUrl}forecast?q=${apiCity}&appid=${apiKey}&units=imperial`;
  axios.get(apiForecastUrl).then(displayForecast);
}

function displayCityImage(response) {
  let background = document.querySelector("#background-image");
  let imageUrl = response.data.photos[3].src.portrait;
  if (imageUrl.protocol == "http:") {
    location.href = location.href.replace(`http:`, `https:`);
  }
  background.setAttribute("src", imageUrl);
}

function displayUndefinedImage(error) {
  let background = document.querySelector("#background-image");
  let undefinedImage =
    "https://images.pexels.com/photos/1078850/pexels-photo-1078850.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
  background.setAttribute("src", undefinedImage);
}

function getCityImage(city) {
  axios({
    method: "get",
    url: `https://api.pexels.com/v1/search?query=${city}+query&per_page=15&page=1`,
    headers: {
      Authorization: "563492ad6f91700001000001ea246cab4f4645409f66c0be39fbe2b1"
    }
  })
    .then(displayCityImage)
    .catch(displayUndefinedImage);
}

let windUnits = document.querySelector("#wind-units");
let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
let apiUrl = `https://api.openweathermap.org/data/2.5/`;
let submit = document.querySelector("#search-form");
let currentLocation = document.querySelector("#current-location");
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
let currentTemperatureElement = document.querySelector(
  "#current-temperature-element"
);
let currentLocalWeatherDes = document.querySelector("#weather-description");
let currentLocalTempAmplitude = document.querySelector("#temp-max-min");
let currentLocalWind = document.querySelector("#wind-speed");
let currentLocalHumidity = document.querySelector("#humidity");
let currentLocalPressure = document.querySelector("#pressure");
let currentCity = document.querySelector("#location");
let currentWeatherIcon = document.querySelector("#weather-icon");

displayByDefault();
submit.addEventListener("submit", inputSearch);
currentLocation.addEventListener("click", getCurrentLocation);
celsius.addEventListener("click", convertToCelsius);
fahrenheit.addEventListener("click", getImperialData);
