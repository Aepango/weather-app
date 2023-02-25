// var city= "Moorestown";
// var APIkey = "eddea5fe12faf68796dc0b73be09245d";
// var queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;
// // fetch(queryURL)
// // .then(function (response){
// //     response.json()
// //     console.log(response.status);

// // })
// // .then(function (data){
// //     console.log(data)
// // })
// fetch(queryUrl).then(function (response) {
//     // Check the response value is equal to 404.
//     if (response.status === 404) {
//       // If the page is not on the 404 page, redirect to it.
//     document.location.replace(redirectUrl);
//     } else {
//     return response.json();
//     }
// });

function initPage() {
    const cityEl = document.getElementById("location");
    const tempEl = document.getElementById("temperature")
    const humidityEl = document.getElementById("humidity")
    const precipitationEl = document.getElementById("pop")
    const cloudsEl = document.getElementById("clouds")
    const searchBtn = document.getElementById("searchBtn")
    const input = document.getElementById("search-input")
    const history = document.getElementById("recent-searches")
    // const clearHist = document.getElementById("clear")
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    //apikey
    const APIkey = 'd88b26748c553f6f8c8d054d1b981164';

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIkey;
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            //lays out current date/month/year. pulls data from api call to output different conditions
            .then(function (response) {
                const currentDate = new Date(response.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                console.log(response)
                cityEl.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
                tempEl.innerHTML = "Current Temperature: " + (response.main.temp) + " &#176F";
                humidityEl.innerHTML = "Current Humidity: " + response.main.humidity + "%";
                precipitationEl.innerHTML = "Wind Speed: " + response.wind.speed + "MPH";
                cloudsEl.innerHTML = "cloudiness: " + response.weather[0].description;
                let lat = response.coord.lat;
                let lon = response.coord.lon;

                let forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey
                fetch(forecastQuery)
                    .then(function (response) {
                        return response.json();
                    })
                    // puts conditions/dates into the 5 day forecast
                    .then(function (response) {
                        // for (i = 0; i < response.list.length; i+=8){
                        //     console.log(response.list[i])
                        // }
                        console.log(response)
                        const forecastEl = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEl.length; i++) {
                            forecastEl[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth() + 1;
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "forecast-date");
                            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEl[i].append(forecastDateEl)
                            //create modify and append temp, humidity, precipitation, and clouds
                            const forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + (response.list[forecastIndex].main.temp) + "&#176F";
                            forecastEl[i].append(forecastTemp);

                            const forecastHumidity = document.createElement("p")
                            forecastHumidity.innerHTML = "Humidity: " + response.list[forecastIndex].main.humidity + "%";
                            forecastEl[i].append(forecastHumidity)

                            const forecastPrecip = document.createElement("p");
                            forecastPrecip.innerHTML = "Current Wind Speed: " + response.list[forecastIndex].wind.speed + "MPH";
                            forecastEl[i].append(forecastPrecip);

                            const forecastClouds = document.createElement("p");
                            forecastClouds.innerHTML = "cloudiness: " + response.list[forecastIndex].weather[0].description
                            forecastEl[i].append(forecastClouds)
                        }
                    })
            })
    }
    // runs the render function on click as well as stores information locally
    searchBtn.addEventListener("click", function (event) {
        event.preventDefault()
        // console.log("click")
        const searchInput = input.value;
        getWeather(searchInput);
        searchHistory.push(searchInput);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory()
    })
    //creates and appends search history
    function renderSearchHistory() {
        history.innerHTML = ""
        for (let i = 0; i < searchHistory.length; i++) {
            const historyEl = document.createElement("input");
            historyEl.setAttribute("type", "text");
            historyEl.setAttribute("readonly", true);
            historyEl.setAttribute("value", searchHistory[i]);
            historyEl.setAttribute("class", "bg-secondary rounded text-light mt-3 mb-3")
            historyEl.addEventListener("click", function () {
                getWeather(historyEl.value);
            })
            history.append(historyEl);
        }
    }
    //clears history on click
    // clearHist.addEventListener("click", function(){
    //     searchHistory = [];
    //     renderSearchHistory()
    // })
}
initPage()