//Global variables for content to be dynamically added to html
var h1 = $("h1");
var header = $("#header");
var container = $(".container-fluid");
var userSearchList = $("<ul>").addClass("searchList");
var firstCol = $("<div>");
var searchBar1 = $("<div>");
var secondCol = $("<div>");

//Global variables used for weather Api queries
var numberOfForecastDays = 6;
var openWeatherApiKey = "21a347a444e91fd3f7484f44867c287b";
var weatherBitApiKey = "37e64d6e85d5400586b0c8ab429e77b4";

//Global JSON that city search names are removed and added to in order to generate city search list
var searchedCityNames = {};

//Adding text to header in Jumbotron
h1.text("Weather Map").addClass("header");
header.append(h1);
$(".container").append($("<h1>").text(moment().format("MMMM Do YYYY")));

//Adds classes to container-fluid which is div that all weather data and search lists are contained within
container.append($("<div>").attr({"class":"row justify-content-center","id": "mainContent",}));

//make first column
firstCol.addClass("col-lg-4 col-md-4 col-sm-12");
firstCol.attr("id", "columnOne");
$("#mainContent").append(firstCol);

//Make search bar and place it into the first column inside mainContent div
//Grab variable div set aside for searchbar and add input class to it;
searchBar1.addClass("input-group mb-3");
// searchBar2.addClass("input-group-prepend"):
searchBar1.append($("<button>").attr({ "class": "btn btn-primary", "type": "button" }).append($("<i>").attr({ "class": "fas fa-search text-white", "aria-hidden": "true" })));
// searchBar1.append(searchBar2);
firstCol.append(searchBar1);
searchBar1.append($("<input>").attr({ "class": "form-control", "type": "text", "id": "userInput", "placeholder": "Search", "aria-label": "Search" }));

//make ul for user searches to get listed in
firstCol.append(userSearchList);

//make second column
secondCol.addClass("col-lg-8 col-md-8 col-sm-12");
secondCol.attr("id", "columnTwo");
$("#mainContent").append(secondCol);

//add rows to larger column (first column)
$("#columnTwo").append($("<div>").attr({ "id": "weatherData", "class": "row justify-content-center p-1 mb-3 ml-1" }));
$("#columnTwo").append($("<div>").attr({ "id": "fiveDayForecast", "class": "row justify-content-center ml-1" }));

//Run init() function which initializes the page and pulls any cities from localStorage and renders them into the searchlist below searchbar
init();

//click event on the container-cluid when a key is released up
container.on("keyup", function (e) {

    //if statement that executes ajax queries if the enter key is pressed and released up in the userInput field
    console.log(e.keyCode)
    if (e.keyCode === 13 && $("#userInput").val() === "") {
        console.log("Pressed enter and no user input");

        var modalDiv = $("<div>").attr({ "class": "modal", "id": "myModal" });
        var modalDialog = $("<div>").attr({ "class": "modal-dialog" });
        var modalContent = $("<div>").attr({ "class": "modal-content" });
        var modalHeader = $("<div>").attr({ "class": "modal-header" });
        var modalBody = $("<div>").attr({ "class": "modal-body" });

        //The below code dynamically adds the modal to the html.
        container.append(modalDiv.append(modalDialog.append(modalContent)));
        modalHeader.append($("<h4>").text("Notification: please read."));
        modalHeader.append($("<button>").attr({ "type": "button", "class": "close", "data-dismiss": "modal" }).text("X"));
        modalBody.attr("class", "modal-body").text("Need to enter a city into search input");
        modalContent.append(modalHeader, modalBody);

        //jquery code that actually grabs the modal by id and opens it
        $("#myModal").modal();

    }

    else if (e.keyCode === 13) {
        console.log("it works");
        var cityNameSearch = $("#userInput").val();

        //calls the four below functions.  They are all used to render data or save user input to localstorage.
        renderSearchButtons(cityNameSearch);
        weatherDataQuery(openWeatherApiKey, cityNameSearch);
        saveUserInput(cityNameSearch, cityNameSearch);
        fiveDayForecastQuery(weatherBitApiKey, cityNameSearch, numberOfForecastDays);
    }

});

