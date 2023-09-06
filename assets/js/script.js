let city;
let province;
let latitude;
let longitude;

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

function locationURL() {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${city},${provinces.prov_long[provinces.prov_short.indexOf(province)]},ca&limit=3&appid=a61ff8fd83371ffd07303c4b2d8ad72e`
}

function weatherURL() {
    return `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=a61ff8fd83371ffd07303c4b2d8ad72e`;
}

function getWeather() {
    fetch(weatherURL()).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
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
                    console.log(data);
                    let i = 0;
                    for(; i < data.length; i++) {
                        if(data[i].name.toLowerCase() === city) {
                            console.log(data[i].name);
                            console.log(i);
                            break;
                        }
                    }
                    latitude = data[i].lat;
                    longitude = data[i].lon;
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

function displayWeather() {
    getLocation();
}

$("#btnSearch").on("click", function() {
    let location = $("#txtCity").val();
    if(location.includes(",")) {
        location = location.split(",");
        city = location[0].trim().toLowerCase();
        province = location[1].trim().toUpperCase();
        console.log(city);
        console.log(province);
        displayWeather();
    }
    else {
        $("#txtCity").val("Try again.");
    }
});


// let apiKey = "a61ff8fd83371ffd07303c4b2d8ad72e";
// let url = `http://api.openweathermap.org/geo/1.0/direct?q=dartmouth,ca&limit=3&appid=${apiKey}`;
// let lat;
// let lon;

// function getLocation() {
//     fetch(url).then(function(response) {
//         if(response.ok) {
//             response.json().then(function(data) {
//                 console.log(data);
//                 lat = data[0].lat;
//                 lon = data[0].lon;
//                 console.log(lat);
//                 console.log(lon);
//                 getWeather();
//             });
//         }
//     });
// }

// function getWeather() {
//     url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//     fetch(url).then(function(response) {
//         if(response.ok) {
//             response.json().then(function(data) {
//                 console.log(data);
//             });
//         }
//     });
// }

// getLocation();
