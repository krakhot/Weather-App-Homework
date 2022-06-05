let now = new Date();
let currentTime = document.querySelector("#current-time");
let currentDate = document.querySelector("#current-date");
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");

let searchCityForm = document.querySelector("#city-form");

let displayedCity = document.querySelector("#displayed-city");
let tempToday = document.querySelector("#temp-today");
let descriptionToday = document.querySelector("#description-today");

let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// maybe make this one better ahem...
let nextDay1 = document.querySelector("#next-day1");
let nextDay2 = document.querySelector("#next-day2");
let nextDay3 = document.querySelector("#next-day3");
let nextDay4 = document.querySelector("#next-day4");
let nextDay5 = document.querySelector("#next-day5");
let followingDays = [nextDay1, nextDay2, nextDay3, nextDay4, nextDay5];

let currentPositionButton = document.querySelector("#current-position");

let apiKey = "6012fc2491a7112eae2e7a250ec9ffa1";
let unit = "metric";

function formatDate(date) {
  let currentDate = date.getDate();
  let currentMonth = date.getMonth();
  if (currentMonth < 10) {
    currentMonth = `0${currentMonth + 1}`;
  }
  let currentYear = date.getFullYear();
  let formattedDate = `${currentDate}.${currentMonth}.${currentYear} `;
  return formattedDate;
}
function formatTime(time) {
  let currentDay = weekDays[time.getDay()];
  let currentHour = time.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = time.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let formattedTime = `${currentDay} ${currentHour}:${currentMinutes}`;
  return formattedTime;
}

//update the time and date to today
currentTime.innerHTML = formatTime(now);
currentDate.innerHTML = formatDate(now);

//temperature settings
// TO UPDATE BECAUSE ITS BROKEN AHEM
function changeToCelsius(event) {
  event.preventDefault();
  tempToday.innerHTML = 19;
}
function changeToFahrenheit(event) {
  event.preventDefault();
  let temp = tempToday.innerHTML;
  tempToday.innerHTML = Math.round((temp * 9) / 5 + 32);
}

celsiusLink.addEventListener("click", changeToCelsius);
fahrenheitLink.addEventListener("click", changeToFahrenheit);

//update following days according to today
function determineNextDay(day, n) {
  let today = weekDays[now.getDay()];
  let nextDay = (weekDays.indexOf(today) + 1 + n) % 7;
  day.innerHTML = weekDays[nextDay];
}
followingDays.forEach(determineNextDay);

function search(city) {
  let url = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${url}?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}
function onInputCityName(event) {
  event.preventDefault();
  let userCity = document.querySelector("#city-input").value;
  search(userCity);
}
searchCityForm.addEventListener("submit", onInputCityName);

//we want the temperature dsplayed to = to city searched
//
//add other info, like precipitation, wind etc, humidity
function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  tempToday.innerHTML = temperature;
  let weather = response.data.weather[0].main;
  descriptionToday.innerHTML = weather;
  displayedCity.innerHTML = response.data.name;
  let now = new Date();
  currentTime.innerHTML = formatTime(now);
  currentDate.innerHTML = formatDate(now);
}

//we want a current position button
currentPositionButton.addEventListener("click", retrievePosition);
function retrievePosition() {
  navigator.geolocation.getCurrentPosition(determineCurrentCoordinates);
}
function determineCurrentCoordinates(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = "https://api.openweathermap.org/geo/1.0/reverse";
  let apiUrl = `${url}?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(determineCurrentCity);
}
function determineCurrentCity(response) {
  let currentCity = response.data[0].local_names.fr;
  let url = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${url}?q=${currentCity}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

search("Monaco");