//click event on the container-fluid area below jumbotron
container.click(function () {

    //if statement that executes the ajax queries if the search icon is clicked on
    if (event.target.tagName === "I") {

        var cityNameSearch = $("#userInput").val();

        //calls the four below functions.  They are all used to render data or save user input to localstorage.
        renderSearchButtons(cityNameSearch);
        weatherDataQuery(openWeatherApiKey, cityNameSearch);
        saveUserInput(cityNameSearch, cityNameSearch);
        fiveDayForecastQuery(weatherBitApiKey, cityNameSearch, numberOfForecastDays);
    }

    //if statement that executes ajax query functions if a button with "city name" under searchbar is clicked
    if (event.target.tagName === "BUTTON" && event.target.textContent !== "X") {

        var cityNameButton = event.target.textContent;

        //Ajax query that requests the temperature, humidity, and wind speed for weather data div.
        weatherDataQuery(openWeatherApiKey, cityNameButton);
        //Ajax query that pulls fiveday forecast data
        fiveDayForecastQuery(weatherBitApiKey, cityNameButton, numberOfForecastDays);
    }

    //if statement that removes the "city name" button from the search list with "X" button is clicked
    if (event.target.textContent === "X") {

        var keyName = event.target.parentElement.children[0].textContent;

        //removes the city content from global JSON object searchedCityNames
        delete searchedCityNames[keyName];
        //Removes the li div that is associated with the "X" button from the search button list
        event.toElement.closest("li").remove();
        //takes the searchedCityNames that has had the city removed from it and sets it to local storage
        localStorage.setItem("searchedCityNames", JSON.stringify(searchedCityNames));
    }

});


//     FUNCTIONS ARE BELOW THIS LINE
//________________________________________________________

//Function that renders the search buttons and close button list under the search bar
function renderSearchButtons(buttonTextContent) {

    var userSearch = $("<button>").addClass("userSearchButton");
    var closeButton = $("<button>").addClass("btn btn-primary btn-sm");

    //this code takes the button created in variable above and puts city Name as text within that button.
    //then that button is added as a list item to userSearchList unordered list tag. 
    closeButton.text("X");
    userSearch.text(buttonTextContent);
    userSearchList.prepend($("<li>").prepend(userSearch, closeButton));
};

//Function that performs an ajax query to get the UV index from open weather API.  It requires latitude and longitude as input in the api call.
function uviQuery(apiKey, lat, long) {

    var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + long;
    //Ajax query to openweathermap API for UV index data.  Need the lat and long pulled from another ajax query.  
    $.ajax({
        url: queryUVI,
        method: "GET"
    }).then(function (respUvi) {
        //Jquery code that writes the UV index data into the weatherData ul div
        $("#weatherDataList").append($("<li>").text("UV Index: " + respUvi.value));
    });
};

//Function that performs an ajax query to get the weather data from open weather API.  It requires a city name as the input call.
function weatherDataQuery(apiKey, location) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + apiKey;

    //Ajax query to openweathermap API for the temp, humidity, wind speed, latitude, and longitude
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (respWeatherData) {

        //This code clears the weatherData div of any elements that may be there from a previous search
        $("#weatherData").empty();

        //global variables used for dynamically added divs to html
        var rowDiv1 = $("<div>").attr("class", "row");
        var rowDiv2 = $("<div>").attr("class", "row");
        var colDiv1 = $("<div>").attr("class","col-lg-12 col-md-12 col-sm-12 col-xs-12");
        var colDiv2 = $("<div>").attr("class","col-lg-12 col-md-12 col-sm-12 col-xs-12");
        
        //This code writes the correct data from weather Data ajax query to weather data div. 
        $("#weatherData").append(rowDiv1.append(colDiv1.append($("<h1>").text(respWeatherData.name))));
        //This code creates the ul div that will contain the data into the proper grid layout in weatherData
        $("#weatherData").append(rowDiv2.append(colDiv1.append($("<ul>").attr("id", "weatherDataList"))));
        //This code adds the temp data to weatherDataList div
        $("#weatherDataList").append($("<li>").text("Temperature: " + respWeatherData.main.temp));
        //This code adds the humidity data to weatherDataList div
        $("#weatherDataList").append($("<li>").text("Humidity: " + respWeatherData.main.humidity));
        //This code adds the wind speed data to weatherDataList div
        $("#weatherDataList").append($("<li>").text("Wind Speed: " + respWeatherData.wind.speed));
        //This code runs the function that is used to execute Ajax query to pull the weather icon from openweather API and write it into the proper div given by parameters
        openWeatherIconQuery(respWeatherData.weather[0].icon, colDiv2, rowDiv1);
        //Ajax query to open weather API for UV index.  it requires latitude and longitude to make query.
        uviQuery(apiKey, respWeatherData.coord.lat, respWeatherData.coord.lon);
        //This line adds a class used for css styling to weatherData
        $("#weatherData").addClass("backgroundData");

    });


};

//This function saves every city name that is entered in search input to searchedCityNames array which is then saved to localStorage.
function saveUserInput(keyname, location) {

    searchedCityNames[keyname] = location;

    localStorage.setItem("searchedCityNames", JSON.stringify(searchedCityNames));
};

