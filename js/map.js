//Creating the projection, gotta think of a way to dynamically resize it.
//get all available years
for (let i = 0; i < 67; i++) {
    while (doesFileExist("GeoJSON/" + id) != true) {
        id++;
    }
    possibleYears.push(id);
    id++;
}

let projection = d3.geo.albersUsa()
    .scale(width / 1.5)
    .translate([width / 2, height / 2]);

//Creating an empty map with the projection
let path = d3.geo.path().projection(projection);

//Render the map
renderMap(currentJSON);