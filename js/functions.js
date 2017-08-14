function getYear(id) {
    return id.toString().slice(0, 4);
}
// function to check if it's been clicked for zooming

function renderMap(id) {

    $("svg").remove();

    svg = d3.select(".container")
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("viewBox", "0 0 " + width + " " + height)
        //class to make it responsive
        .classed("svg-content-responsive", true)
        //.attr("preserveAspectRatio", "xMinYMin")
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
                .attr("country", function(map) { return map.properties.LABEL + (map.properties.COUNTRY ? ", " + map.properties.COUNTRY : " "); })
                .on("click", clicked)
                .on("mouseout", mouseOut)
                .on("mouseover", showInfo);
            $("svg").fadeIn(200);
        }
    });
}

function clicked(d) {

    currentState = d;

    clickedDOM = this;
    $("path").css({ "fill": defaultcolor });
    if (currentState == centered) {
        $("path").css({ "fill": defaultcolor });
    } else {
        $(this).css({ "fill": "#ff8a00" });
        $(this).css({ "box-shadow": "inset 10px 10px 10px 10px #666" });
    }

    let x, y, k;

    if (currentState && centered !== currentState) {

        let centroid = path.centroid(currentState);

        //console.log(centroid);

        x = centroid[0];
        y = centroid[1];

        //console.log(x, y);

        k = 4;

        centered = currentState;
        zoomedIn = true;

        $(".sideBar").animate({ "width": "250" }, animationLength);
        $("#tooltip-container").hide();

        sideBarHidden = false;
    } else {

        if (hoveredOld) {
            $(this).css({ "fill": "#DDD" });
        }

        currentState = undefined;
        centered = null;

        x = width / 2;
        y = height / 2;
        k = 1;
        zoomedIn = false;
        $(".sideBar").animate({ "width": "0" }, animationLength);

        $(".title").fadeOut(100);
        $(".description").fadeOut(100);

        sideBarHidden = true;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        //black magic(not really) that centers the state you clicked on
        //todo optimize translation for bigger states
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

    //the border looks too big when zoomed
    .style("stroke-width", 1 / k + "px");

    let wikiData;
    let LABEL = currentState != undefined ? currentState.properties.LABEL.toString().replace(/ /g, "_ ") : "";

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&formatversion=2&titles=' + LABEL,
        dataType: "jsonp",
        type: "get",
        success: function(data) {
            for (var id in data.query != undefined ? data.query.pages : "") {
                $(".title,.description").fadeOut(100, function() {
                    $(".title").text(currentState.properties.LABEL);
                    try {
                        $(".description").text(data.query.pages[id].revisions[0].content);
                    } catch (ex) {
                        console.log("There was an error, please contact me at github.com/VikVelev");
                    }
                }).fadeIn(200);
            }
            wikiData = data;
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

function showInfo() {

    //everything is hidden and default, unless otherwise said.

    $("path").css({ "fill": defaultcolor });
    $("#tooltip-container").hide();

    if (outOfSVG) {
        $("#tooltip-container").hide();
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
        }
    } else if (hoveredOld != this) {
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
            $("#tooltip-container").hide();
        } else {
            $("#tooltip-container").show();
            $(".tooltip-text").text($(this).attr("country"));
        }
        //Hovered
        $(this).css({ "fill": "#DDD" });

    } else if (hoveredOld == this && outOfSVG) {
        //Hovered out of the svg
        $(this).css({ "fill": "#DDD" });
    } else {
        //not hovered => at the begining of the function it's filled with default color;
        if (zoomedIn) {
            $(clickedDOM).css({ "fill": "#ff8a00" });
            $("#tooltip-container").hide();
        }

        hoveredOld = null;
    }

    let currentlyClickedState = currentState !== undefined ? currentState.properties.LABEL : "none";

    hoveredOld = this;
    outOfSVG = false;
}

function mouseOut() {
    console.log("Out");
    outOfSVG = true;
    showInfo();
}