//This function pulls the information from localStorage searchedCityNames array and generates the buttons for them.
function init() {
    //This line grabs the data from localStorage, parses it, and sets it as variable storedCities
    var storedCities = JSON.parse(localStorage.getItem("searchedCityNames"));

    //These lines remove the css style class that adds background color to data divs so that the color only shows up if data is rendered into the divs
    $("#weatherData").removeClass("backgroundData");
    $("#fiveDayForecast").removeClass("backgroundData");

    // If events weren't retrieved from localStorage, set the storedCities equal to searchedCityNames.
    if (storedCities !== null) {
        searchedCityNames = storedCities;
    }
    //this code executes renderSearchButtons function for each index value of storedCities object
    $.each(storedCities, function (value) {

        renderSearchButtons(value);
    });

};

//This code runs the Ajax query for the five day forecast data and dynamically adds it into the HTML
function fiveDayForecastQuery(apiKey, location, numberOfDays) {

    var queryFiveDay = "https://api.weatherbit.io/v2.0/forecast/daily?city=" + location + "&days=" + numberOfDays + "&units=I&key=" + apiKey;

    //Runs the ajax query for weatherbit.io API to get the five day forecast data
    $.ajax({
        url: queryFiveDay,
        method: "GET"
    }).then(function (respFiveDay) {

        //This line empties the fiveDayForecast div of any elements and data that contains from previous searches
        $("#fiveDayForecast").empty();

        //Global variables that are used for dynamically adding data to html
        var fivedayRowDiv1 = $("<div>").attr("class", "row ml-2");
        var fivedayRowDiv2 = $("<div>").attr("class", "row ml-2");

        //Adds a header that says "five day forecast" to first row div and adds that to fivedayforecast
        $("#fiveDayForecast").append(fivedayRowDiv1.append($("<h3>").text("Five Day Forecast")));
        //adds a second row div to fivedayforecast
        $("#fiveDayForecast").append(fivedayRowDiv2);
        //adds a class to fivedayforecast that is used for css styling
        $("#fiveDayForecast").addClass("backgroundData");

        //runs the code contained within for each index of the data object returned by the ajax query
        $.each(respFiveDay.data, function (index) {

            //below variable increase the index by one because the first index is todays date and this is a forecast for the next five days
            var xIndex = index + 1;
            //assigns the date from data object respFiveDay to a variable
            var date = $("<h3>").text(respFiveDay.data[xIndex].valid_date);
            //assigns high-temp from data object to a variable
            var highTemp = $("<p>").text("High Temp(F): " + respFiveDay.data[xIndex].high_temp);
            //assigns weather icon from data object to a variable
            var iconCode = respFiveDay.data[xIndex].weather.icon
            //assigns low temp from data object to a variables
            var lowTemp = $("<p>").text("Low Temp(F): " + respFiveDay.data[xIndex].low_temp);
            //assigns humidity from data object to a variable
            var humidity = $("<p>").text("Humidity(%): " + respFiveDay.data[xIndex].rh);
            //creates a column div used for boostrap styling of data and adds appropriate classes to it
            var columnDiv = $("<div>").addClass("fiveDayForecastEl col-xl-2 col-lg-4 col-md-4 col-sm-4 col-xs-6");
            //grabs row div and adds the column div into and then adds the date
            fivedayRowDiv2.append(columnDiv.append(date));
            //executes the weatherBitIconquery function that grabs the object via icon code pulled from data object and then appends it to the divs given via the parameters
            weatherBitIconQuery(iconCode, columnDiv, fivedayRowDiv2);
            //This line of code then appends the column div to the second row div and appends the rest of the data pulled from data object to it
            fivedayRowDiv2.append(columnDiv.append(highTemp, lowTemp, humidity));

        });

    });

};

//This function uses the parameters given to run an Ajax query from weatherbit.io API for an image with an iconCode pulled from a previous ajax query.  It then appends that image into the div parameters given.
function weatherBitIconQuery(iconCode, iconDiv, fivedayRowDiv2) {

    var linkIconImg = "https://www.weatherbit.io/static/img/icons/" + iconCode + ".png";
    var iconImg = $("<img>").attr({ "src": linkIconImg, "alt": "Weather Icon", "id": "fiveDayForecastIcon" });
    //This line of code appends the column div to the second row div and appends the pulled weather image to the column div
    fivedayRowDiv2.append(iconDiv.append(iconImg));

};

//This function uses the parameters given to run an Ajax query from openweather API for an image with an iconCode pulled from a previous ajax query.  It then appends that image into the div parameters given.
function openWeatherIconQuery(iconCode, iconColDiv, iconRowDiv) {
    var openWeatherLink = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    var imgDiv = $("<img>").attr({ "src": openWeatherLink, "alt": "Weather Icon", "id": "weatherDataIcon" });
    //This line of code appends the column div to the iconrow div and appends the pulled weather image to the column div
    $("#weatherData").append(iconRowDiv.append(iconColDiv.append(imgDiv)));

};

