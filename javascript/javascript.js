var h1 = $("h1");
var header = $("#header");
var container = $(".container-fluid");
var userSearchList = $("<ul>");

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

//click event on the container area below jumbotron
container.click(function () {
    var cityName = $("#userInput").val();
    var APIKey = "21a347a444e91fd3f7484f44867c287b";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + APIKey;
    console.log(cityName);
    console.log(event);

    //if statement that executes the ajax queries if the search icon is clicked on
    if (event.target.tagName === "I") {
        
        var userSearch = $("<button>");
        userSearch.text(cityName);
        userSearchList.append($("<li>").append(userSearch));

        //Ajax query that requests the temperature, humidity, and wind speed for weather data div.
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (respWeatherData) {
            var lat = respWeatherData.coord.lat;
            var long = respWeatherData.coord.lon;
            var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + long;
            console.log(lat);
            console.log(long);
            console.log(respWeatherData);
            $("#weatherData").append($("<h1>").text(respWeatherData.name));
            $("#weatherData").append($("<p>").text("Temperature: " + respWeatherData.main.temp));
            $("#weatherData").append($("<p>").text("Humidity: " + respWeatherData.main.humidity));
            $("#weatherData").append($("<p>").text("Wind Speed: " + respWeatherData.wind.speed));

            $.ajax({
                url: queryUVI,
                method: "GET"
            }).then(function (respUvi) {
                console.log(respUvi);
                $("#weatherData").append($("<p>").text("UV Index: " + respUvi.value));
            });
           
        });

    }
});

