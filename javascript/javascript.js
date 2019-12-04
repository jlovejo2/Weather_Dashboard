var h1 = $("h1");
var header = $("#header");
var container = $(".container-fluid");
var userSearchList = $("<ul>").addClass("searchList");

var numberOfForecastDays = 6;
var openWeatherApiKey = "21a347a444e91fd3f7484f44867c287b";
var weatherBitApiKey = "37e64d6e85d5400586b0c8ab429e77b4";

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
// var searchBar2 = $("<div>");
searchBar1.addClass("input-group mb-3");
// searchBar2.addClass("input-group-prepend"):
searchBar1.append($("<button>").attr({ "class": "btn btn-primary", "type": "button"}).append($("<i>").attr({ "class": "fas fa-search text-white", "aria-hidden": "true" })));
// searchBar1.append(searchBar2);
firstCol.append(searchBar1);
searchBar1.append($("<input>").attr({ "class": "form-control", "type": "text", "id": "userInput", "placeholder": "Search", "aria-label": "Search" }));

//make ul for user searches to get listed in
firstCol.append(userSearchList);

//make second column
var secondCol = $("<div>");
secondCol.addClass("col-lg-8 col-md-8 col-sm-12");
secondCol.attr("id", "columnTwo");
$("#mainContent").append(secondCol);

//add rows to larger column (first column)
$("#columnTwo").append($("<div>").addClass("row").attr({"id": "weatherData","class":"row p-3"}));
$("#columnTwo").append($("<div>").addClass("row").attr({"id": "fiveDayForecast", "class": "row p-3"}));

init();

//click event on the container when a key is released up
container.on("keyup", function(e){

    //if statement that executes ajax queries if the enter key is pressed and released up in the userInput field
    console.log(e.keyCode)
    if (e.keyCode === 13 && $("#userInput").val() === "") {
        console.log("Pressed enter and no user input");
         $("#myModal").modal();
 
     }

    else if (e.keyCode === 13) {
        console.log("it works");
        var cityNameSearch = $("#userInput").val();
                
        renderSearchButtons(cityNameSearch);

        //calls the weatherDataQuery function with specified parameters
        weatherDataQuery(openWeatherApiKey, cityNameSearch);
        saveUserInput(cityNameSearch, cityNameSearch);
        fiveDayForecastQuery(weatherBitApiKey, cityNameSearch, numberOfForecastDays);
    }
    

    
});

//click event on the container area below jumbotron
container.click(function () {

    console.log(event.target.textContent);

    //if statement that executes the ajax queries if the search icon is clicked on
    if (event.target.tagName === "I") {

        var cityNameSearch = $("#userInput").val();
                
        renderSearchButtons(cityNameSearch);

        //calls the weatherDataQuery function with specified parameters
        weatherDataQuery(openWeatherApiKey, cityNameSearch);
        saveUserInput(cityNameSearch, cityNameSearch);
        fiveDayForecastQuery(weatherBitApiKey, cityNameSearch, numberOfForecastDays);
    }

    if (event.target.tagName === "BUTTON" && event.target.textContent !== "X") {

        console.log("1");
        var cityNameButton = event.target.textContent;
        //Ajax query that requests the temperature, humidity, and wind speed for weather data div.
        weatherDataQuery(openWeatherApiKey, cityNameButton);
        fiveDayForecastQuery(weatherBitApiKey, cityNameButton, numberOfForecastDays);
    
    }

    if (event.target.textContent === "X") {
        var keyName = event.target.parentElement.children[0].textContent;
        
        console.log(keyName);
        console.log(searchedCityNames);
        delete searchedCityNames[keyName];
        console.log(searchedCityNames);
        event.toElement.closest("li").remove();
        localStorage.setItem("searchedCityNames", JSON.stringify(searchedCityNames));
    }
    
});


//     FUNCTIONS ARE BELOW THIS LINE
//________________________________________________________



function renderSearchButtons (buttonTextContent) {

        var userSearch = $("<button>").addClass("userSearchButton");
        var closeButton = $("<button>").addClass("btn btn-primary btn-sm");

        //this code takes the button created in variable above and puts city Name as text within that button.
        //then that button is added as a list item to userSearchList unordered list tag. 
        closeButton.text("X");
        userSearch.text(buttonTextContent);
        userSearchList.prepend($("<li>").prepend(userSearch, closeButton));
}

