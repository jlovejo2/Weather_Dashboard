var h1 = $("h1");
var header = $("#header");
var container = $(".container-fluid");
var userSearchList = $("<ul>").addClass("searchList");
var searchedCityNames = {};

//Adding text to header
h1.text("Weather Map").addClass("header");
header.append(h1);

container.append($("<div>").addClass("row").attr("id", "mainContent"));

//make first column
var firstCol = $("<div>");
firstCol.addClass("col-lg-4 col-md-4 col-sm-12");
firstCol.attr("id", "columnOne");
$("#mainContent").append(firstCol);

//make div for searchbar in first column
var searchBar1 = $("<div>");
var searchBar2 = $("<div>");
searchBar1.addClass("input-group md-form form-1 pl-0");
searchBar2.addClass("input-group-prepend");
searchBar2.append($("<span>").attr({ "class": "input-group-text cyan lighten-2", "id": "basic-text1" }).append($("<i>").attr({ "class": "fa fa-search text-white", "aria-hidden": "true" })));
searchBar1.append(searchBar2);
firstCol.append(searchBar1);
searchBar1.append($("<input>").attr({ "class": "form-control my-0 py-1", "type": "text", "id": "userInput", "placeholder": "Search", "aria-label": "Search" }));

//make ul for user searches to get listed in
firstCol.append(userSearchList);

{/* <div class="input-group md-form form-sm form-1 pl-0">
  <div class="input-group-prepend">
    <span class="input-group-text cyan lighten-2" id="basic-text1"><i class="fas fa-search text-white"
        aria-hidden="true"></i></span>
  </div>
  <input class="form-control my-0 py-1" type="text" placeholder="Search" aria-label="Search">
</div> */}

//make second column
var secondCol = $("<div>");
secondCol.addClass("col-lg-8 col-md-8 col-sm-12");
secondCol.attr("id", "columnTwo");
$("#mainContent").append(secondCol);

//add rows to larger column (first column)
$("#columnTwo").append($("<div>").addClass("row").attr("id", "weatherData"));
$("#columnTwo").append($("<div>").addClass("row").attr("id", "fiveDayForecast"));


init();

//click event on the container area below jumbotron
container.click(function () {

    var APIKey = "21a347a444e91fd3f7484f44867c287b";

    console.log(event);

    //if statement that executes the ajax queries if the search icon is clicked on
    if (event.target.tagName === "I") {

        var cityNameSearch = $("#userInput").val();
        var userSearch = $("<button>");

        //this code takes the button created in variable above and puts city Name as text within that button.
        //then that button is added as a list item to userSearchList unordered list tag. 
        userSearch.text(cityNameSearch);
        userSearchList.prepend($("<li>").prepend(userSearch));

        //calls the weatherDataQuery function with specified parameters
        weatherDataQuery(APIKey, cityNameSearch);
        saveUserInput(cityNameSearch);
    }

    if (event.target.tagName === "BUTTON") {

        var cityNameButton = event.target.textContent;
        //Ajax query that requests the temperature, humidity, and wind speed for weather data div.
        weatherDataQuery(APIKey, cityNameButton);

    }
});


//     FUNCTIONS ARE BELOW THIS LINE
//________________________________________________________

//Function that performs an ajax query to get the UV index from open weather API.  It requires latitude and longitude as input in the api call.
function uviQuery(apiKey, lat, long) {

    var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + long;

    $.ajax({
        url: queryUVI,
        method: "GET"
    }).then(function (respUvi) {
        console.log(respUvi);
        $("#weatherData").append($("<p>").text("UV Index: " + respUvi.value));
    });
}

//Function that performs an ajax query to get the weather data from open weather API.  It requires a city name as the input call.
function weatherDataQuery(apiKey, location) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (respWeatherData) {

        // console.log(lat);
        // console.log(long);
        console.log(respWeatherData);

        $("#weatherData").empty();
        //This code writes the correct data from weather Data ajax query to weather data div. 
        $("#weatherData").append($("<h1>").text(respWeatherData.name));
        $("#weatherData").append($("<p>").text("Temperature: " + respWeatherData.main.temp));
        $("#weatherData").append($("<p>").text("Humidity: " + respWeatherData.main.humidity));
        $("#weatherData").append($("<p>").text("Wind Speed: " + respWeatherData.wind.speed));

        //Ajax query to open weather API for UV index.  it requires latitude and longitude to make query.
        uviQuery(apiKey, respWeatherData.coord.lat, respWeatherData.coord.lon);
    });


}

//This function saves every city name that is entered in search input to searchedCityNames array which is then saved to localStorage.
function saveUserInput(location) {

    searchedCityNames[location] = location;

    localStorage.setItem("searchedCityNames", JSON.stringify(searchedCityNames));
}

//This function pulls the information from localStorage searchedCityNames array and generates the buttons for them.
function init() {

    var storedCities = JSON.parse(localStorage.getItem("searchedCityNames"));


    // If events weren't retrieved from localStorage, set the storedCities equal to searchedCityNames.
    if (storedCities !== null) {
        searchedCityNames = storedCities;
    }


    $.each(storedCities, function (value) {

        var button = $("<button>")

        button.text(value);
        userSearchList.append($("<li>").append(button));
    });

};

