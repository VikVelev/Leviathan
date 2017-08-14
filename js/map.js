//get all available years 
//did this with the magic numbers two lines below this to optimize loading time
for (let i = 0; i < 67; i++) {
    if (i == 66) id = 1959;
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