let year = getYear(currentJSON);

//Creating the projection, gotta think of a way to dynamically resize it.
let projection = d3.geo.albersUsa()
    .scale(width / 1.5)
    .translate([width / 2, height / 2.2]);

d3.select(window).on('resize', resize);

function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#mainMap').style('width'));
    width = width - $(this).style.marginLeft - $(this).style.marginRight;
    height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, height / 2])
        .scale(width);

    // resize the map container
    map.style('width', width + 'px').style('height', height + 'px');

    // resize the map
    map.select('g').attr('d', path);
    map.selectAll('g').attr('d', path);
}

//Creating an empty map with the projection
let path = d3.geo.path().projection(projection);
//Get the data
renderMap(currentJSON);