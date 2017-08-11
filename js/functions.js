function getYear(id) {
    return id.toString().slice(0, 4);
}
// function to check if it's been clicked for zooming
function clicked(d) {

    $("path").css({ "fill": defaultcolor });
    if (d == centered) {
        $("path").css({ "fill": defaultcolor });
    } else {
        $(this).css({ "fill": "orange" });
    }

    let x, y, k;

    if (d && centered !== d) {
        let centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        //black magic that centers the state you clicked on
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        //the border looks too big when zoomed
        .style("stroke-width", 1.5 / k + "px");

    d3.select("svg").on("mousedown.log", function() {
        console.log("Country: " + d.properties.COUNTRY);
        console.log("Info: " + d.properties.LABEL);
        console.log("Category: " + d.properties.CATEGORY)
    });
}

function renderMap(id) {

    $("svg").remove();

    svg = d3.select("body")
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("viewBox", "0 0 " + width.toString() + " " + height.toString())
        //class to make it responsive
        .classed("svg-content-responsive", true)
        .attr("width", width)
        .attr("height", height)
        .attr("id", "mainMap");

    g = svg.append("g");


    d3.json("GeoJSON/" + id, function(error, map) {

        if (error) {
            return false;
        } else {
            $("svg").hide();
            g.selectAll("path")
                .data(map.features)
                .enter()
                .append("path")
                .attr("d", path)
                .on("click", clicked);
            $("svg").fadeIn(200);
        }
    });
}

function resizeMap() {

    // adjust things when the window size changes
    let widthM = $(window).width();
    widthM = widthM - parseInt($("svg").css("marginLeft")) - parseInt($("svg").css("marginRight"));
    let mapRatio = widthM > height ? height / widthM : widthM / height;

    let heightM = widthM * mapRatio;

    // resize the map container
    svg.attr('width', widthM).attr('height', heightM);
}