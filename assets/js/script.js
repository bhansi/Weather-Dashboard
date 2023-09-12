let city;
let province;
let latitude;
let longitude;
let isHistoryDeleted = true;

let provinces = {
    prov_long: [
        "Alberta",
        "British Columbia",
        "Manitoba",
        "New Brunswick",
        "Newfoundland and Labrador",
        "Northwest Territories",
        "Nova Scotia",
        "Nunavut",
        "Ontario",
        "Prince Edward Island",
        "Quebec",
        "Saskatchewan",
        "Yukon"
    ],
    prov_short: [
        "AB",
        "BC",
        "MB",
        "NB",
        "NL",
        "NT",
        "NS",
        "NU",
        "ON",
        "PE",
        "QC",
        "SK",
        "YT"
    ]
}

let searchHistory = [];

function retrieveSearchHistory() {
    let storedSearchHistory = localStorage.getItem("searchHistory");
    if(!storedSearchHistory) { return; }

    isHistoryDeleted = false;
    $("#btnDeleteSearchHistory").show();
    $("hr").show();

    searchHistory = JSON.parse(storedSearchHistory);

    for(let i = 0; i < searchHistory.length; i++) {
        let searchHistoryButton = $("<button>");
        searchHistoryButton.addClass("btn btn-secondary");
        searchHistoryButton.text(searchHistory[i]);
        searchHistoryButton.on("click", function() {
            let location = this.innerHTML.split(", ");
            city = location[0];
            province = location[1];
            callAPI();
        });

        $("#divSearchHistoryButtons").append(searchHistoryButton);
    }
}

retrieveSearchHistory();

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
}

function displayWeatherToday(weather) {
    $("#divWeatherToday").html("").show();

    let header = $("<h3>");
    header.text(`${city} (${formatDate(weather.dt * 1000)})`);

    let icon = $("<img>");
    icon.attr("alt", "Weather icon.");
    icon.attr("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    icon.addClass("img-icon");
    header.append(icon);

    let temp = $("<p>");
    temp.text(`Temp: ${weather.main.temp}°C`);

    let wind = $("<p>");
    wind.text(`Wind: ${weather.wind.speed} KPH`)

    let humidity = $("<p>");
    humidity.text(`Humidity: ${weather.main.humidity}%`);

    let div = $("#divWeatherToday");
    div.append(header);
    div.append(temp);
    div.append(wind);
    div.append(humidity);
}

function displayWeatherFuture(weather) {
    let card = $("<div>");
    card.addClass("card p-3 bg-dark text-light");

    let date = $("<p>");
    date.addClass("fw-bold");
    date.text(formatDate(weather.dt_txt));

    let icon = $("<img>");
    icon.attr("alt", "Weather icon.");
    icon.attr("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`);
    icon.addClass("img-icon");

    let temp = $("<p>");
    temp.text(`Temp: ${weather.main.temp}°C`);

    let wind = $("<p>");
    wind.text(`Wind: ${weather.wind.speed} KPH`)

    let humidity = $("<p>");
    humidity.text(`Humidity: ${weather.main.humidity}%`);

    card.append(date);
    card.append(icon);
    card.append(temp);
    card.append(wind);
    card.append(humidity);

    $("#divWeatherFuture").append(card);
}

function displayWeather(list) {
    $("#divWeatherFuture").html("").show();
    $("#headingWeatherFuture").show();

    let weatherIndex = 1;
    for(let i = 1; i <= 5; i++) {
        let futureDay = new Date();
        futureDay = formatDate(futureDay.setDate(futureDay.getDate() + i));

        for(; weatherIndex < list.length; weatherIndex++) {
            if(futureDay === formatDate(list[weatherIndex].dt_txt)) {
                displayWeatherFuture(list[weatherIndex]);
                break;
            }
        }
    }
}

function locationURL() {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${city},${provinces.prov_long[provinces.prov_short.indexOf(province)]},ca&limit=3`
}

function weatherTodayURL() {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
}

function weatherFutureURL() {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric`;
}

function getWeather() {
    fetch(weatherTodayURL()).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeatherToday(data);
            });
        }
        else {
            $("#txtCity").val("Error retrieving weather data.");
        }
    });

    fetch(weatherFutureURL()).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeather(data.list);
            });
        }
        else {
            $("#txtCity").val("Error retrieving weather data.");
        }
    });
}

function getLocation() {
    fetch(locationURL()).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                if(data.length > 0) {
                    let i = 0;
                    for(; i < data.length; i++) {
                        if(data[i].name === city) {
                            break;
                        }
                    }
                    latitude = data[i].lat;
                    longitude = data[i].lon;

                    updateSearchHistory();
                    getWeather();
                }
                else {
                    $("#txtCity").val("No results found.");
                }
            });
        }
        else {
            $("#txtCity").val("No results found.");
        }
    });
}

function callAPI() {
    getLocation();
}

function updateSearchHistory() {
    let location = `${city}, ${province}`;
    if(isHistoryDeleted) {
        isHistoryDeleted = false;
        $("#btnDeleteSearchHistory").show();
        $("hr").show();

    }

    if(!searchHistory.includes(location)) {
        searchHistory.push(location);
        
        let searchHistoryButton = $("<button>");
        searchHistoryButton.addClass("btn btn-secondary");
        searchHistoryButton.text(location);
        searchHistoryButton.on("click", function() {
            let location = this.innerHTML.split(", ");
            city = location[0];
            province = location[1];
            callAPI();
        });

        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        $("#divSearchHistoryButtons").append(searchHistoryButton);
    }
}

$("#txtCity").on("focus", function() {
    $("#txtCity").val("");
});

$("#btnSearch").on("click", function() {
    let location = $("#txtCity").val();
    if(location.includes(",")) {
        $("#txtCity").val("");
        location = location.split(",");
        cityTemp = location[0].trim().split(" ");
        city = "";
        for(let i = 0; i < cityTemp.length; i++) {
            cityTemp[i] = cityTemp[i].charAt(0).toUpperCase() + cityTemp[i].slice(1).toLowerCase();
            city += " " + cityTemp[i];
        }
        city = city.trim();
        province = location[1].trim().toUpperCase();
        callAPI();
    }
    else {
        $("#txtCity").val("Format: <city>, <province/territory>");
    }
});

$("#btnDeleteSearchHistory").on("click", function() {
    searchHistory = [];
    localStorage.setItem("searchHistory", searchHistory);

    isHistoryDeleted = true;

    $("#btnDeleteSearchHistory").hide();
    $("hr").hide();
    $("#divSearchHistoryButtons").html("");
    $("#divWeatherToday").html("").hide();
    $("#headingWeatherFuture").hide();
    $("#divWeatherFuture").html("").hide();
});
