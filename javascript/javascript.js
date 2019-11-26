var h1 = $("h1");
var header = $("#header");
var container = $(".container-fluid");
var userSearchList = $("<ul>");


//Adding text to header
h1.text("Weather Map").addClass("header");
header.append(h1);

container.append($("<div>").addClass("row").attr("id","mainContent"));

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
searchBar2.append($("<span>").attr({"class":"input-group-text cyan lighten-2", "id":"basic-text1"}).append($("<i>").attr({"class":"fa fa-search text-white","aria-hidden":"true"})));
searchBar1.append(searchBar2);
firstCol.append(searchBar1);
searchBar1.append($("<input>").attr({"class":"form-control my-0 py-1","type":"text","id":"userInput","placeholder":"Search","aria-label":"Search"}));

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
container.click(function() {

    console.log(event);
    if(event.target.tagName === "I") {
        var userSearch = $("<button>");
       userSearch.text($("#userInput").val());
       userSearchList.append($("<li>").append(userSearch));
       
    }
});