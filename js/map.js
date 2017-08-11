//Creating the projection, gotta think of a way to dynamically resize it.
let projection = d3.geo.albersUsa()
    .scale(width / 1.5)
    .translate([width / 2, height / 2]);

//Creating an empty map with the projection
let path = d3.geo.path().projection(projection);

//Render the map
renderMap(currentJSON);