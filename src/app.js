"use strict";
const weatherIcon = document.getElementById("weather-icon");
const weatherTemp = document.getElementById("current-weather-temp");
const tempStatusIcon = document.getElementById("main-temp-icon");
const searchBar = document.getElementById("searchCity");
const weatherStatus = document.getElementById("climate-status");
const weatherCity = document.getElementById("city");
const tempMax = document.getElementById("temp-max");
const tempMin = document.getElementById("temp-min");
const humidity = document.getElementById("humadity");
const cloudy = document.getElementById("cloudy");
const windSpeed = document.getElementById("wind-speed");
const warning = document.getElementById("warning-msg");
const loader = document.getElementById("loader");
const homeIcon = document.getElementById("webpage-icon");

const API_KEY = "b466db51ed00e9210dd0a680729074f5";

let fetchedWeather;

navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    
    loader.classList.add("flex");
    (async () => {
        fetchedWeather = await fetchingWeather(latitude, longitude);
        getWeather(fetchedWeather);
        loader.classList.remove("flex");
    })();
});

function getWeather(fetchedWeather) {
    if(fetchedWeather.main.temp > 300){
        tempStatusIcon.classList.add("fa-temperature-high");
        tempStatusIcon.classList.add("text-red-500");
        tempStatusIcon.classList.remove("text-green-500");
        tempStatusIcon.classList.remove("text-blue-500");
    }else if(fetchedWeather.main.temp < 290){
        tempStatusIcon.classList.add("fa-temperature-low");
        tempStatusIcon.classList.add("text-blue-500");
        tempStatusIcon.classList.remove("text-red-500");
        tempStatusIcon.classList.remove("text-green-500");
    }else{
        tempStatusIcon.classList.add("fa-temperature-medium");
        tempStatusIcon.classList.add("text-green-500");
        tempStatusIcon.classList.remove("text-red-500");
        tempStatusIcon.classList.remove("text-blue-500");
    }
    // weather status
    weatherStatus.innerText = fetchedWeather.weather[0].main;
    //weather temp
    let temp = fetchedWeather.main.temp;
    let tempCelsius = Math.round(temp - 273.15);
    weatherTemp.innerText = `${tempCelsius}°C`;
    // weather icon
    let icon = fetchedWeather.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}.png`;
    // city name
    weatherCity.innerText = fetchedWeather.name;
    // min - max temperature
    tempMax.innerText = Math.round(fetchedWeather.main.temp_max - 273.15);
    tempMin.innerText = Math.round(fetchedWeather.main.temp_min - 273.15);
    // humadity
    humidity.innerText = `${fetchedWeather.main.humidity}%`;
    // cloudy
    cloudy.innerText = `${fetchedWeather.clouds.all}%`;
    // windspeed
    windSpeed.innerText = `${fetchedWeather.wind.speed}`;
}

// applying this debounce on search
function debArg(city) {
    loader.classList.add("flex");
    (async () => {
        fetchedWeather = await fetchingWeather("", "", city);
        try {
            getWeather(fetchedWeather);
        } catch {
            warning.classList.add("py-2");
            warning.innerText = `The city ${city} is invalid`;
            warning.classList.add("flicker");
        }
        finally{
            loader.classList.remove("flex");
        }
        
    })();
}
// applying this debounce on search -end

// fetching weather
const URL = "https://api.openweathermap.org/data/2.5/weather?";

async function fetchingWeather(lat, lon, city = "") {
    if (city === "") {
        var weatherObj = await fetch(
            `${URL}lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
    } else {
        var weatherObj = await fetch(`${URL}q=${city}&appid=${API_KEY}`);
    }
    const response = await weatherObj.json();
    return await response;
}

// fetching weather end

searchBar.addEventListener("input", (e) => {
    warning.innerText = "";
    warning.classList.remove("py-2");
    warning.classList.remove("flicker");
    if (e.target.value === "") {
        return;
    }
    debounceCall(e.target.value);
});

// debounce
const debounceCall = debounce(debArg, 500);
function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
// debounce end

// show real time and day
let dateId = document.getElementById("date");
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun"];
let formattedDate;
function showDate() {
    let date = new Date();
    let daysIndex = date.getDay();
    if (date.getHours() > 12) {
        if (date.getMinutes() < 10) {
            formattedDate = `${days[daysIndex]}, ${
                date.getHours() - 12
            }:0${date.getMinutes()} PM`;
        } else {
            formattedDate = `${days[daysIndex]}, ${
                date.getHours() - 12
            }:${date.getMinutes()} PM`;
        }
    } else {
        if (date.getMinutes() < 10) {
            formattedDate = `${days[daysIndex]}, ${
                date.getHours() + 12
            }:0${date.getMinutes()} AM`;
        } else {
            formattedDate = `${days[daysIndex]}, ${
                date.getHours() + 12
            }:${date.getMinutes()} AM`;
        }
    }
    dateId.innerText = formattedDate;
}
showDate();
setInterval(showDate, 1000);
// show real time and day end
 
// refresh when clicked on website icon
homeIcon.addEventListener("click", () => {
    location.reload();
});