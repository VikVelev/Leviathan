function getYear(id) {
    return id.toString().slice(0, 4);
}
// function to check if it's been clicked for zooming

function clicked(d) {

    currentState = d;

    clickedDOM = this;
    $("path").css({ "fill": defaultcolor });
    if (currentState == centered) {
        $("path").css({ "fill": defaultcolor });
    } else {
        $(this).css({ "fill": "#009dff" });
        $(this).css({ "box-shadow": "inset 0 10px 10px 0 #666" });
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

        $(".sideBar").animate({ "width": "250" }, animationLength);
        sideBarHidden = false;
    } else {

        if (hoveredOld) {
            $(this).css({ "fill": "#c9f2ff" });
        }
        currentState = undefined;
        centered = null;

        x = width / 2;
        y = height / 2;
        k = 1;

        $(".sideBar").animate({ "width": "0" }, animationLength);
        sideBarHidden = true;
    }

    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });

    g.transition()
        .duration(750)
        //black magic(not really) that centers the state you clicked on
        //todo optimize translation for bigger states
        //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")

    //the border looks too big when zoomed
    //.style("stroke-width", 1 / k + "px");

    let wikiData;
    let LABEL = currentState != undefined ? currentState.properties.LABEL.toString().replace(/ /g, "_ ") : "";

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + LABEL,
        dataType: "jsonp",
        type: "get",
        success: function(data) {
            for (var id in data.query.pages) {
                $(".title").text(currentState.properties.LABEL);
                $(".description").text(data.query.pages[id].revisions[0]["*"]);
            }
            wikiData = data;
        }
    });
}

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

function showInfo() {

    $("path").css({ "fill": defaultcolor });

    if (hoveredOld != this) {
        if (currentState !== undefined) {
            $(clickedDOM).css({ "fill": "#009dff" })
        }

        $(this).css({ "fill": "#c9f2ff" });

    } else if (hoveredOld == this && outOfSVG) {

        $(this).css({ "fill": "#c9f2ff" });

    } else {
        if (currentState !== undefined) {
            $(clickedDOM).css({ "fill": "#009dff" })
        }

        hoveredOld = null;
    }

    let currentlyClickedState = currentState !== undefined ? currentState.properties.LABEL : "none";

    hoveredOld = this;
    outOfSVG = false;
}

function mouseOut() {
    outOfSVG = true;
    showInfo();
}

function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}