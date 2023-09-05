let apiKey = "a61ff8fd83371ffd07303c4b2d8ad72e";
let url = `http://api.openweathermap.org/geo/1.0/direct?q=dartmouth,ca&limit=3&appid=${apiKey}`;
let lat;
let lon;

function getLocation() {
    fetch(url).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                getWeather();
            });
        }
    });
}

function getWeather() {
    url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    fetch(url).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
    });
}

// getLocation();
