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
    console.log(d);

}

function renderMap(id) {

    $("svg").remove();

    svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "mainMap");

    g = svg.append("g");

    d3.json("GeoJSON/" + id + ".geojson", function(error, map) {
        $("svg").hide();
        g.selectAll("path")
            .data(map.features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click", clicked);
        $("svg").fadeIn(200);
    });
}

function getYear(id) {
    return id.toString().slice(0, 4);
}