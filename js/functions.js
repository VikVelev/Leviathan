function getYear(id) {
    return id.toString().slice(0, 4);
}
// function to check if it's been clicked for zooming

let clickedDOM;

function clicked(d) {

    currentState = d;
    clickedDOM = this;
    $("path").css({ "fill": defaultcolor });
    if (currentState == centered) {
        $("path").css({ "fill": defaultcolor });
    } else {
        $(this).css({ "fill": "orange" });
    }

    let x, y, k;

    if (currentState && centered !== currentState) {

        currentState = d;
        let centroid = path.centroid(currentState);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = currentState;
    } else {
        if (hoveredOld) {
            $(this).css({ "fill": "#ffbd00" });
        }
        x = width / 2;
        y = height / 2;
        k = 1;
        currentState = undefined;
        centered = null;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        //black magic(not really) that centers the state you clicked on
        //todo optimize translation for bigger states
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        //the border looks too big when zoomed
        .style("stroke-width", 1.5 / k + "px");
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
                .attr("class", "states")
                .attr("country", function(map) { return map.properties.LABEL + ", " + map.properties.COUNTRY; })
                .on("click", clicked)
                .on("mouseover", showInfo)
                .on("mouseout", mouseOut);
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

function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlToFile, false);
    xhr.send();

    if (xhr.status == "200") {
        return true;
    } else {
        return false;
    }
}

let hoveredOld;

function showInfo() {

    $("path").css({ "fill": defaultcolor });

    if (hoveredOld != this) {
        if (currentState !== undefined) {
            $(clickedDOM).css({ "fill": "orange" })
        }

        $(this).css({ "fill": "#ffbd00" });

    } else if (hoveredOld == this && outOfSVG) {

        $(this).css({ "fill": "#ffbd00" });

    } else {
        if (currentState !== undefined) {
            $(clickedDOM).css({ "fill": "orange" })
        }

        hoveredOld = null;
    }

    let currentlyClickedState = currentState !== undefined ? currentState.properties.LABEL : "none";
    let info = $(this).attr("country");

    console.log(currentlyClickedState);
    console.log(info);
    hoveredOld = this;
    outOfSVG = false;
}

function mouseOut() {
    outOfSVG = true;
    showInfo();
}