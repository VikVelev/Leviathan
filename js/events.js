//trying to get other maps
$(".input").change(function() {
    currentJSON = $(".input").val();
    year = getYear(currentJSON);
    console.log("Changing to year: " + year);
    renderMap(currentJSON);

});