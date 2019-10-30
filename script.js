function updateTime() {
  let date = new Date();
  let hours = date.getHours();
  if (hours < 10) {
    hour = `0${hours}`;
  } else {
    hour = hours;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minute = `0${minutes}`;
  } else {
    minute = minutes;
  }

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

  let dayHour = document.querySelector("#dayHour");
  dayHour.innerHTML = `${day}, ${hour}:${minute}`;
}
updateTime();

function displayData(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentTemperatureElement = document.querySelector(
    "#currentTemperatureElement"
  );
  let currentLocalWeatherDes = document.querySelector("#weatherDescription");
  let currentLocalTempMax = Math.round(response.data.main.temp_max);
  let currentLocalTempMin = Math.round(response.data.main.temp_min);
  let currentLocalTempAmplitude = document.querySelector("#tempMaxMin");
  let currentLocalWind = document.querySelector("#windSpeed");
  let currentLocalHumidity = document.querySelector("#humidity");
  let currentLocalPressure = document.querySelector("#pressure");
  let currentCity = document.querySelector("#location");
  currentCity.innerHTML = response.data.name;
  currentTemperatureElement.innerHTML = `${temperature}`;
  currentLocalWeatherDes.innerHTML = response.data.weather[0].description;
  currentLocalTempAmplitude.innerHTML = `${currentLocalTempMax}º / ${currentLocalTempMin}º`;
  currentLocalWind.innerHTML = response.data.wind.speed;
  currentLocalHumidity.innerHTML = response.data.main.humidity;
  currentLocalPressure.innerHTML = response.data.main.pressure;
}
function displayByDefault() {
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = `m/s`;
  let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lisbon&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayData);
  console.log(apiUrl);
}
displayByDefault();

function inputSearch(event) {
  event.preventDefault();
  let input = document.querySelector("#searchEngine");
  if (input.value) {
    let city = document.querySelector("#location");
    city.innerHTML = input.value;
    let windUnits = document.querySelector("#windUnits");
    windUnits.innerHTML = `m/s`;
    let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayData);
  } else {
    window.location.reload(false);
  }
}

function getLocalData(position) {
  let currentPosition = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = `m/s`;
  let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?${currentPosition}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayData);
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getLocalData);
}

function convertToCelsius() {
  let displayedCity = document.querySelector("#location");
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = `m/s`;
  let apiCity = displayedCity.innerHTML;
  let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${apiCity}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayData);
}

function getImperialData(currentCity) {
  let displayedCity = document.querySelector("#location");
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = `mph`;
  let apiCity = displayedCity.innerHTML;
  let apiKey = "1c79a9c19394dbdbf78cd6d4344cc928";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${apiCity}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayData);
}

let submit = document.querySelector("#searchGlass");
submit.addEventListener("click", inputSearch);

let currentLocation = document.querySelector("#currentLocation");
currentLocation.addEventListener("click", getCurrentLocation);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertToCelsius);

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", getImperialData);
