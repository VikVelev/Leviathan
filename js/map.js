let year = getYear(currentJSON);

//Creating the projection, gotta think of a way to dynamically resize it.
let projection = d3.geo.mercator()
    .scale(650)
    .translate([width / 0.7, height / 0.75]);

//Creating an empty map with the projection
let path = d3.geo.path().projection(projection);

//Get the data
renderMap(currentJSON);