//Function that performs an ajax query to get the UV index from open weather API.  It requires latitude and longitude as input in the api call.
function uviQuery(apiKey, lat, long) {

    var queryUVI = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + long;

    $.ajax({
        url: queryUVI,
        method: "GET"
    }).then(function (respUvi) {
        console.log(respUvi);
        $("#weatherDataList").append($("<p>").text("UV Index: " + respUvi.value));
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
        openWeatherIconQuery(respWeatherData.weather[0].icon, $("#weatherData"));
        $("#weatherData").append($("<ul>").attr("id","weatherDataList"));
        $("#weatherDataList").append($("<li>").text("Temperature: " + respWeatherData.main.temp));
        $("#weatherDataList").append($("<li>").text("Humidity: " + respWeatherData.main.humidity));
        $("#weatherDataList").append($("<li>").text("Wind Speed: " + respWeatherData.wind.speed));
        //Ajax query to open weather API for UV index.  it requires latitude and longitude to make query.
        uviQuery(apiKey, respWeatherData.coord.lat, respWeatherData.coord.lon);
        
    });


}

//This function saves every city name that is entered in search input to searchedCityNames array which is then saved to localStorage.
function saveUserInput(keyname, location) {

    searchedCityNames[keyname] = location;

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

        renderSearchButtons(value);
    });

};

function fiveDayForecastQuery(apiKey, location, numberOfDays) {
    // var queryFiveDay = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + location + "&cnt=" + numberOfDays + "&units=imperial&key=" + apiKey;
    var queryFiveDay = "https://api.weatherbit.io/v2.0/forecast/daily?city=" + location + "&days=" + numberOfDays + "&units=I&key=" + apiKey;

    $.ajax({
        url: queryFiveDay,
        method: "GET"
    }).then(function (respFiveDay) {
        console.log(respFiveDay);

            $("#fiveDayForecast").empty();

        $.each(respFiveDay.data, function (index) {
            var xIndex = index + 1;
            var date = $("<h3>").text(respFiveDay.data[xIndex].valid_date);
            var highTemp = $("<p>").text("High Temp(F): " + respFiveDay.data[xIndex].high_temp);
            var iconCode = respFiveDay.data[xIndex].weather.icon
            var lowTemp = $("<p>").text("Low Temp(F): " + respFiveDay.data[xIndex].low_temp);
            var humidity = $("<p>").text("Humidity(%): " + respFiveDay.data[xIndex].rh);
            var columnDiv = $("<div>").addClass("fiveDayForecastEl col-lg-2 col-md-2 col-sm-6")

            // var newDateFormat = date.splice(5,5) + "-" + date.splice(0,4);

            // var newDate = respFiveDay.data[xIndex].valid_date;
            // console.log(newDate.slice(1,1));
            $("#fiveDayForecast").append(columnDiv.append(date));
            
            weatherBitIconQuery(iconCode, columnDiv);

            $("#fiveDayForecast").append(columnDiv.append(highTemp, lowTemp, humidity));

        });

    });

};

function weatherBitIconQuery(iconCode, iconDiv) {
    
    var linkIconImg = "https://www.weatherbit.io/static/img/icons/" + iconCode + ".png";
    var iconImg = $("<img>").attr({"src": linkIconImg, "alt": "Weather Icon", "id": "fiveDayForecastIcon"});

        $("#fiveDayForecast").append(iconDiv.append(iconImg));

};

function openWeatherIconQuery (iconCode, iconDiv) {
   var openWeatherLink = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
   var imgDiv = $("<img>").attr({"src": openWeatherLink, "alt": "Weather Icon", "id": "weatherDataIcon"});

    $("#weatherData").append(iconDiv.append(imgDiv));
}

function modalMustEnterCity () {


    $("#myModal").modal('show');

}
    // $("<div>").attr({"class":"modal","tabindex":"-1","role":"dialog"});
    // $("<div>").attr({"class":"modal-dialog","role":"document"});

//    <div class="modal" tabindex="-1" role="dialog">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title">Modal title</h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">
//         <p>Modal body text goes here.</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//       </div>
//     </div>
//   </div>
// </div>